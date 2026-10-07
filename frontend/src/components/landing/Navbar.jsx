import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Menu, X, ChevronDown, User, Tag } from "lucide-react";
import { toast } from "sonner";
import { IMAGES } from "@/data/catalog";
import { api } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const countdown = (iso) => {
  const diff = new Date(iso) - Date.now();
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return d > 0 ? `${d}d ${h}h` : `${h}h ${m}m`;
};

const LINKS = [
  { label: "Pokémon", to: "/shop?game=pokemon" },
  { label: "One Piece", to: "/shop?game=onepiece" },
  { label: "Sealed", to: "/shop?category=sealed" },
  { label: "Singles", to: "/shop?category=singles" },
  { label: "Accessories", to: "/shop?category=accessories" },
  { label: "Pre-Orders", to: "/shop?preorder=true" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count, setOpen: setCartOpen } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featured, setFeatured] = useState(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    api.get("/promo/featured").then(({ data }) => {
      if (data && localStorage.getItem("tpt_promo_banner_dismissed") !== data.code) setFeatured(data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 60000);
    return () => clearInterval(t);
  }, []);

  const promoLabel = featured ? (featured.type === "percent" ? `${featured.value}% OFF` : `₹${featured.value} OFF`) : "";
  const remaining = featured?.expires_at ? countdown(featured.expires_at) : null;

  const applyFeatured = () => {
    localStorage.setItem("tpt_promo", featured.code);
    toast.success(`Code ${featured.code} saved — applied at checkout`);
    navigate("/shop");
  };

  const dismissBanner = () => {
    localStorage.setItem("tpt_promo_banner_dismissed", featured.code);
    setFeatured(null);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {featured ? (
        <div className="bg-brand text-white text-[11px] sm:text-xs font-mono tracking-wide py-2 px-4 border-b border-brand-dark flex items-center justify-center gap-3">
          <span className="flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5" /> Use code <strong className="font-bold">{featured.code}</strong> for {promoLabel}
            {featured.min_order ? <span className="opacity-80">on orders over ₹{featured.min_order}</span> : null}
            {remaining ? <span className="font-bold">· ends in {remaining}</span> : null}
          </span>
          <button data-testid="promo-banner-apply" onClick={applyFeatured} className="bg-white/95 hover:bg-white text-brand font-bold rounded-full px-3 py-0.5 transition-colors">Apply</button>
          <button data-testid="promo-banner-dismiss" onClick={dismissBanner} className="opacity-80 hover:opacity-100"><X className="h-3.5 w-3.5" /></button>
        </div>
      ) : (
        <div className="bg-black/90 text-center text-[11px] sm:text-xs font-mono tracking-wide text-brand/90 py-2 px-4 border-b border-slate-200/60">
          100% GUARANTEED SEALED PRODUCTS · FREE EXPRESS SHIPPING ACROSS INDIA OVER ₹2,999
        </div>
      )}
      <nav
        data-testid="navbar"
        className={`backdrop-blur-xl border-b transition-colors duration-300 ${
          scrolled ? "bg-[#F7F3EA]/90 border-slate-200/80" : "bg-[#F7F3EA]/70 border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-6 h-16">
          <Link to="/" data-testid="navbar-brand-logo" className="flex items-center gap-3 shrink-0">
            <img src={IMAGES.logo} alt="The Pull Theory" className="h-9 w-9 rounded-md object-cover ring-1 ring-slate-300" />
            <div className="leading-none">
              <div className="font-heading font-extrabold text-sm sm:text-base tracking-[0.18em] text-slate-900">
                THE PULL THEORY
              </div>
              <div className="font-mono text-[9px] tracking-[0.3em] text-brand/80 mt-0.5">
                TCG SPECIALIST · EST. 2026
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6 ml-2">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                data-testid={`nav-link-${l.label.toLowerCase().replace(/[^a-z]/g, "")}`}
                className="text-sm text-slate-600 hover:text-brand transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Link to="/shop" className="hidden md:flex items-center gap-2 bg-[#FFFFFF] border border-slate-200 rounded-full px-3 py-1.5 w-56 hover:border-brand/50 transition-colors">
              <Search className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-500 flex-1 text-left">Search cards, sets, sealed…</span>
              <kbd className="font-mono text-[10px] text-slate-500 border border-slate-300 rounded px-1">⌘K</kbd>
            </Link>

            {user ? (
              <>
                {user.role === "admin" && (
                  <Link to="/admin" data-testid="navbar-admin-link" className="hidden sm:block text-sm text-brand hover:text-brand px-2 py-1.5">Admin</Link>
                )}
                <Link to="/account/orders" data-testid="navbar-account-link" className="p-2 rounded-full hover:bg-slate-200/60 transition-colors">
                  <User className="h-5 w-5 text-slate-700" />
                </Link>
              </>
            ) : (
              <Link to="/login" data-testid="navbar-login-link" className="hidden sm:flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 px-2 py-1.5 rounded-lg">
                Sign in <ChevronDown className="h-3.5 w-3.5" />
              </Link>
            )}

            <button
              data-testid="navbar-cart-button"
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-slate-200/60 transition-colors"
            >
              <ShoppingBag className="h-5 w-5 text-slate-700" />
              <span
                data-testid="navbar-cart-count"
                className="absolute -top-0.5 -right-0.5 bg-brand text-black text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center"
              >
                {count}
              </span>
            </button>

            <button
              data-testid="navbar-menu-toggle"
              className="lg:hidden p-2 rounded-full hover:bg-slate-200/60"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="h-5 w-5 text-slate-900" /> : <Menu className="h-5 w-5 text-slate-900" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-slate-200 bg-[#F7F3EA] px-4 py-4 flex flex-col gap-3">
            {LINKS.map((l) => (
              <Link key={l.label} to={l.to} className="text-slate-600 hover:text-brand py-1" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            {!user && <Link to="/login" className="text-brand py-1" onClick={() => setOpen(false)}>Sign in</Link>}
          </div>
        )}
      </nav>
    </header>
  );
};
