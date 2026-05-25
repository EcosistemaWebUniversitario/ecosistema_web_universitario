import { createContext, useContext, useEffect, useState } from 'react';
import { getMe, type MeResponse } from '../api/auth.api';

type AuthUser = MeResponse['user'];
type AuthProfile = MeResponse['profile'];

type AuthContextType = {
  user: AuthUser | null;
  profile: AuthProfile | null;
  permissions: string[];
  role: string | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  setUserFromToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredToken() {
  return (
    localStorage.getItem('token') ??
    localStorage.getItem('access_token') ??
    localStorage.getItem('authToken')
  );
}

/**
 * AuthProvider:
 * Solo consume la sesión ya emitida por auth-service.
 * No hace login ni register.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [loading, setLoading] = useState(true);

  const clearLocalSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('authToken');
    setUser(null);
    setProfile(null);
    setPermissions([]);
    setRole(null);
    setToken(null);
  };

  const setUserFromToken = async () => {
    const storedToken = getStoredToken();

    if (!storedToken) {
      clearLocalSession();
      setLoading(false);
      return;
    }

    try {
  const data = await getMe();
  console.log('🔐 [AuthContext] data.user:', data.user);
  console.log('🔐 [AuthContext] data.profile:', data.profile);
  console.log('🔐 [AuthContext] data.role:', data.role);
  console.log('🔐 [AuthContext] data.permissions:', data.permissions);

  setUser(data.user);
  setProfile(data.profile);
  setPermissions(data.permissions ?? []);
  setRole(data.role ?? null);
  setToken(storedToken);

  localStorage.setItem('token', storedToken);
  console.log('✅ [AuthContext] Estado actualizado correctamente');
} catch (error) {
  console.error('Error al cargar sesión desde token:', error);
  clearLocalSession();
} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUserFromToken();
  }, []);

  const logout = () => {
    clearLocalSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        permissions,
        role,
        token,
        loading,
        isAuthenticated: Boolean(user && token),
        logout,
        setUserFromToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}