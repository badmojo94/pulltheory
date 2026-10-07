import { ShieldCheck, PackageCheck, Globe2, Video } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck, title: "Authenticity Guarantee", desc: "Every sealed product is sourced direct from official distributors. Factory seals verified on dispatch." },
  { icon: PackageCheck, title: "Vault-Grade Packing", desc: "Anti-tamper bubble wrap, rigid mailers and fragile handling so cards arrive mint across India." },
  { icon: Globe2, title: "Direct Import Sourcing", desc: "Japanese, English and Korean print runs sourced straight from Japan, the US and Korea." },
  { icon: Video, title: "Proof of Packing", desc: "Request a packing video for high-value orders. Full transparency, zero surprises." },
];

export const TrustSection = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
    <div className="text-center max-w-2xl mx-auto mb-12">
      <div className="font-mono text-xs uppercase tracking-[0.25em] text-brand mb-3">Why Collectors Trust Us</div>
      <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
        Built for serious collectors
      </h2>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {ITEMS.map((it) => (
        <div
          key={it.title}
          data-testid={`trust-card-${it.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
          className="rounded-2xl border border-slate-800 bg-[#11151C] p-6 hover:border-slate-700 transition-colors"
        >
          <div className="h-11 w-11 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center mb-4">
            <it.icon className="h-5 w-5 text-brand" />
          </div>
          <h3 className="font-heading text-base font-bold text-white">{it.title}</h3>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">{it.desc}</p>
        </div>
      ))}
    </div>
  </section>
);
