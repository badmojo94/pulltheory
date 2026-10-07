import { useEffect, useState } from "react";
import { Search, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { IMAGES } from "@/data/catalog";

const LINKS = ["Pokémon", "One Piece", "Sealed", "Singles", "Accessories", "Pre-Orders"];

export const Navbar = ({ cartCount }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-black/90 text-center text-[11px] sm:text-xs font-mono tracking-wide text-amber-300/90 py-2 px-4 border-b border-slate-800/60">
        100% GUARANTEED SEALED PRODUCTS · FREE EXPRESS SHIPPING ACROSS INDIA OVER ₹2,999
      </div>
      <nav
        data-testid="navbar"
        className={`backdrop-blur-xl border-b transition-colors duration-300 ${
          scrolled ? "bg-[#090B0E]/90 border-slate-800/80" : "bg-[#090B0E]/70 border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-6 h-16">
          <a href="#top" data-testid="navbar-brand-logo" className="flex items-center gap-3 shrink-0">
            <img src={IMAGES.logo} alt="The Pull Theory" className="h-9 w-9 rounded-md object-cover ring-1 ring-slate-700" />
            <div className="leading-none">
              <div className="font-heading font-extrabold text-sm sm:text-base tracking-[0.18em] text-white">
                THE PULL THEORY
              </div>
              <div className="font-mono text-[9px] tracking-[0.3em] text-amber-400/80 mt-0.5">
                TCG SPECIALIST · EST. 2026
              </div>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-6 ml-2">
            {LINKS.map((l) => (
              <a
                key={l}
                href="#catalog"
                data-testid={`nav-link-${l.toLowerCase().replace(/[^a-z]/g, "")}`}
                className="text-sm text-slate-300 hover:text-amber-400 transition-colors"
              >
                {l}
              </a>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-2 bg-[#11151C] border border-slate-800 rounded-full px-3 py-1.5 w-56 focus-within:border-amber-500/50 transition-colors">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                data-testid="navbar-search-input"
                placeholder="Search cards, sets, sealed…"
                className="bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none w-full"
              />
              <kbd className="font-mono text-[10px] text-slate-500 border border-slate-700 rounded px-1">⌘K</kbd>
            </div>

            <button
              data-testid="navbar-lang-button"
              className="hidden sm:flex items-center gap-1 text-sm text-slate-300 hover:text-white px-2 py-1.5 rounded-lg"
            >
              IN · ₹ <ChevronDown className="h-3.5 w-3.5" />
            </button>

            <button
              data-testid="navbar-cart-button"
              className="relative p-2 rounded-full hover:bg-slate-800/60 transition-colors"
            >
              <ShoppingBag className="h-5 w-5 text-slate-200" />
              <span
                data-testid="navbar-cart-count"
                className="absolute -top-0.5 -right-0.5 bg-amber-500 text-black text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center"
              >
                {cartCount}
              </span>
            </button>

            <button
              data-testid="navbar-menu-toggle"
              className="lg:hidden p-2 rounded-full hover:bg-slate-800/60"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-slate-800 bg-[#090B0E] px-4 py-4 flex flex-col gap-3">
            {LINKS.map((l) => (
              <a key={l} href="#catalog" className="text-slate-300 hover:text-amber-400 py-1" onClick={() => setOpen(false)}>
                {l}
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};
