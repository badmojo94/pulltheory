import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { api, apiError } from "@/lib/api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch {
      setUser(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (window.location.hash?.includes("session_id=")) {
      setLoading(false);
      return;
    }
    refresh();
  }, [refresh]);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setUser(data.user);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: apiError(e.response?.data?.detail) };
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      setUser(data.user);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: apiError(e.response?.data?.detail) };
    }
  }, []);

  const logout = useCallback(async () => {
    await api.post("/auth/logout");
    setUser(false);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, setUser, refresh }),
    [user, loading, login, register, logout, refresh]
  );

  return (
    <AuthCtx.Provider value={value}>
      {children}
    </AuthCtx.Provider>
  );
};
