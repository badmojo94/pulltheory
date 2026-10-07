import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { CategoryBento } from "@/components/landing/CategoryBento";
import { NewArrivals } from "@/components/landing/NewArrivals";
import { PreOrderHighlights } from "@/components/landing/PreOrderHighlights";
import { TrustSection } from "@/components/landing/TrustSection";
import { NewsletterFooter } from "@/components/landing/NewsletterFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#090B0E] text-slate-200 font-body antialiased selection:bg-amber-500/30">
      <Navbar />
      <main>
        <Hero />
        <CategoryBento />
        <NewArrivals />
        <PreOrderHighlights />
        <TrustSection />
      </main>
      <NewsletterFooter />
    </div>
  );
}
