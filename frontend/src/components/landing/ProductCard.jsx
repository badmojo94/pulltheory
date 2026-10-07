import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { LANG, inr } from "@/data/catalog";
import { useCart } from "@/context/CartContext";

const stockBadge = (p) => {
  if (p.is_preorder) return { label: "Pre-Order", cls: "bg-purple-500/10 text-purple-300 border-purple-500/30" };
  if (p.stock <= 0) return { label: "Sold Out", cls: "bg-slate-500/10 text-slate-400 border-slate-600" };
  if (p.stock <= 5) return { label: "Low Stock", cls: "bg-brand/10 text-brand-light border-brand/30" };
  return { label: "In Stock", cls: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" };
};

export const ProductCard = ({ p, index = 0 }) => {
  const lang = LANG[p.language] || { label: p.language, cls: "border-slate-600 text-slate-300" };
  const sb = stockBadge(p);
  const { add } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      data-testid={`product-card-${p.id}`}
      className="group relative rounded-2xl border border-slate-800 bg-[#11151C] overflow-hidden hover:border-brand/50 transition-colors duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
    >
      <Link to={`/product/${p.id}`} className="block relative aspect-[4/5] overflow-hidden bg-black">
        <img
          src={p.image}
          alt={p.name}
          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${lang.cls}`}>{lang.label}</span>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-slate-600 bg-black/50 text-slate-300">
            {p.rarity}
          </span>
        </div>
        <span className={`absolute top-3 right-3 font-mono text-[10px] px-2 py-0.5 rounded-full border ${sb.cls}`}>
          {sb.label}
        </span>
      </Link>

      <div className="p-4">
        <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{p.set_name}</div>
        <Link to={`/product/${p.id}`}>
          <h3 className="font-heading text-sm font-bold text-white mt-1 leading-snug line-clamp-2 min-h-[2.5rem] hover:text-brand-light transition-colors">
            {p.name}
          </h3>
        </Link>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="text-base font-bold text-white">{inr(p.price)}</div>
            {p.mrp && <div className="text-xs text-slate-500 line-through">{inr(p.mrp)}</div>}
          </div>
          <button
            data-testid={`product-add-to-cart-${p.id}`}
            onClick={() => { add(p); toast.success("Added to cart", { description: p.name }); }}
            className="inline-flex items-center gap-1 bg-brand hover:bg-brand-light text-black text-xs font-semibold px-3 py-2 rounded-full transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};
