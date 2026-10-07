import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { IMAGES } from "@/data/catalog";

const stats = [
  { v: "50,000+", l: "Packs Dispatched" },
  { v: "100%", l: "Authentic Guarantee" },
  { v: "4.9/5", l: "Collector Rating" },
];

export const Hero = () => (
  <section id="top" className="relative overflow-hidden pt-28 sm:pt-32 pb-16 sm:pb-24">
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse at 60% 0%, rgba(215,38,49,0.18) 0%, rgba(215,38,49,0.07) 42%, rgba(9,11,14,0) 75%)",
      }}
    />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-12 gap-10 items-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="col-span-12 lg:col-span-7"
      >
        <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/30 rounded-full px-3 py-1 mb-6">
          <Sparkles className="h-3.5 w-3.5 text-brand" />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand">
            India's TCG Specialist
          </span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-white">
          Chase the pull.
          <br />
          <span className="bg-gradient-to-r from-brand-light via-brand to-brand-dark bg-clip-text text-transparent">
            Collect the proof.
          </span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
          Authentic Pokémon, One Piece & import TCG — sealed boxes, graded singles and
          protection gear, sourced direct from Japan, the US and Korea. Vault-grade packing,
          shipped across India.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/shop"
            data-testid="hero-explore-cta"
            className="group inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-black font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Explore Sealed Stock
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="/shop?preorder=true"
            data-testid="hero-preorder-cta"
            className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-white px-6 py-3 rounded-full transition-colors"
          >
            View Pre-Orders
          </a>
        </div>
        <div className="mt-10 flex gap-8">
          {stats.map((s) => (
            <div key={s.l}>
              <div className="font-heading text-2xl sm:text-3xl font-extrabold text-white">{s.v}</div>
              <div className="text-xs text-slate-400 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, rotate: -4 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
        className="col-span-12 lg:col-span-5 relative"
      >
        <div className="relative mx-auto max-w-sm">
          <div className="absolute -inset-6 bg-gradient-to-tr from-brand/25 via-rose-600/15 to-rose-500/10 blur-3xl rounded-full" />
          <motion.img
            src={IMAGES.heroFoil}
            alt="Premium holographic booster pack"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative rounded-2xl w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
          />
          <div className="absolute -bottom-3 -left-3 bg-[#11151C]/90 backdrop-blur border border-slate-700 rounded-xl px-4 py-3 flex items-center gap-2 shadow-xl">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <div>
              <div className="text-xs font-semibold text-white">Anti-Tamper Sealed</div>
              <div className="text-[10px] text-slate-400">Verified on dispatch</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);
