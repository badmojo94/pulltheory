import { useEffect, useState } from "react";
import { CalendarClock, Lock } from "lucide-react";
import { toast } from "sonner";
import { PREORDERS, LANG } from "@/data/catalog";

const countdown = (iso) => {
  const diff = new Date(iso) - new Date();
  if (diff <= 0) return "Dropping now";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  return `${d}d ${h}h left`;
};

export const PreOrderHighlights = () => {
  const [, tick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="preorders" className="relative py-16 sm:py-24 border-y border-slate-200/80 bg-[#FDFBF6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-brand mb-3">Release Radar</div>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Lock Your Pre-Orders
          </h2>
          <p className="text-slate-600 mt-3 max-w-xl">
            Reserve upcoming Japanese & English drops before they sell out. Pay a token now, balance on dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PREORDERS.map((p) => {
            const lang = LANG[p.lang];
            return (
              <div
                key={p.id}
                data-testid={`preorder-card-${p.id}`}
                className="relative overflow-hidden rounded-2xl border border-slate-200 bg-[#FFFFFF] group"
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF] to-transparent" />
                  <span className={`absolute top-3 left-3 font-mono text-[10px] px-2 py-0.5 rounded-full border ${lang.cls}`}>
                    {lang.name}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-base font-bold text-slate-900 leading-snug">{p.name}</h3>
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-600 font-mono">
                    <CalendarClock className="h-3.5 w-3.5 text-brand" />
                    {countdown(p.release)} · {new Date(p.release).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </div>
                  <a
                    href="/shop?preorder=true"
                    data-testid={`preorder-reserve-${p.id}`}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 border border-brand/40 text-brand hover:bg-brand hover:text-black text-sm font-semibold py-2.5 rounded-full transition-colors"
                  >
                    <Lock className="h-4 w-4" /> Reserve Slot
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
