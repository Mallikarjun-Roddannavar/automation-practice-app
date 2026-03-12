import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

import type { Role, User } from "../types";

type AuthContextValue = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  canCreateEdit: boolean;
  canDelete: boolean;
  isViewer: boolean;
};

const STORAGE_KEY = "playwright_practice_auth_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getStoredUser(): User | null {
  const value = localStorage.getItem(STORAGE_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value) as User;
  } catch {
    return null;
  }
}

function hasRole(user: User | null, roles: Role[]): boolean {
  return Boolean(user && roles.includes(user.role));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser);

  const value = useMemo<AuthContextValue>(() => {
    const login = (nextUser: User) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
    };
    const logout = () => {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
    };
    return {
      user,
      login,
      logout,
      canCreateEdit: hasRole(user, ["admin", "editor"]),
      canDelete: hasRole(user, ["admin"]),
      isViewer: hasRole(user, ["viewer"])
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
