import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";

import { getCurrentUser, login as loginRequest } from "../api/auth";
import { ApiError, setAuthTokenGetter } from "../api/client";
import { User } from "../api/types";

const TOKEN_KEY = "jwt";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredToken(): string | null {
  return window.localStorage.getItem(TOKEN_KEY);
}

function writeStoredToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

function clearStoredToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(readStoredToken()));

  useLayoutEffect(() => {
    setAuthTokenGetter(readStoredToken);
  }, []);

  useEffect(() => {
    const token = readStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    getCurrentUser()
      .then(response => {
        if (!cancelled) {
          setUser(response.user);
        }
      })
      .catch(error => {
        // Only clear the session when the token is rejected; keep it on transient failures
        // so a later reload can restore. Favorite/follow 401s stay in their callers.
        if (error instanceof ApiError && error.status === 401) {
          clearStoredToken();
          if (!cancelled) {
            setUser(null);
          }
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginRequest(email, password);
    writeStoredToken(response.user.token);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
    }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
