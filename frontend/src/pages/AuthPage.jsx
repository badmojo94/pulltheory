import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { IMAGES } from "@/data/catalog";

export default function AuthPage({ mode = "login" }) {
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/";

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res = isLogin
      ? await login(form.email, form.password)
      : await register(form.name, form.email, form.password);
    setBusy(false);
    if (res.ok) {
      toast.success(isLogin ? "Welcome back!" : "Account created!");
      navigate(redirect);
    } else {
      toast.error(res.error);
    }
  };

  const googleLogin = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + "/";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-slate-700 font-body flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <img src={IMAGES.logo} alt="The Pull Theory" className="h-12 w-12 rounded-md object-cover" />
          <span className="font-heading font-extrabold tracking-[0.18em] text-slate-900">THE PULL THEORY</span>
        </Link>
        <div className="bg-[#FFFFFF] border border-slate-200 rounded-2xl p-7">
          <h1 className="font-heading text-2xl font-bold text-slate-900 text-center">{isLogin ? "Sign in" : "Create account"}</h1>
          <p className="text-sm text-slate-600 text-center mt-1">{isLogin ? "Access your orders & pre-orders" : "Join the collector community"}</p>

          <button data-testid="google-login-button" onClick={googleLogin}
            className="w-full mt-6 flex items-center justify-center gap-2 border border-slate-300 hover:border-slate-500 rounded-full py-2.5 text-sm text-slate-900 transition-colors">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="h-4 w-4" /> Continue with Google
          </button>
          <div className="flex items-center gap-3 my-5"><div className="h-px flex-1 bg-slate-200" /><span className="text-xs text-slate-500">or</span><div className="h-px flex-1 bg-slate-200" /></div>

          <form onSubmit={submit} className="space-y-3">
            {!isLogin && (
              <input data-testid="auth-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" required
                className="w-full bg-[#F7F3EA] border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-brand/60" />
            )}
            <input data-testid="auth-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" required
              className="w-full bg-[#F7F3EA] border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-brand/60" />
            <input data-testid="auth-password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" required
              className="w-full bg-[#F7F3EA] border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-brand/60" />
            <button data-testid="auth-submit" disabled={busy} type="submit"
              className="w-full bg-brand hover:bg-brand-light disabled:opacity-50 text-black font-semibold py-2.5 rounded-full transition-colors">
              {busy ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="text-center text-sm text-slate-600 mt-5">
            {isLogin ? "New here? " : "Already have an account? "}
            <button data-testid="auth-toggle" onClick={() => setIsLogin(!isLogin)} className="text-brand hover:underline">
              {isLogin ? "Create an account" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
