import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchMe, login as apiLogin, register as apiRegister } from '../api';

type AuthContextValue = {
  authToken: string | null;
  currentLogin: string | null;
  authLoading: boolean;
  login: (loginValue: string, password: string) => Promise<void>;
  register: (loginValue: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentLogin, setCurrentLogin] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        setAuthToken(token);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (!authToken) {
      setCurrentLogin(null);
      return;
    }
    const syncMe = async () => {
      try {
        const me = await fetchMe(authToken);
        setCurrentLogin(me.login);
      } catch {
        setCurrentLogin(null);
        setAuthToken(null);
        try {
          localStorage.removeItem('auth_token');
        } catch {
          // ignore storage errors
        }
      }
    };
    void syncMe();
  }, [authToken]);

  const storeToken = (token: string) => {
    setAuthToken(token);
    try {
      localStorage.setItem('auth_token', token);
    } catch {
      // ignore storage errors
    }
  };

  const login = async (loginValue: string, password: string): Promise<void> => {
    setAuthLoading(true);
    try {
      const data = await apiLogin(loginValue, password);
      storeToken(data.access_token);
      setCurrentLogin(data.login);
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (loginValue: string, password: string): Promise<void> => {
    setAuthLoading(true);
    try {
      const data = await apiRegister(loginValue, password);
      storeToken(data.access_token);
      setCurrentLogin(data.login);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setCurrentLogin(null);
    try {
      localStorage.removeItem('auth_token');
    } catch {
      // ignore storage errors
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({ authToken, currentLogin, authLoading, login, register, logout }),
    [authToken, currentLogin, authLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
