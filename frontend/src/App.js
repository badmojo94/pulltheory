import { useState } from "react";
import { Toaster } from "sonner";
import { toast } from "sonner";
import "@/App.css";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { CategoryBento } from "@/components/landing/CategoryBento";
import { NewArrivals } from "@/components/landing/NewArrivals";
import { PreOrderHighlights } from "@/components/landing/PreOrderHighlights";
import { TrustSection } from "@/components/landing/TrustSection";
import { NewsletterFooter } from "@/components/landing/NewsletterFooter";
import { inr } from "@/data/catalog";

export default function App() {
  const [cartCount, setCartCount] = useState(0);

  const addToCart = (p) => {
    setCartCount((c) => c + 1);
    toast.success("Added to cart", { description: `${p.name} · ${inr(p.price)}` });
  };

  return (
    <div className="min-h-screen bg-[#090B0E] text-slate-200 font-body antialiased selection:bg-amber-500/30">
      <Toaster position="bottom-right" theme="dark" richColors />
      <Navbar cartCount={cartCount} />
      <main>
        <Hero />
        <CategoryBento />
        <NewArrivals onAdd={addToCart} />
        <PreOrderHighlights />
        <TrustSection />
      </main>
      <NewsletterFooter />
    </div>
  );
}
