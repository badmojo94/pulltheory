import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ProductCard } from "./ProductCard";

const TABS = [
  { id: "all", name: "All" },
  { id: "JP", name: "Japanese · Direct Import" },
  { id: "EN", name: "English · US/EU" },
  { id: "KR", name: "Korean" },
];

export const NewArrivals = () => {
  const [tab, setTab] = useState("all");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products", { params: { featured: true } }).then(({ data }) => setProducts(data));
  }, []);

  const list = tab === "all" ? products : products.filter((p) => p.language === tab);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-brand mb-3">Fresh on the Shelf</div>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            New Arrivals & Featured
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              data-testid={`filter-language-${t.id.toLowerCase()}`}
              onClick={() => setTab(t.id)}
              className={`text-xs font-medium px-3.5 py-2 rounded-full border transition-colors ${
                tab === t.id
                  ? "bg-white text-black border-white"
                  : "border-slate-700 text-slate-300 hover:border-slate-500"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {list.map((p, i) => (
          <ProductCard key={p.id} p={p} index={i} />
        ))}
      </div>
    </section>
  );
};
