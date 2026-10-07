import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const hash = window.location.hash || "";
    const sid = new URLSearchParams(hash.replace(/^#/, "")).get("session_id");
    if (!sid) {
      navigate("/login");
      return;
    }
    api.post("/auth/google", { session_id: sid })
      .then(({ data }) => {
        setUser(data.user);
        window.history.replaceState(null, "", "/");
        navigate("/");
      })
      .catch(() => navigate("/login"));
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen bg-[#090B0E] flex items-center justify-center text-slate-400">
      Signing you in…
    </div>
  );
}
