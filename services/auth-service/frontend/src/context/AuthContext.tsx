import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getMe, getMyPermissions, login as loginRequest, logout as logoutRequest, register as registerRequest } from '../api/auth.api';
import type { AuthUser, AuthProfile, LoginResponse, RegisterPayload } from '../api/auth.api';

interface AuthContextValue {
  user: AuthUser | null;
  profile: AuthProfile | null;
  permissions: string[];
  role: string | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (payload: RegisterPayload) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  setUserFromToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const cleanSession = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setProfile(null);
    setPermissions([]);
    setRole(null);
  };

  const loadSession = async (existingToken: string) => {
    try {
      localStorage.setItem('token', existingToken);
      setToken(existingToken);

      const meResponse = await getMe();
      const permissionsResponse = await getMyPermissions();

      setUser(meResponse.user);
      setProfile(meResponse.profile);
      setPermissions(permissionsResponse.permissions || []);
      setRole(permissionsResponse.role || null);
    } catch (error) {
      cleanSession();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      setLoading(false);
      return;
    }

    void loadSession(storedToken);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginRequest(email, password);
    const accessToken = response.data.session.access_token;

    await loadSession(accessToken);
    return response;
  };

  const register = async (payload: RegisterPayload) => {
    const response = await registerRequest(payload);
    const accessToken = response.data.session.access_token;

    await loadSession(accessToken);
    return response;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      cleanSession();
      setLoading(false);
    }
  };

  const setUserFromToken = async () => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      cleanSession();
      return;
    }

    setLoading(true);
    await loadSession(storedToken);
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      permissions,
      role,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      setUserFromToken,
    }),
    [user, profile, permissions, role, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
