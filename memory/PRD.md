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

### v7 — Dark mode, paper texture, matte red
- Softened the brand red to a matte brick-red (`#C0392B`, light `#D9594C`, dark `#8E2A20`); updated `--primary/accent/ring` accordingly.
- Dark mode: navbar sun/moon toggle adds/removes `.dark` on `<html>`, persisted in `localStorage` with a no-flash inline script in index.html. `.dark` CSS overrides remap the hardcoded light surfaces/text/borders to a charcoal palette with matte-red accents (active chips turn red). CategoryBento overlays and the newsletter card were made theme-independent.
- Subtle paper/ink grain via a fixed `html::before` feTurbulence SVG (soft-light in light, screen in dark).

### v6 — Light "washi paper" theme
- Flipped the whole app from near-black to a vibrant light theme built around the logo's cream paper + crimson + ink: `--background` warm cream, white cards, dark-ink text, crimson primary. Remapped all component surfaces/text (slate + hex) across the frontend.
- Bold solid colored badges for vibrancy: language pills (indigo JP / blue EN / emerald KR), stock states (emerald In-Stock, amber Low-Stock, purple Pre-Order), dark rarity chips. Sonner toasts switched to light.

### v5 — Scheduled pre-order drops + countdown banner
- Platform cron (`.emergent/crons.yml`, hourly `release-preorders`) calls `POST /api/cron/release-preorders` (Bearer `WEBHOOK_CRON_SECRET`, backgrounded). It auto-releases any `is_preorder` product whose `release_date` has passed (sets `is_preorder` false + `released_at`) and notifies every reserver in-app. Manual admin release reuses the same `_release_product` helper. Verified: past-dated drop auto-released + reserver notified; 401 without secret.
- `GET /api/promo/featured` now returns `expires_at`; the auto-apply banner shows a live "ends in Xd Yh" countdown (ticks each minute) to drive launch urgency.

### v4 — Promo scheduling + auto-apply banner
- Promo codes now support `starts_at` / `expires_at` — `_apply_promo` and the featured endpoint enforce the active window (future codes blocked "not active yet", expired blocked). Admin form has start/end date pickers + "Feature in banner" toggle; list shows the date window and ★ for featured.
- Public `GET /api/promo/featured` returns the currently-active featured code. Dismissible site-wide banner in the Navbar announcement bar advertises it; "Apply" saves the code to localStorage and checkout auto-applies it on load. Dismiss is remembered per code.

### v3 — Brand palette + promos
- Reworked palette around the official logo: crimson-red (`--color-brand #D72631`) + black ink on obsidian; replaced amber accent everywhere; shadcn primary/accent/ring set to crimson.
- Promo codes: `promos` collection, admin create/list/delete (Promos tab), `/api/promo/validate`, discount applied + tracked at checkout with min-order, max-discount cap and usage-limit rules. Seeded `WELCOME10` (10%, cap ₹1000, min ₹1500) and `PULL500` (flat ₹500, min ₹4000).

## Known notes / MOCKED
- **Razorpay is in DEMO payment mode** (RAZORPAY_KEY_ID/SECRET empty in backend/.env). Orders confirm without a real charge until the user adds live keys; full Razorpay Checkout code is wired and switches on automatically once keys are set.

## Backlog (prioritized)
- **P0**: Add live Razorpay keys (switch off DEMO mode) + webhook endpoint; order confirmation emails.
- **P1**: Product search bar wiring, promotions/coupons, wishlists, address book, balance-payment flow for released pre-orders.
- **P2**: Analytics charts in admin, inventory alerts, SEO (sitemap/meta/OG), reviews, international shipping + multi-currency.

## Next Tasks
- Collect Razorpay live/test keys and enable real payments + webhook.
- Build the balance-payment flow so released pre-orders can be paid off for dispatch.
