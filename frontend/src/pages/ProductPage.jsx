import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { ShieldCheck, Truck, Plus, Minus, ArrowLeft, CalendarClock } from "lucide-react";
import { api, inr } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { LANG } from "@/data/catalog";
import { Navbar } from "@/components/landing/Navbar";
import { NewsletterFooter } from "@/components/landing/NewsletterFooter";

export default function ProductPage() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setP(data)).catch(() => setP(false));
  }, [id]);

  if (p === null) return <div className="min-h-screen bg-[#F7F3EA]"><Navbar /><div className="pt-32 text-center text-slate-600">Loading…</div></div>;
  if (p === false) return <div className="min-h-screen bg-[#F7F3EA]"><Navbar /><div className="pt-32 text-center text-slate-600">Product not found. <Link to="/shop" className="text-brand">Back to shop</Link></div></div>;

  const token = Math.round(p.price * 0.2);

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-slate-700 font-body">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-brand mb-6"><ArrowLeft className="h-4 w-4" /> Back to shop</Link>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-black aspect-[4/5]">
            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`font-mono text-[11px] px-2.5 py-1 rounded-full border ${LANG[p.language]?.cls || "border-slate-300 text-slate-600"}`}>{LANG[p.language]?.name || p.language}</span>
              <span className="font-mono text-[11px] px-2.5 py-1 rounded-full border border-slate-300 text-slate-600">{p.rarity}</span>
              {p.is_preorder && <span className="font-mono text-[11px] px-2.5 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-700">Pre-Order</span>}
            </div>
            <div className="font-mono text-xs uppercase tracking-wider text-slate-500">{p.set_name}</div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{p.name}</h1>
            <p className="text-slate-600 mt-4 leading-relaxed">{p.description}</p>

            <div className="flex items-end gap-3 mt-6">
              <div className="text-3xl font-extrabold text-slate-900">{inr(p.price)}</div>
              {p.mrp && <div className="text-lg text-slate-500 line-through mb-0.5">{inr(p.mrp)}</div>}
            </div>
            {p.is_preorder && (
              <div className="mt-3 flex items-center gap-2 text-sm text-purple-700">
                <CalendarClock className="h-4 w-4" /> Reserve with {inr(token)} token (20%), balance on dispatch
                {p.release_date && <span className="text-slate-600">· Releases {new Date(p.release_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
              </div>
            )}
            <div className="mt-2 text-sm text-slate-600">{p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}</div>

            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-3 border border-slate-300 rounded-full px-3 py-2">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="h-4 w-4 text-slate-600" /></button>
                <span className="w-6 text-center text-slate-900" data-testid="product-qty">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)}><Plus className="h-4 w-4 text-slate-600" /></button>
              </div>
              <button
                data-testid="product-add-to-cart"
                disabled={p.stock <= 0}
                onClick={() => { add(p, qty); toast.success("Added to cart", { description: p.name }); }}
                className="flex-1 bg-brand hover:bg-brand-light disabled:opacity-40 text-black font-semibold py-3 rounded-full transition-colors"
              >
                {p.is_preorder ? "Reserve Pre-Order" : "Add to Cart"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
              <div className="flex items-center gap-2 border border-slate-200 rounded-xl p-3"><ShieldCheck className="h-5 w-5 text-emerald-400" /><span className="text-xs text-slate-600">100% Authentic, sealed verified</span></div>
              <div className="flex items-center gap-2 border border-slate-200 rounded-xl p-3"><Truck className="h-5 w-5 text-brand" /><span className="text-xs text-slate-600">Vault-grade packing across India</span></div>
            </div>
          </div>
        </div>
      </div>
      <NewsletterFooter />
    </div>
  );
}
