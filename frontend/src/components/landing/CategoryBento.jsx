import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/data/catalog";

export const CategoryBento = () => (
  <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
    <div className="flex items-end justify-between gap-4 mb-10">
      <div>
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-brand mb-3">Browse the Vault</div>
        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
          Shop by Category
        </h2>
      </div>
      <a href="#catalog" className="hidden sm:inline-flex items-center gap-1 text-sm text-slate-600 hover:text-brand">
        View all <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[180px] gap-4">
      {CATEGORIES.map((c, i) => (
        <motion.a
          key={c.id}
          href={`/shop?category=${c.id}`}
          data-testid={`category-card-${c.id}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.06 }}
          className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-[#FFFFFF] ${c.span}`}
        >
          <img
            src={c.img}
            alt={c.name}
            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${c.accent} via-black/30 to-black/95`} />
          <div className="relative h-full p-5 flex flex-col justify-end">
            <div className="font-mono text-[11px] text-white/70">{c.count}</div>
            <div className="font-heading text-lg sm:text-xl font-bold text-white mt-1 flex items-center gap-1 group-hover:text-brand-light transition-colors">
              {c.name}
              <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </div>
          </div>
        </motion.a>
      ))}
    </div>
  </section>
);
