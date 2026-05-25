import { api } from './client';
import { jwtDecode } from 'jwt-decode';

export interface AuthProfile {
  id: string;
  full_name: string;
  role_id: number;
  account_type: 'estudiante' | 'empresa'|'admin';
  roles?: { name: string }; 
  created_at?: string;
  updated_at?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  profile: AuthProfile;
  permissions: string[];
  role: string;
}

export interface MeResponse {
  ok: boolean;
  user: {
    id: string;
    email: string;
    user_metadata?: {
      full_name?: string;
    };
  };
  profile: AuthProfile;
  permissions: string[];
  role: string;
}

export interface LoginResponse {
  ok: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      user_metadata?: {
        full_name?: string;
      };
    };
    session: {
      access_token: string;
      refresh_token: string;
      expires_in?: number;
      expires_at?: number;
      token_type?: string;
    };
    profile: AuthProfile;
    permissions: string[];
    role: string;
  };
}

export async function getMe(): Promise<MeResponse> {
  const { data } = await api.get('/auth/me');
  const profile = data.data ?? data;  // desenvoltura del interceptor

  // 1. Obtener email desde el token JWT almacenado
  const token = localStorage.getItem('token') ??
                localStorage.getItem('access_token') ??
                localStorage.getItem('authToken');
  let email = '';
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      email = decoded.email || '';
    } catch {}
  }

  // 2. Construir el objeto que AuthContext espera
  return {
    ok: true,
    user: {
      id: profile.id,          // perfil id = auth.users id
      email: email,
    },
    profile: profile,
    role: profile.roles?.name ?? null,  // toma el nombre del rol desde la relación
    permissions: [],                    // los permisos pueden obtenerse con otro endpoint
  };
}

export async function getMyPermissions(): Promise<string[]> {
  const { data } = await api.get('/auth/me/permissions');
  return data?.permissions ?? [];
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout', {});
}