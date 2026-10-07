export const IMAGES = {
  logo: "https://customer-assets-cm19k8pv.emergentagent.net/job_card-vault-store-1/artifacts/272e7b2a21d84fb3_ChatGPT%20Image%20Sep%2018%2C%202026%2C%2011_14_24%20PM_1080x1080.jpeg",
  heroFoil: "https://static.prod-images.emergentagent.com/jobs/ec31149b-72a4-412a-94cb-b7cbba8702b5/images/06c3f30be7233ef3d565217326e6d815f8a17814da21788b56247f2d0d5b228d.jpeg",
  pokemonBooster: "https://images.unsplash.com/photo-1647893977168-6316f6c9ae44?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
  pokemonPacks: "https://images.unsplash.com/photo-1666302937150-44f5af2ab474?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
  onepiece: "https://images.unsplash.com/photo-1734517709196-48873cca9599?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
  collectorTable: "https://images.unsplash.com/photo-1742743031805-aa88ee5f300b?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
  rareHolo: "https://images.unsplash.com/photo-1708856034151-5de6269965bf?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
  cardsPile: "https://images.unsplash.com/photo-1647892591717-28c7fd63bb3f?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
  cardsScatter: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
  charizard: "https://images.unsplash.com/photo-1616196334218-caffdc9b2317?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
};

export const LANG = {
  JP: { label: "JP", name: "Japanese", cls: "bg-indigo-600 text-white border-transparent" },
  EN: { label: "EN", name: "English", cls: "bg-blue-600 text-white border-transparent" },
  KR: { label: "KR", name: "Korean", cls: "bg-emerald-600 text-white border-transparent" },
};

export const CATEGORIES = [
  { id: "pokemon", name: "Pokémon TCG", count: "1,240+ items", img: IMAGES.pokemonPacks, span: "lg:col-span-2 lg:row-span-2", accent: "from-yellow-500/20" },
  { id: "onepiece", name: "One Piece Card Game", count: "480+ items", img: IMAGES.onepiece, span: "lg:col-span-2", accent: "from-red-500/20" },
  { id: "sealed", name: "Sealed Booster Boxes", count: "320+ items", img: IMAGES.pokemonBooster, span: "lg:col-span-1", accent: "from-brand/20" },
  { id: "singles", name: "Rare Singles", count: "6,500+ items", img: IMAGES.rareHolo, span: "lg:col-span-1", accent: "from-purple-500/20" },
  { id: "accessories", name: "Protection & Sleeves", count: "210+ items", img: IMAGES.collectorTable, span: "lg:col-span-2", accent: "from-cyan-500/20" },
];

export const PRODUCTS = [
  { id: 1, name: "Terastal Festival ex Booster Box", set: "Scarlet & Violet SV8a", lang: "JP", price: 12499, mrp: 14999, stock: "In Stock", img: IMAGES.pokemonBooster, rarity: "Sealed" },
  { id: 2, name: "151 Ultra Premium Collection", set: "Scarlet & Violet", lang: "EN", price: 8999, mrp: 9999, stock: "Low Stock", img: IMAGES.pokemonPacks, rarity: "Elite Box" },
  { id: 3, name: "Charizard VMAX — Rainbow Rare", set: "Champion's Path", lang: "EN", price: 24999, mrp: null, stock: "In Stock", img: IMAGES.charizard, rarity: "Secret Rare" },
  { id: 4, name: "OP-09 Emperors of the New World", set: "One Piece Card Game", lang: "JP", price: 6499, mrp: 7499, stock: "Pre-Order", img: IMAGES.onepiece, rarity: "Booster Box" },
  { id: 5, name: "Mewtwo V Alt-Art — Korean Print", set: "Pokémon GO", lang: "KR", price: 4299, mrp: null, stock: "In Stock", img: IMAGES.rareHolo, rarity: "Alt Art" },
  { id: 6, name: "Premium Toploader Vault (50pk)", set: "The Pull Theory Gear", lang: "EN", price: 1299, mrp: 1599, stock: "In Stock", img: IMAGES.collectorTable, rarity: "Accessory" },
  { id: 7, name: "Obsidian Flames Booster Bundle", set: "Scarlet & Violet", lang: "EN", price: 3799, mrp: 4499, stock: "In Stock", img: IMAGES.cardsScatter, rarity: "Bundle" },
  { id: 8, name: "Luffy Leader Parallel — Graded 10", set: "One Piece OP-01", lang: "JP", price: 18999, mrp: null, stock: "Low Stock", img: IMAGES.cardsPile, rarity: "Graded" },
];

export const PREORDERS = [
  { id: "p1", name: "Pokémon SV9 Battle Partners", lang: "JP", release: "2026-07-18", img: IMAGES.pokemonBooster },
  { id: "p2", name: "One Piece OP-10 Royal Bloodline", lang: "JP", release: "2026-08-02", img: IMAGES.onepiece },
  { id: "p3", name: "Prismatic Evolutions ETB", lang: "EN", release: "2026-07-05", img: IMAGES.pokemonPacks },
];

export const inr = (n) => "₹" + n.toLocaleString("en-IN");
