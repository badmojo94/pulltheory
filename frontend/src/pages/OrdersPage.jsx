import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Bell, LogOut } from "lucide-react";
import { api, inr } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/landing/Navbar";

const statusCls = {
  pending: "text-brand bg-brand/10 border-brand/30",
  confirmed: "text-emerald-700 bg-emerald-500/10 border-emerald-500/30",
  reserved: "text-purple-700 bg-purple-500/10 border-purple-500/30",
  shipped: "text-blue-700 bg-blue-500/10 border-blue-500/30",
  delivered: "text-emerald-700 bg-emerald-500/10 border-emerald-500/30",
};

export default function OrdersPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    if (user === false) { navigate("/login?redirect=/account/orders"); return; }
    if (user) {
      api.get("/orders").then(({ data }) => setOrders(data));
      api.get("/notifications").then(({ data }) => setNotifs(data));
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-slate-700 font-body">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-slate-900">My Account</h1>
            <p className="text-sm text-slate-600">{user?.email}</p>
          </div>
          <button onClick={() => { logout(); navigate("/"); }} className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-red-400"><LogOut className="h-4 w-4" /> Logout</button>
        </div>

        {notifs.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 font-heading font-bold text-slate-900 mb-3"><Bell className="h-4 w-4 text-brand" /> Notifications</div>
            <div className="space-y-2">
              {notifs.map((n) => (
                <div key={n.id} data-testid={`notif-${n.id}`} className={`border rounded-xl p-3 ${n.read ? "border-slate-200 bg-[#FFFFFF]" : "border-brand/30 bg-brand/5"}`}>
                  <div className="text-sm font-semibold text-slate-900">{n.title}</div>
                  <div className="text-xs text-slate-600">{n.body}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 font-heading font-bold text-slate-900 mb-3"><Package className="h-4 w-4 text-brand" /> Order History</div>
        {orders.length === 0 ? (
          <div className="text-slate-600 py-10 text-center border border-slate-200 rounded-2xl">No orders yet. <Link to="/shop" className="text-brand">Start shopping</Link></div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} data-testid={`order-${o.id}`} className="border border-slate-200 rounded-2xl bg-[#FFFFFF] p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="font-mono text-xs text-slate-500">#{o.id}</div>
                    <div className="text-xs text-slate-600">{new Date(o.created_at).toLocaleString("en-IN")}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {o.is_preorder && <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-purple-500/30 text-purple-700">Pre-Order</span>}
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border capitalize ${statusCls[o.status] || "text-slate-600 border-slate-300"}`}>{o.status}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  {o.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-sm"><span className="text-slate-600">{it.name} ×{it.quantity}</span><span className="text-slate-600">{inr(it.price * it.quantity)}</span></div>
                  ))}
                </div>
                <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between text-sm">
                  <span className="text-slate-600">Paid {inr(o.amount_due)}{o.balance_due > 0 ? ` · Balance ${inr(o.balance_due)} on dispatch` : ""}</span>
                  <span className="font-bold text-slate-900">Total {inr(o.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
