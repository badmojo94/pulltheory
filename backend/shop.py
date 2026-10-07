import os
import uuid
import hmac
import hashlib
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Depends, Request, BackgroundTasks
from pydantic import BaseModel
from db import db
from auth import get_current_user, require_admin

shop_router = APIRouter(prefix="/api", tags=["shop"])

RZP_KEY = os.environ.get("RAZORPAY_KEY_ID", "")
RZP_SECRET = os.environ.get("RAZORPAY_KEY_SECRET", "")
PAYMENTS_LIVE = bool(RZP_KEY and RZP_SECRET)


def now_iso():
    return datetime.now(timezone.utc).isoformat()


# ---------- Catalog ----------
class ProductInput(BaseModel):
    name: str
    set_name: str = ""
    category: str
    game: str = "pokemon"
    language: str = "EN"
    price: int
    mrp: Optional[int] = None
    stock: int = 0
    rarity: str = ""
    image: str = ""
    is_preorder: bool = False
    release_date: Optional[str] = None
    featured: bool = False
    description: str = ""


@shop_router.get("/products")
async def list_products(category: Optional[str] = None, game: Optional[str] = None,
                        language: Optional[str] = None, preorder: Optional[bool] = None,
                        featured: Optional[bool] = None, q: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    if game:
        query["game"] = game
    if language:
        query["language"] = language
    if preorder is not None:
        query["is_preorder"] = preorder
    if featured is not None:
        query["featured"] = featured
    if q:
        query["name"] = {"$regex": q, "$options": "i"}
    items = await db.products.find(query, {"_id": 0}).to_list(500)
    return items


@shop_router.get("/products/{pid}")
async def get_product(pid: str):
    p = await db.products.find_one({"id": pid}, {"_id": 0})
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    return p


@shop_router.post("/products")
async def create_product(data: ProductInput, admin=Depends(require_admin)):
    doc = data.model_dump()
    doc["id"] = f"prod_{uuid.uuid4().hex[:10]}"
    doc["created_at"] = now_iso()
    await db.products.insert_one(doc)
    doc.pop("_id", None)
    return doc


@shop_router.put("/products/{pid}")
async def update_product(pid: str, data: ProductInput, admin=Depends(require_admin)):
    res = await db.products.update_one({"id": pid}, {"$set": data.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return await db.products.find_one({"id": pid}, {"_id": 0})


@shop_router.delete("/products/{pid}")
async def delete_product(pid: str, admin=Depends(require_admin)):
    await db.products.delete_one({"id": pid})
    return {"ok": True}


# ---------- Orders / Checkout ----------
class CartItem(BaseModel):
    product_id: str
    quantity: int = 1


class CheckoutInput(BaseModel):
    items: List[CartItem]
    shipping: dict
    is_preorder: bool = False
    promo_code: Optional[str] = None


async def _build_order(user, data: CheckoutInput):
    line_items, subtotal, has_preorder = [], 0, False
    for ci in data.items:
        p = await db.products.find_one({"id": ci.product_id}, {"_id": 0})
        if not p:
            raise HTTPException(status_code=400, detail=f"Product {ci.product_id} unavailable")
        if p.get("is_preorder"):
            has_preorder = True
        line_items.append({"product_id": p["id"], "name": p["name"], "image": p.get("image", ""),
                           "price": p["price"], "quantity": ci.quantity, "language": p.get("language", "EN")})
        subtotal += p["price"] * ci.quantity
    discount, promo_code = await _apply_promo(data.promo_code, subtotal)
    shipping_fee = 0 if subtotal >= 2999 else 99
    total = subtotal - discount + shipping_fee
    is_preorder = data.is_preorder or has_preorder
    amount_due = round(total * 0.20) if is_preorder else total
    return line_items, subtotal, discount, promo_code, shipping_fee, total, is_preorder, amount_due


async def _apply_promo(code, subtotal):
    if not code:
        return 0, None
    promo = await db.promos.find_one({"code": code.upper(), "active": True}, {"_id": 0})
    if not promo:
        raise HTTPException(status_code=400, detail="Invalid or inactive promo code")
    if promo.get("starts_at"):
        st = datetime.fromisoformat(promo["starts_at"])
        if st.tzinfo is None:
            st = st.replace(tzinfo=timezone.utc)
        if st > datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="This promo code is not active yet")
    if promo.get("expires_at"):
        exp = datetime.fromisoformat(promo["expires_at"])
        if exp.tzinfo is None:
            exp = exp.replace(tzinfo=timezone.utc)
        if exp < datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="This promo code has expired")
    if subtotal < promo.get("min_order", 0):
        raise HTTPException(status_code=400, detail=f"Minimum order of ₹{promo['min_order']} required for this code")
    if promo.get("usage_limit") and promo.get("used_count", 0) >= promo["usage_limit"]:
        raise HTTPException(status_code=400, detail="This promo code has reached its usage limit")
    disc = round(subtotal * promo["value"] / 100) if promo["type"] == "percent" else promo["value"]
    if promo.get("max_discount"):
        disc = min(disc, promo["max_discount"])
    return min(disc, subtotal), promo["code"]


@shop_router.post("/checkout")
async def checkout(data: CheckoutInput, user=Depends(get_current_user)):
    line_items, subtotal, discount, promo_code, shipping_fee, total, is_preorder, amount_due = await _build_order(user, data)
    order_id = f"TPT{datetime.now().strftime('%y%m%d')}{uuid.uuid4().hex[:6].upper()}"
    rzp_order = None
    if PAYMENTS_LIVE:
        import razorpay
        rc = razorpay.Client(auth=(RZP_KEY, RZP_SECRET))
        rzp_order = rc.order.create({"amount": amount_due * 100, "currency": "INR",
                                     "receipt": order_id[:40], "payment_capture": 1})
    if promo_code:
        await db.promos.update_one({"code": promo_code}, {"$inc": {"used_count": 1}})
    doc = {"id": order_id, "user_id": user["user_id"], "email": user["email"],
           "items": line_items, "subtotal": subtotal, "discount": discount, "promo_code": promo_code,
           "shipping_fee": shipping_fee, "total": total, "amount_due": amount_due,
           "balance_due": total - amount_due, "is_preorder": is_preorder, "shipping": data.shipping,
           "status": "pending", "payment_status": "pending",
           "razorpay_order_id": rzp_order["id"] if rzp_order else None,
           "created_at": now_iso()}
    await db.orders.insert_one(doc)
    doc.pop("_id", None)
    return {"order": doc, "payments_live": PAYMENTS_LIVE, "razorpay_key_id": RZP_KEY,
            "amount": amount_due}


class ValidatePromoInput(BaseModel):
    code: str
    subtotal: int


@shop_router.post("/promo/validate")
async def validate_promo(data: ValidatePromoInput, user=Depends(get_current_user)):
    discount, code = await _apply_promo(data.code, data.subtotal)
    return {"discount": discount, "code": code}


class PromoInput(BaseModel):
    code: str
    type: str = "percent"
    value: int
    min_order: int = 0
    max_discount: Optional[int] = None
    usage_limit: Optional[int] = None
    active: bool = True
    starts_at: Optional[str] = None
    expires_at: Optional[str] = None
    featured: bool = False


@shop_router.get("/promo/featured")
async def featured_promo():
    now = datetime.now(timezone.utc)
    promos = await db.promos.find({"active": True, "featured": True}, {"_id": 0}).to_list(50)
    for p in promos:
        if p.get("starts_at"):
            st = datetime.fromisoformat(p["starts_at"])
            if st.tzinfo is None:
                st = st.replace(tzinfo=timezone.utc)
            if st > now:
                continue
        if p.get("expires_at"):
            ex = datetime.fromisoformat(p["expires_at"])
            if ex.tzinfo is None:
                ex = ex.replace(tzinfo=timezone.utc)
            if ex < now:
                continue
        if p.get("usage_limit") and p.get("used_count", 0) >= p["usage_limit"]:
            continue
        return {"code": p["code"], "type": p["type"], "value": p["value"], "min_order": p.get("min_order", 0), "expires_at": p.get("expires_at")}
    return None


@shop_router.get("/promos")
async def list_promos(admin=Depends(require_admin)):
    return await db.promos.find({}, {"_id": 0}).to_list(200)


@shop_router.post("/promos")
async def create_promo(data: PromoInput, admin=Depends(require_admin)):
    doc = data.model_dump()
    doc["code"] = doc["code"].upper()
    doc["used_count"] = 0
    if await db.promos.find_one({"code": doc["code"]}):
        raise HTTPException(status_code=400, detail="Promo code already exists")
    await db.promos.insert_one(doc)
    doc.pop("_id", None)
    return doc


@shop_router.delete("/promos/{code}")
async def delete_promo(code: str, admin=Depends(require_admin)):
    await db.promos.delete_one({"code": code.upper()})
    return {"ok": True}


class VerifyInput(BaseModel):
    order_id: str
    razorpay_payment_id: Optional[str] = None
    razorpay_order_id: Optional[str] = None
    razorpay_signature: Optional[str] = None


@shop_router.post("/payments/verify")
async def verify_payment(data: VerifyInput, user=Depends(get_current_user)):
    order = await db.orders.find_one({"id": data.order_id, "user_id": user["user_id"]}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if PAYMENTS_LIVE:
        msg = f"{data.razorpay_order_id}|{data.razorpay_payment_id}".encode()
        expected = hmac.new(RZP_SECRET.encode(), msg, hashlib.sha256).hexdigest()
        if not data.razorpay_signature or not hmac.compare_digest(expected, data.razorpay_signature):
            raise HTTPException(status_code=400, detail="Payment signature verification failed")
    # demo mode or verified
    new_status = "reserved" if order["is_preorder"] else "confirmed"
    await db.orders.update_one({"id": data.order_id}, {"$set": {
        "payment_status": "token_paid" if order["is_preorder"] else "paid",
        "status": new_status, "razorpay_payment_id": data.razorpay_payment_id,
        "paid_at": now_iso()}})
    # decrement stock
    for it in order["items"]:
        await db.products.update_one({"id": it["product_id"]}, {"$inc": {"stock": -it["quantity"]}})
    if order["is_preorder"]:
        await db.notifications.insert_one({
            "id": f"ntf_{uuid.uuid4().hex[:10]}", "user_id": user["user_id"],
            "title": "Pre-order reserved", "body": f"Your pre-order {order['id']} is locked. We'll notify you on release.",
            "read": False, "created_at": now_iso()})
    return {"ok": True, "status": new_status}


@shop_router.get("/orders")
async def my_orders(user=Depends(get_current_user)):
    return await db.orders.find({"user_id": user["user_id"]}, {"_id": 0}).sort("created_at", -1).to_list(200)


@shop_router.get("/notifications")
async def my_notifications(user=Depends(get_current_user)):
    return await db.notifications.find({"user_id": user["user_id"]}, {"_id": 0}).sort("created_at", -1).to_list(100)


@shop_router.post("/notifications/{nid}/read")
async def read_notification(nid: str, user=Depends(get_current_user)):
    await db.notifications.update_one({"id": nid, "user_id": user["user_id"]}, {"$set": {"read": True}})
    return {"ok": True}


# ---------- Admin ----------
@shop_router.get("/admin/orders")
async def admin_orders(admin=Depends(require_admin)):
    return await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@shop_router.post("/admin/orders/{oid}/status")
async def admin_update_status(oid: str, body: dict, admin=Depends(require_admin)):
    status = body.get("status")
    await db.orders.update_one({"id": oid}, {"$set": {"status": status}})
    return {"ok": True}


async def _release_product(pid):
    p = await db.products.find_one({"id": pid}, {"_id": 0})
    if not p:
        return None
    await db.products.update_one({"id": pid}, {"$set": {"is_preorder": False, "released_at": now_iso()}})
    orders = await db.orders.find({"items.product_id": pid, "is_preorder": True}, {"_id": 0}).to_list(1000)
    for o in orders:
        await db.notifications.insert_one({
            "id": f"ntf_{uuid.uuid4().hex[:10]}", "user_id": o["user_id"],
            "title": f"{p['name']} has arrived!",
            "body": f"Your pre-order is now in stock. Balance of ₹{o['balance_due']} due for dispatch.",
            "read": False, "created_at": now_iso()})
    return len(orders)


@shop_router.post("/admin/products/{pid}/release")
async def release_preorder(pid: str, admin=Depends(require_admin)):
    notified = await _release_product(pid)
    if notified is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"ok": True, "notified": notified}


CRON_SECRET = os.environ.get("WEBHOOK_CRON_SECRET", "")


async def _run_preorder_release():
    now = datetime.now(timezone.utc)
    due = await db.products.find({"is_preorder": True, "release_date": {"$ne": None}}, {"_id": 0}).to_list(2000)
    for p in due:
        raw = p.get("release_date")
        if not raw:
            continue
        try:
            rd = datetime.fromisoformat(raw if "T" in raw else raw + "T00:00:00")
        except (ValueError, TypeError):
            continue
        if rd.tzinfo is None:
            rd = rd.replace(tzinfo=timezone.utc)
        if rd <= now:
            await _release_product(p["id"])


@shop_router.post("/cron/release-preorders")
async def cron_release_preorders(request: Request, background: BackgroundTasks):
    # Cron endpoints must ack 2xx immediately; enqueue/background the actual work.
    auth = request.headers.get("Authorization", "")
    token = auth[7:] if auth.startswith("Bearer ") else ""
    if not CRON_SECRET or not hmac.compare_digest(token, CRON_SECRET):
        raise HTTPException(status_code=401, detail="Unauthorized")
    background.add_task(_run_preorder_release)
    return {"ok": True, "queued": True}


@shop_router.get("/admin/stats")
async def admin_stats(admin=Depends(require_admin)):
    orders = await db.orders.find({}, {"_id": 0}).to_list(2000)
    revenue = sum(o.get("amount_due", 0) for o in orders if o.get("payment_status") in ("paid", "token_paid"))
    products = await db.products.count_documents({})
    customers = await db.users.count_documents({"role": "customer"})
    return {"revenue": revenue, "orders": len(orders), "products": products, "customers": customers}
