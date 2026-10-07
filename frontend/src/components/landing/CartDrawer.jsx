import { Link, useNavigate } from "react-router-dom";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { inr } from "@/lib/api";
import { LANG } from "@/data/catalog";

export const CartDrawer = () => {
  const { items, open, setOpen, remove, setQty, subtotal, count, hasPreorder } = useCart();
  const navigate = useNavigate();

  if (!open) return null;
  const shipping = subtotal >= 2999 || subtotal === 0 ? 0 : 99;

  return (
    <div className="fixed inset-0 z-[60]" data-testid="cart-drawer">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[#0B0E13] border-l border-slate-800 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h3 className="font-heading font-bold text-white flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-amber-400" /> Your Cart ({count})
          </h3>
          <button data-testid="cart-close" onClick={() => setOpen(false)} className="p-1.5 rounded-full hover:bg-slate-800">
            <X className="h-5 w-5 text-slate-300" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 && (
            <div className="text-center text-slate-400 mt-20">
              <p>Your cart is empty.</p>
              <Link to="/shop" onClick={() => setOpen(false)} className="text-amber-400 text-sm mt-2 inline-block">Browse the vault →</Link>
            </div>
          )}
          {items.map((i) => (
            <div key={i.id} data-testid={`cart-item-${i.id}`} className="flex gap-3 border border-slate-800 rounded-xl p-3 bg-[#11151C]">
              <img src={i.image} alt={i.name} className="h-16 w-16 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-full border ${LANG[i.language]?.cls || "border-slate-600 text-slate-300"}`}>{i.language}</span>
                  {i.is_preorder && <span className="font-mono text-[9px] text-purple-300">Pre-Order</span>}
                </div>
                <div className="text-sm text-white font-medium truncate mt-1">{i.name}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setQty(i.id, i.quantity - 1)} className="h-6 w-6 rounded border border-slate-700 flex items-center justify-center text-slate-300"><Minus className="h-3 w-3" /></button>
                    <span className="text-sm text-white w-5 text-center">{i.quantity}</span>
                    <button onClick={() => setQty(i.id, i.quantity + 1)} className="h-6 w-6 rounded border border-slate-700 flex items-center justify-center text-slate-300"><Plus className="h-3 w-3" /></button>
                  </div>
                  <div className="text-sm font-bold text-white">{inr(i.price * i.quantity)}</div>
                </div>
              </div>
              <button onClick={() => remove(i.id)} className="text-slate-500 hover:text-red-400 self-start"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-slate-800 space-y-3">
            <div className="flex justify-between text-sm text-slate-300"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
            <div className="flex justify-between text-sm text-slate-300"><span>Shipping</span><span>{shipping === 0 ? "FREE" : inr(shipping)}</span></div>
            {hasPreorder && <div className="text-xs text-purple-300">Pre-order items: 20% token charged now, balance on dispatch.</div>}
            <div className="flex justify-between font-bold text-white text-lg"><span>Total</span><span>{inr(subtotal + shipping)}</span></div>
            <button
              data-testid="cart-checkout-button"
              onClick={() => { setOpen(false); navigate("/checkout"); }}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-3 rounded-full transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
