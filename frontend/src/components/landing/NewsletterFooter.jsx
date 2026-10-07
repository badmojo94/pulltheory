import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { IMAGES } from "@/data/catalog";

const COLS = {
  Shop: ["Pokémon TCG", "One Piece", "Sealed Boxes", "Singles", "Accessories", "Pre-Orders"],
  Support: ["Track Order", "Shipping & Returns", "Authenticity", "Contact Us", "FAQ"],
  Company: ["About The Pull Theory", "Collector Club", "Blog", "Careers"],
};

export const NewsletterFooter = () => {
  const [email, setEmail] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Enter a valid email");
    toast.success("Welcome to the VIP Collector Club!", { description: "Early access drops incoming." });
    setEmail("");
  };

  return (
    <footer className="border-t border-slate-800 bg-[#090B0E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-[#14100B] to-[#11151C] p-8 sm:p-12 mb-16 relative overflow-hidden">
          <div className="absolute -top-20 -right-10 h-60 w-60 bg-brand/10 blur-3xl rounded-full" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">Join the VIP Collector Club</h3>
              <p className="text-slate-400 mt-3">
                Early access to Japanese booster drops, restock alerts and member-only pricing.
              </p>
            </div>
            <form onSubmit={submit} className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-[#090B0E] border border-slate-700 rounded-full px-4 focus-within:border-brand/60 transition-colors">
                <Mail className="h-4 w-4 text-slate-500" />
                <input
                  data-testid="newsletter-email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="bg-transparent text-sm text-white placeholder:text-slate-500 outline-none w-full py-3"
                />
              </div>
              <button
                data-testid="newsletter-submit-button"
                type="submit"
                className="inline-flex items-center gap-1 bg-brand hover:bg-brand-light text-black font-semibold px-5 py-3 rounded-full transition-colors shrink-0"
              >
                Join <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={IMAGES.logo} alt="The Pull Theory" className="h-9 w-9 rounded-md object-cover ring-1 ring-slate-700" />
              <div className="font-heading font-extrabold tracking-[0.18em] text-white">THE PULL THEORY</div>
            </div>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              India's specialist destination for authentic trading card games, sealed collectibles and
              protection gear.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {["UPI", "Visa", "Mastercard", "NetBanking", "RuPay"].map((m) => (
                <span key={m} className="font-mono text-[10px] text-slate-400 border border-slate-700 rounded px-2 py-1">
                  {m}
                </span>
              ))}
            </div>
          </div>
          {Object.entries(COLS).map(([h, items]) => (
            <div key={h}>
              <div className="font-heading text-sm font-bold text-white mb-4">{h}</div>
              <ul className="space-y-2.5">
                {items.map((i) => (
                  <li key={i}>
                    <a href="#top" className="text-sm text-slate-400 hover:text-brand transition-colors">{i}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-slate-500">
          <div>© 2026 The Pull Theory. All rights reserved. Made in India 🇮🇳</div>
          <div className="flex gap-4">
            <a href="#top" className="hover:text-slate-300">Privacy</a>
            <a href="#top" className="hover:text-slate-300">Terms</a>
            <a href="#top" className="hover:text-slate-300">Shipping Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
