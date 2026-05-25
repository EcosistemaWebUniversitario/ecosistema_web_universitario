import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4002/api/v1';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('token') ??
    localStorage.getItem('access_token') ??
    localStorage.getItem('authToken');

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);