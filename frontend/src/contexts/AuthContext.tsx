import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string | null;
  avatar: string | null;
  role: string;
  plan: string;
  reports_generated: number;
  ai_requests: number;
  tokens_consumed: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (access_token: string, refresh_token: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          await fetchUser(token);
        } catch (err) {
          console.error("Failed to fetch user, logging out", err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const fetchUser = async (token: string) => {
    const res = await fetch('http://127.0.0.1:8000/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Unauthorized");
    const data = await res.json();
    setUser(data);
  };

  const login = async (access_token: string, refresh_token: string) => {
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    await fetchUser(access_token);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
