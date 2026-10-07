import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { api, inr } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/landing/Navbar";

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function CheckoutPage() {
  const { items, subtotal, clear, hasPreorder } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");
  const [ship, setShip] = useState({ name: user?.name || "", phone: "", address: "", city: "", state: "", pincode: "" });

  if (user === false) {
    navigate("/login?redirect=/checkout");
    return null;
  }
  if (items.length === 0) {
    return <div className="min-h-screen bg-[#F7F3EA]"><Navbar /><div className="pt-32 text-center text-slate-600">Your cart is empty. <a href="/shop" className="text-brand">Shop now</a></div></div>;
  }

  const shippingFee = subtotal >= 2999 ? 0 : 99;
  const total = subtotal - discount + shippingFee;
  const amountDue = hasPreorder ? Math.round(total * 0.2) : total;

  const applyPromo = async (codeArg) => {
    const code = (typeof codeArg === "string" ? codeArg : promo).trim();
    if (!code) return;
    try {
      const { data } = await api.post("/promo/validate", { code, subtotal });
      setPromo(data.code);
      setDiscount(data.discount);
      setAppliedCode(data.code);
      toast.success(`Promo ${data.code} applied — you saved ${inr(data.discount)}`);
    } catch (e) {
      setDiscount(0);
      setAppliedCode("");
      toast.error(e.response?.data?.detail || "Invalid promo code");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("tpt_promo");
    if (saved) {
      localStorage.removeItem("tpt_promo");
      applyPromo(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k) => (e) => setShip({ ...ship, [k]: e.target.value });

  const placeOrder = async () => {
    for (const [k, v] of Object.entries(ship)) {
      if (!v.trim()) return toast.error(`Please enter your ${k}`);
    }
    setBusy(true);
    try {
      const { data } = await api.post("/checkout", {
        items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
        shipping: ship,
        promo_code: appliedCode || null,
      });
      const order = data.order;

      const finalize = async (rzp = {}) => {
        await api.post("/payments/verify", { order_id: order.id, ...rzp });
        clear();
        toast.success(order.is_preorder ? "Pre-order reserved!" : "Order confirmed!");
        navigate("/account/orders");
      };

      if (data.payments_live) {
        const ok = await loadRazorpay();
        if (!ok) { toast.error("Could not load Razorpay"); setBusy(false); return; }
        const rz = new window.Razorpay({
          key: data.razorpay_key_id,
          amount: data.amount * 100,
          currency: "INR",
          name: "The Pull Theory",
          description: order.is_preorder ? "Pre-order token (20%)" : "Order payment",
          order_id: order.razorpay_order_id,
          prefill: { name: ship.name, email: user.email, contact: ship.phone },
          theme: { color: "#F59E0B" },
          handler: (res) => finalize({
            razorpay_payment_id: res.razorpay_payment_id,
            razorpay_order_id: res.razorpay_order_id,
            razorpay_signature: res.razorpay_signature,
          }),
          modal: { ondismiss: () => setBusy(false) },
        });
        rz.open();
      } else {
        // Demo mode — no live keys configured
        await finalize({ razorpay_payment_id: "demo_" + Date.now() });
      }
    } catch (e) {
      toast.error(e.response?.data?.detail || "Checkout failed");
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-slate-700 font-body">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-20 grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <h1 className="font-heading text-2xl font-extrabold text-slate-900 mb-6">Checkout</h1>
          <div className="space-y-4 bg-[#FFFFFF] border border-slate-200 rounded-2xl p-6">
            <div className="font-heading font-bold text-slate-900">Shipping Address</div>
            <div className="grid grid-cols-2 gap-3">
              {[["name", "Full name"], ["phone", "Phone"], ["address", "Address", true], ["city", "City"], ["state", "State"], ["pincode", "PIN code"]].map(([k, label, full]) => (
                <input key={k} data-testid={`ship-${k}`} value={ship[k]} onChange={set(k)} placeholder={label}
                  className={`bg-[#F7F3EA] border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-brand/60 ${full ? "col-span-2" : ""}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-[#FFFFFF] border border-slate-200 rounded-2xl p-6 sticky top-28">
            <div className="font-heading font-bold text-slate-900 mb-4">Order Summary</div>
            <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="text-slate-600 truncate pr-2">{i.name} ×{i.quantity}</span>
                  <span className="text-slate-900 shrink-0">{inr(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mb-4">
              <input data-testid="promo-input" value={promo} onChange={(e) => setPromo(e.target.value.toUpperCase())} placeholder="Promo code"
                className="flex-1 bg-[#F7F3EA] border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-brand/60 uppercase" />
              <button data-testid="promo-apply" onClick={applyPromo}
                className="px-4 rounded-lg border border-brand/40 text-brand text-sm font-semibold hover:bg-brand hover:text-slate-900 transition-colors">Apply</button>
            </div>
            <div className="border-t border-slate-200 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-emerald-700"><span>Discount ({appliedCode})</span><span>-{inr(discount)}</span></div>}
              <div className="flex justify-between text-slate-600"><span>Shipping</span><span>{shippingFee === 0 ? "FREE" : inr(shippingFee)}</span></div>
              <div className="flex justify-between font-bold text-slate-900 text-base"><span>Total</span><span>{inr(total)}</span></div>
              {hasPreorder && (
                <div className="mt-2 bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-xs text-purple-200">
                  Pre-order: pay 20% token now ({inr(amountDue)}), balance {inr(total - amountDue)} on dispatch.
                </div>
              )}
            </div>
            <button data-testid="place-order-button" disabled={busy} onClick={placeOrder}
              className="w-full mt-5 inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-light disabled:opacity-50 text-black font-semibold py-3 rounded-full transition-colors">
              <Lock className="h-4 w-4" /> {busy ? "Processing…" : `Pay ${inr(amountDue)}`}
            </button>
            <p className="text-[11px] text-slate-500 mt-3 text-center">Secured by Razorpay · UPI · Cards · NetBanking</p>
          </div>
        </div>
      </div>
    </div>
  );
}
