import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { IndianRupee, Package, ShoppingCart, Users, Plus, Rocket, Trash2 } from "lucide-react";
import { api, inr } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/landing/Navbar";

const EMPTY = { name: "", set_name: "", category: "sealed", game: "pokemon", language: "EN", price: 0, mrp: null, stock: 0, rarity: "", image: "", is_preorder: false, release_date: "", featured: false, description: "" };

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(EMPTY);

  const loadAll = () => {
    api.get("/admin/stats").then(({ data }) => setStats(data)).catch(() => {});
    api.get("/products").then(({ data }) => setProducts(data));
    api.get("/admin/orders").then(({ data }) => setOrders(data)).catch(() => {});
  };

  useEffect(() => {
    if (user === false) { navigate("/login?redirect=/admin"); return; }
    if (user && user.role !== "admin") { navigate("/"); return; }
    if (user) loadAll();
  }, [user, navigate]);

  const createProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock), mrp: form.mrp ? Number(form.mrp) : null, release_date: form.release_date || null };
      await api.post("/products", payload);
      toast.success("Product added");
      setForm(EMPTY);
      loadAll();
      setTab("products");
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed");
    }
  };

  const release = async (pid) => {
    const { data } = await api.post(`/admin/products/${pid}/release`);
    toast.success(`Released — notified ${data.notified} reserver(s)`);
    loadAll();
  };

  const del = async (pid) => { await api.delete(`/products/${pid}`); loadAll(); };

  const setStatus = async (oid, status) => { await api.post(`/admin/orders/${oid}/status`, { status }); loadAll(); };

  if (!user || user.role !== "admin") return <div className="min-h-screen bg-[#090B0E]"><Navbar /><div className="pt-32 text-center text-slate-400">Checking access…</div></div>;

  const STAT_CARDS = stats ? [
    { icon: IndianRupee, label: "Revenue (collected)", value: inr(stats.revenue) },
    { icon: ShoppingCart, label: "Orders", value: stats.orders },
    { icon: Package, label: "Products", value: stats.products },
    { icon: Users, label: "Customers", value: stats.customers },
  ] : [];

  return (
    <div className="min-h-screen bg-[#090B0E] text-slate-200 font-body">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <h1 className="font-heading text-2xl font-extrabold text-white mb-6">Admin Dashboard</h1>
        <div className="flex gap-2 mb-8">
          {["overview", "products", "add", "orders"].map((t) => (
            <button key={t} data-testid={`admin-tab-${t}`} onClick={() => setTab(t)}
              className={`text-sm px-4 py-2 rounded-full border capitalize ${tab === t ? "bg-white text-black border-white" : "border-slate-700 text-slate-300"}`}>{t}</button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STAT_CARDS.map((s) => (
              <div key={s.label} data-testid={`stat-${s.label}`} className="border border-slate-800 bg-[#11151C] rounded-2xl p-5">
                <s.icon className="h-5 w-5 text-amber-400 mb-3" />
                <div className="font-heading text-2xl font-extrabold text-white">{s.value}</div>
                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "products" && (
          <div className="space-y-2">
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-4 border border-slate-800 bg-[#11151C] rounded-xl p-3">
                <img src={p.image} alt="" className="h-12 w-12 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{p.name}</div>
                  <div className="text-xs text-slate-400">{p.language} · {inr(p.price)} · stock {p.stock} {p.is_preorder && "· PRE-ORDER"}</div>
                </div>
                {p.is_preorder && <button data-testid={`release-${p.id}`} onClick={() => release(p.id)} className="inline-flex items-center gap-1 text-xs text-purple-300 border border-purple-500/30 rounded-full px-3 py-1.5 hover:bg-purple-500/10"><Rocket className="h-3.5 w-3.5" /> Release</button>}
                <button onClick={() => del(p.id)} className="text-slate-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        )}

        {tab === "add" && (
          <form onSubmit={createProduct} className="grid grid-cols-2 gap-3 max-w-2xl">
            <input required data-testid="np-name" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="col-span-2 bg-[#11151C] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white" />
            <input placeholder="Set name" value={form.set_name} onChange={(e) => setForm({ ...form, set_name: e.target.value })} className="bg-[#11151C] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white" />
            <input placeholder="Rarity" value={form.rarity} onChange={(e) => setForm({ ...form, rarity: e.target.value })} className="bg-[#11151C] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-[#11151C] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white">
              {["sealed", "singles", "elite", "accessories"].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={form.game} onChange={(e) => setForm({ ...form, game: e.target.value })} className="bg-[#11151C] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white">
              {["pokemon", "onepiece", "accessory"].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="bg-[#11151C] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white">
              {["JP", "EN", "KR"].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="number" placeholder="Price ₹" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-[#11151C] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white" />
            <input type="number" placeholder="MRP ₹ (optional)" value={form.mrp || ""} onChange={(e) => setForm({ ...form, mrp: e.target.value })} className="bg-[#11151C] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white" />
            <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="bg-[#11151C] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white" />
            <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="col-span-2 bg-[#11151C] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white" />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="col-span-2 bg-[#11151C] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white" />
            <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={form.is_preorder} onChange={(e) => setForm({ ...form, is_preorder: e.target.checked })} /> Pre-order</label>
            <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
            {form.is_preorder && <input type="date" value={form.release_date} onChange={(e) => setForm({ ...form, release_date: e.target.value })} className="col-span-2 bg-[#11151C] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white" />}
            <button data-testid="np-submit" type="submit" className="col-span-2 inline-flex items-center justify-center gap-2 bg-amber-500 text-black font-semibold py-2.5 rounded-full"><Plus className="h-4 w-4" /> Add Product</button>
          </form>
        )}

        {tab === "orders" && (
          <div className="space-y-3">
            {orders.length === 0 && <div className="text-slate-400">No orders yet.</div>}
            {orders.map((o) => (
              <div key={o.id} className="border border-slate-800 bg-[#11151C] rounded-xl p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div><span className="font-mono text-xs text-slate-500">#{o.id}</span> <span className="text-sm text-white">{o.email}</span></div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white">{inr(o.total)}</span>
                    <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)} className="bg-[#090B0E] border border-slate-700 rounded px-2 py-1 text-xs text-white">
                      {["pending", "confirmed", "reserved", "shipped", "delivered"].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
