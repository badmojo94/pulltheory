# The Pull Theory — PRD

## Original Problem Statement
Build a production-ready TCG ecommerce platform for an Indian trading card game business, **The Pull Theory** (Pokémon, One Piece, Japanese/English/Korean imports, sealed, singles, accessories, pre-orders). First deliverable: a premium, specialist-retailer landing page that feels trustworthy, premium and collector-focused — not a generic Shopify template. Must scale toward full ecommerce later.

## Architecture
- Frontend: Vite + React 19, Tailwind v4, shadcn/ui, framer-motion, sonner.
- Backend: FastAPI + MongoDB (not yet used — v1 is a static frontend landing page).
- Design system: "Dark Obsidian & Holo Prismatic" (`/app/design_guidelines.json`). Fonts: Syne (headings), Plus Jakarta Sans (body), JetBrains Mono (mono). Accent: amber-gold + holo violet/cyan.
- Brand assets: generated holo diamond logo mark + holographic booster-pack hero (no official logo was supplied).

## User Personas
- Serious TCG collector in India buying sealed boxes, graded singles, accessories.
- Enthusiast reserving upcoming Japanese/English pre-order drops.

## Core Requirements (static)
- Premium specialist-retailer feel, INR (₹) pricing, India-first with international scalability.
- Logo-driven cohesive palette, WCAG contrast, dark theme.

## Implemented (2026-06)
- Sticky glass navbar: announcement bar, logo wordmark, category links, search, locale (IN·₹), cart counter, mobile menu.
- Hero: brand statement, dual CTAs, floating holo-foil pack, stat counters, trust badge.
- Category bento grid (Pokémon, One Piece, Sealed, Singles, Accessories).
- New Arrivals grid with JP/EN/KR language filter tabs, stock/rarity badges, add-to-cart (client-side count + toast).
- Pre-order highlights with live countdowns and reserve toasts.
- Trust section (authenticity, packing, sourcing, proof).
- VIP newsletter signup (toast) + full footer with payment methods.
- Verified via testing agent: 100% frontend, zero console errors.

## Backlog (prioritized)
- **P0**: Backend product catalog + MongoDB models; real cart drawer with persistence; product detail pages.
- **P1**: Customer accounts/auth; checkout + payments (Razorpay/Stripe for India); search; order management.
- **P2**: Admin dashboard, inventory management, promotions, analytics, order notifications, SEO/sitemap, i18n for international.

## Next Tasks
- Introduce backend product API + real catalog data, then wire the storefront grid to it.
- Build cart drawer + checkout flow.
