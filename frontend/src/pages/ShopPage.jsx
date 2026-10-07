import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { api, inr } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { LANG } from "@/data/catalog";
import { Navbar } from "@/components/landing/Navbar";
import { NewsletterFooter } from "@/components/landing/NewsletterFooter";

const CATS = [
  { id: "", name: "All" },
  { id: "sealed", name: "Sealed" },
  { id: "singles", name: "Singles" },
  { id: "elite", name: "Elite Boxes" },
  { id: "accessories", name: "Accessories" },
];
const GAMES = [
  { id: "", name: "All Games" },
  { id: "pokemon", name: "Pokémon" },
  { id: "onepiece", name: "One Piece" },
];
const LANGS = ["", "JP", "EN", "KR"];

export default function ShopPage() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { add } = useCart();

  const category = params.get("category") || "";
  const game = params.get("game") || "";
  const language = params.get("language") || "";
  const preorder = params.get("preorder");

  useEffect(() => {
    setLoading(true);
    const q = {};
    if (category) q.category = category;
    if (game) q.game = game;
    if (language) q.language = language;
    if (preorder) q.preorder = true;
    api.get("/products", { params: q }).then(({ data }) => setProducts(data)).finally(() => setLoading(false));
  }, [category, game, language, preorder]);

  const setFilter = (k, v) => {
    const next = new URLSearchParams(params);
    v ? next.set(k, v) : next.delete(k);
    setParams(next);
  };

  return (
    <div className="min-h-screen bg-[#090B0E] text-slate-200 font-body">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="mb-8">
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-brand mb-2">The Vault</div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
            {preorder ? "Pre-Orders" : "Shop All TCG"}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {CATS.map((c) => (
            <button key={c.id} data-testid={`shop-cat-${c.id || "all"}`} onClick={() => setFilter("category", c.id)}
              className={`text-xs px-3.5 py-2 rounded-full border transition-colors ${category === c.id ? "bg-white text-black border-white" : "border-slate-700 text-slate-300 hover:border-slate-500"}`}>
              {c.name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {GAMES.map((g) => (
            <button key={g.id} onClick={() => setFilter("game", g.id)}
              className={`text-xs px-3 py-1.5 rounded-full border ${game === g.id ? "bg-brand text-black border-brand" : "border-slate-800 text-slate-400"}`}>{g.name}</button>
          ))}
          <span className="w-px bg-slate-800 mx-1" />
          {LANGS.map((l) => (
            <button key={l || "all"} onClick={() => setFilter("language", l)}
              className={`text-xs px-3 py-1.5 rounded-full border ${language === l ? "bg-brand text-black border-brand" : "border-slate-800 text-slate-400"}`}>{l || "All Lang"}</button>
          ))}
        </div>

        {loading ? (
          <div className="text-slate-400 py-20 text-center">Loading inventory…</div>
        ) : products.length === 0 ? (
          <div className="text-slate-400 py-20 text-center">No products match these filters.</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <div key={p.id} data-testid={`shop-product-${p.id}`} className="group rounded-2xl border border-slate-800 bg-[#11151C] overflow-hidden hover:border-brand/50 transition-colors">
                <Link to={`/product/${p.id}`} className="block relative aspect-[4/5] overflow-hidden bg-black">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${LANG[p.language]?.cls || "border-slate-600 text-slate-300"}`}>{p.language}</span>
                    {p.is_preorder && <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300">Pre-Order</span>}
                  </div>
                </Link>
                <div className="p-4">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{p.set_name}</div>
                  <Link to={`/product/${p.id}`}><h3 className="font-heading text-sm font-bold text-white mt-1 leading-snug line-clamp-2 min-h-[2.5rem] hover:text-brand-light">{p.name}</h3></Link>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <div className="text-base font-bold text-white">{inr(p.price)}</div>
                      {p.mrp && <div className="text-xs text-slate-500 line-through">{inr(p.mrp)}</div>}
                    </div>
                    <button data-testid={`shop-add-${p.id}`} onClick={() => { add(p); toast.success("Added to cart", { description: p.name }); }}
                      className="bg-brand hover:bg-brand-light text-black text-xs font-semibold px-3 py-2 rounded-full transition-colors">Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <NewsletterFooter />
    </div>
  );
}
