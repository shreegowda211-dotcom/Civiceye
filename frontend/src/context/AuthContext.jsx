import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authService } from "@/api/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("civiceye_token");
    const raw = localStorage.getItem("civiceye_user");
    if (!t || t === "undefined" || t === "null") {
      localStorage.removeItem("civiceye_token");
      localStorage.removeItem("civiceye_user");
      localStorage.removeItem("civiceye_user_id");
      setLoading(false);
      return;
    }

    if (raw) {
      try {
        setUser(JSON.parse(raw));
        setToken(t);
      } catch {
        localStorage.removeItem("civiceye_user");
        localStorage.removeItem("civiceye_user_id");
      }
    }

    authService.me()
      .then((res) => {
        setUser(res.user);
        setToken(t);
      })
      .catch(() => {
        localStorage.removeItem("civiceye_token");
        localStorage.removeItem("civiceye_user");
        localStorage.removeItem("civiceye_user_id");
        setUser(null);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persist = (t, u) => {
    localStorage.setItem("civiceye_token", t);
    localStorage.setItem("civiceye_user", JSON.stringify(u));
    localStorage.setItem("civiceye_user_id", u._id);
  };

  const login = useCallback(async ({ email, password }) => {
    const res = await authService.login({ email, password });
    setUser(res.user);
    setToken(res.token);
    persist(res.token, res.user);
    return res.user;
  }, []);

  const register = useCallback(async (payload) => {
    const res = await authService.register(payload);
    setUser(res.user);
    setToken(res.token);
    persist(res.token, res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("civiceye_token");
    localStorage.removeItem("civiceye_user");
    localStorage.removeItem("civiceye_user_id");
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((u) => {
      const next = { ...u, ...patch };
      localStorage.setItem("civiceye_user", JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
