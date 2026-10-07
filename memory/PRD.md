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
### v1 — Landing page
- Glass navbar, hero, category bento, featured grid, pre-order highlights, trust section, newsletter, footer.
### v2 — Full ecommerce
- Real catalog in MongoDB (products collection, 11 seeded incl 3 pre-orders); `/api/products` with category/game/language/preorder/featured filters; product detail pages.
- Auth: JWT email/password (bcrypt, httpOnly cookie) + Emergent Google OAuth, unified `users` collection; admin role.
- Cart: localStorage-backed cart drawer (add/qty/remove), subtotal + free-shipping over ₹2,999.
- Checkout: shipping form → `/api/checkout` creates order; Razorpay Checkout when keys present, DEMO auto-confirm fallback when keys empty; signature verification; stock decrement.
- Pre-orders: 20% token charged upfront, balance tracked for dispatch; reservation + release in-app notifications.
- Order history page; in-app notifications.
- Admin dashboard: stats (revenue/orders/products/customers), product list + add/delete, order status management, pre-order "release" that notifies reservers.
- Verified via testing agent: 100% backend + frontend across 12 flows, zero console errors.

## Known notes / MOCKED
- **Razorpay is in DEMO payment mode** (RAZORPAY_KEY_ID/SECRET empty in backend/.env). Orders confirm without a real charge until the user adds live keys; full Razorpay Checkout code is wired and switches on automatically once keys are set.

## Backlog (prioritized)
- **P0**: Add live Razorpay keys (switch off DEMO mode) + webhook endpoint; order confirmation emails.
- **P1**: Product search bar wiring, promotions/coupons, wishlists, address book, balance-payment flow for released pre-orders.
- **P2**: Analytics charts in admin, inventory alerts, SEO (sitemap/meta/OG), reviews, international shipping + multi-currency.

## Next Tasks
- Collect Razorpay live/test keys and enable real payments + webhook.
- Build the balance-payment flow so released pre-orders can be paid off for dispatch.
