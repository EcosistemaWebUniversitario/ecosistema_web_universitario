import { api } from './client';

export interface AuthSession {
  access_token: string;
  refresh_token: string;
}

export interface AuthProfile {
  id: string;
  full_name: string;
  role_id: number;
  account_type: 'estudiante' | 'empresa' | string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface LoginResponse {
  ok: boolean;
  message: string;
  data: {
    user: AuthUser;
    session: AuthSession;
    profile: AuthProfile;
  };
}

export interface MeResponse {
  ok: boolean;
  user: AuthUser;
  profile: AuthProfile;
}

export interface PermissionsResponse {
  ok: boolean;
  role: string;
  permissions: string[];
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  account_type: 'estudiante' | 'empresa';
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/login', { email, password });
  return response.data;
}

export async function register(payload: RegisterPayload): Promise<LoginResponse> {
  await api.post('/register', payload);
  return login(payload.email, payload.password);
}

export async function getMe(): Promise<MeResponse> {
  const response = await api.get<MeResponse>('/me');
  return response.data;
}

export async function getMyPermissions(): Promise<PermissionsResponse> {
  const response = await api.get<PermissionsResponse>('/me/permissions');
  return response.data;
}

export async function logout(): Promise<{ ok: boolean; message: string }> {
  const response = await api.post<{ ok: boolean; message: string }>('/logout');
  return response.data;
}
