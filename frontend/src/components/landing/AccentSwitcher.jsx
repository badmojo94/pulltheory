import { useState } from "react";
import { Palette, Check } from "lucide-react";

export const ACCENTS = {
  crimson: { name: "Crimson", swatch: "#C0392B", vars: ["#C0392B", "#D9594C", "#8E2A20", "6 64% 46%"] },
  oxblood: { name: "Oxblood", swatch: "#8C2F39", vars: ["#8C2F39", "#A94452", "#5E1E27", "351 50% 37%"] },
  indigo: { name: "Indigo", swatch: "#4338CA", vars: ["#4338CA", "#5B52E0", "#312A8F", "245 56% 51%"] },
};

export function applyAccent(key) {
  const a = ACCENTS[key];
  if (!a) return;
  const s = document.documentElement.style;
  s.setProperty("--color-brand", a.vars[0]);
  s.setProperty("--color-brand-light", a.vars[1]);
  s.setProperty("--color-brand-dark", a.vars[2]);
  s.setProperty("--primary", a.vars[3]);
  s.setProperty("--accent", a.vars[3]);
  s.setProperty("--ring", a.vars[3]);
  localStorage.setItem("tpt_accent", key);
}

export const AccentSwitcher = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => localStorage.getItem("tpt_accent") || "crimson");

  const pick = (key) => {
    applyAccent(key);
    setActive(key);
  };

  return (
    <div className="fixed bottom-4 left-4 z-40" data-testid="accent-switcher">
      {open && (
        <div className="mb-2 bg-[#FFFFFF] border border-slate-200 rounded-2xl p-3 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mb-2 px-1">Brand Accent</div>
          <div className="flex flex-col gap-1.5">
            {Object.entries(ACCENTS).map(([key, a]) => (
              <button
                key={key}
                data-testid={`accent-${key}`}
                onClick={() => pick(key)}
                className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-slate-100 transition-colors text-left"
              >
                <span className="h-5 w-5 rounded-full ring-1 ring-black/10" style={{ backgroundColor: a.swatch }} />
                <span className="text-sm text-slate-700 flex-1">{a.name}</span>
                {active === key && <Check className="h-4 w-4 text-brand" />}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        data-testid="accent-toggle"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-brand hover:bg-brand-light text-white rounded-full pl-3 pr-4 py-2.5 shadow-lg transition-colors"
        aria-label="Change brand accent"
      >
        <Palette className="h-4 w-4" />
        <span className="text-xs font-semibold">Theme</span>
      </button>
    </div>
  );
};
