"use client";

import { createContext, createElement, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import Cookies from "js-cookie";
import { authService } from "@/services/auth.service";

interface UserShape {
  _id?: string;
  name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

interface AuthContextType {
  user: UserShape | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: Record<string, unknown>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserShape | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getMe();
      const payload = response?.data?.user ?? response?.user ?? null;
      setUser(payload as UserShape | null);
    } catch {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshUser();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    const authData = await authService.login(email, password);
    const token = authData?.accessToken;
    const refreshToken = authData?.refreshToken;
    const profile = authData?.user;

    if (token) Cookies.set("accessToken", token, { expires: 7 });
    if (refreshToken) Cookies.set("refreshToken", refreshToken, { expires: 7 });
    setUser(profile as UserShape | null);
  };

  const register = async (payload: Record<string, unknown>) => {
    const authData = await authService.register(payload);
    const token = authData?.accessToken;
    const refreshToken = authData?.refreshToken;
    const profile = authData?.user;

    if (token) Cookies.set("accessToken", token, { expires: 7 });
    if (refreshToken) Cookies.set("refreshToken", refreshToken, { expires: 7 });
    setUser(profile as UserShape | null);
  };

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
