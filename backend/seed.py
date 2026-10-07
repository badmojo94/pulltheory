import os
import uuid
from datetime import datetime, timezone, timedelta
from db import db
from auth import hash_password

IMG = {
    "booster": "https://images.unsplash.com/photo-1647893977168-6316f6c9ae44?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
    "packs": "https://images.unsplash.com/photo-1666302937150-44f5af2ab474?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
    "onepiece": "https://images.unsplash.com/photo-1734517709196-48873cca9599?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
    "table": "https://images.unsplash.com/photo-1742743031805-aa88ee5f300b?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
    "holo": "https://images.unsplash.com/photo-1708856034151-5de6269965bf?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
    "pile": "https://images.unsplash.com/photo-1647892591717-28c7fd63bb3f?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
    "scatter": "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
    "charizard": "https://images.unsplash.com/photo-1616196334218-caffdc9b2317?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
}

PRODUCTS = [
    {"name": "Terastal Festival ex Booster Box", "set_name": "Scarlet & Violet SV8a", "category": "sealed", "game": "pokemon", "language": "JP", "price": 12499, "mrp": 14999, "stock": 18, "rarity": "Sealed", "image": IMG["booster"], "featured": True, "description": "Factory-sealed Japanese booster box, 32 packs. Direct import."},
    {"name": "151 Ultra Premium Collection", "set_name": "Scarlet & Violet", "category": "elite", "game": "pokemon", "language": "EN", "price": 8999, "mrp": 9999, "stock": 6, "rarity": "Elite Box", "image": IMG["packs"], "featured": True, "description": "English UPC with promo cards, sleeves and metal collectible."},
    {"name": "Charizard VMAX — Rainbow Rare", "set_name": "Champion's Path", "category": "singles", "game": "pokemon", "language": "EN", "price": 24999, "stock": 3, "rarity": "Secret Rare", "image": IMG["charizard"], "featured": True, "description": "Near-mint rainbow rare Charizard VMAX single."},
    {"name": "Mewtwo V Alt-Art — Korean Print", "set_name": "Pokémon GO", "category": "singles", "game": "pokemon", "language": "KR", "price": 4299, "stock": 10, "rarity": "Alt Art", "image": IMG["holo"], "description": "Korean print alt-art Mewtwo V."},
    {"name": "Premium Toploader Vault (50pk)", "set_name": "The Pull Theory Gear", "category": "accessories", "game": "accessory", "language": "EN", "price": 1299, "mrp": 1599, "stock": 120, "rarity": "Accessory", "image": IMG["table"], "description": "Rigid toploaders for high-value singles, pack of 50."},
    {"name": "Obsidian Flames Booster Bundle", "set_name": "Scarlet & Violet", "category": "sealed", "game": "pokemon", "language": "EN", "price": 3799, "mrp": 4499, "stock": 25, "rarity": "Bundle", "image": IMG["scatter"], "featured": True, "description": "6-pack English booster bundle."},
    {"name": "Luffy Leader Parallel — Graded 10", "set_name": "One Piece OP-01", "category": "singles", "game": "onepiece", "language": "JP", "price": 18999, "stock": 2, "rarity": "Graded", "image": IMG["pile"], "featured": True, "description": "PSA/graded 10 Luffy leader parallel."},
    {"name": "OP-07 500 Years Future Booster Box", "set_name": "One Piece Card Game", "category": "sealed", "game": "onepiece", "language": "JP", "price": 6499, "mrp": 7499, "stock": 14, "rarity": "Booster Box", "image": IMG["onepiece"], "featured": True, "description": "Sealed Japanese One Piece booster box, 24 packs."},
    # Pre-orders
    {"name": "Pokémon SV9 Battle Partners Booster Box", "set_name": "Scarlet & Violet SV9", "category": "sealed", "game": "pokemon", "language": "JP", "price": 11999, "stock": 50, "rarity": "Pre-Order", "image": IMG["booster"], "is_preorder": True, "release_date": "2026-07-18", "featured": True, "description": "Reserve the upcoming SV9 Japanese booster box."},
    {"name": "One Piece OP-10 Royal Bloodline Box", "set_name": "One Piece Card Game", "category": "sealed", "game": "onepiece", "language": "JP", "price": 6999, "stock": 40, "rarity": "Pre-Order", "image": IMG["onepiece"], "is_preorder": True, "release_date": "2026-08-02", "description": "Reserve OP-10 before release."},
    {"name": "Prismatic Evolutions Elite Trainer Box", "set_name": "Scarlet & Violet", "category": "elite", "game": "pokemon", "language": "EN", "price": 5499, "stock": 60, "rarity": "Pre-Order", "image": IMG["packs"], "is_preorder": True, "release_date": "2026-07-05", "featured": True, "description": "English ETB pre-order."},
]


async def seed():
    # Admin
    admin_email = os.environ["ADMIN_EMAIL"]
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({"user_id": f"user_{uuid.uuid4().hex[:12]}", "email": admin_email,
                                   "name": "Admin", "password_hash": hash_password(admin_password),
                                   "role": "admin", "picture": "", "created_at": datetime.now(timezone.utc).isoformat()})
    # Products
    if await db.products.count_documents({}) == 0:
        for p in PRODUCTS:
            doc = dict(p)
            doc.setdefault("is_preorder", False)
            doc.setdefault("mrp", None)
            doc.setdefault("featured", False)
            doc["id"] = f"prod_{uuid.uuid4().hex[:10]}"
            doc["created_at"] = datetime.now(timezone.utc).isoformat()
            await db.products.insert_one(doc)
    if await db.promos.count_documents({}) == 0:
        await db.promos.insert_many([
            {"code": "WELCOME10", "type": "percent", "value": 10, "min_order": 1500, "max_discount": 1000, "usage_limit": None, "active": True, "expires_at": None, "used_count": 0},
            {"code": "PULL500", "type": "flat", "value": 500, "min_order": 4000, "max_discount": None, "usage_limit": None, "active": True, "expires_at": None, "used_count": 0},
        ])
    await db.promos.update_many({"featured": {"$exists": False}}, {"$set": {"featured": False}})
    await db.promos.update_one({"code": "WELCOME10"}, {"$set": {"featured": True}})
    welcome = await db.promos.find_one({"code": "WELCOME10"})
    if welcome and not welcome.get("expires_at"):
        exp = (datetime.now(timezone.utc) + timedelta(days=14)).isoformat()
        await db.promos.update_one({"code": "WELCOME10"}, {"$set": {"expires_at": exp}})
    await db.users.create_index("email", unique=True)
    await db.users.create_index("user_id")
    await db.products.create_index("id")
    await db.orders.create_index("user_id")
