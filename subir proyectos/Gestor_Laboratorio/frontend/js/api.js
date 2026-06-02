// frontend/js/api.js
let authToken = localStorage.getItem('labs_token') || null;

const API_BASE = '';

function setToken(token) {
  authToken = token;
  localStorage.setItem('labs_token', token);
}

function clearToken() {
  authToken = null;
  localStorage.removeItem('labs_token');
  localStorage.removeItem('labs_user');
}

async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  const res = await fetch(API_BASE + path, { ...options, headers });
  const data = await res.json();
  if (res.status === 401) { clearToken(); window.location.href = '/login.html'; }
  return data;
}

const API = {
  // AUTH (directo a Supabase)
  async login(email, password) {
    const SUPABASE_URL = 'https://tsnshzwxvxhjpxxjcjuq.supabase.co';
    const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbnNoend4dnhoanB4eGpjanVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMDMzNTMsImV4cCI6MjA5MTc3OTM1M30.E6pmMNKid21mSLh0aPA3z7Lc3VyNVdgWd1XpMQxsDC4';
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': ANON_KEY },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  // LABS
  getLabs: () => apiFetch('/api/labs'),
  createLab: (body) => apiFetch('/api/labs', { method: 'POST', body: JSON.stringify(body) }),
  updateLab: (id, body) => apiFetch(`/api/labs/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteLab: (id) => apiFetch(`/api/labs/${id}`, { method: 'DELETE' }),

  // COMPUTERS
  getComputers: () => apiFetch('/api/computers'),
  getComputersByLab: (labId) => apiFetch(`/api/computers/lab/${labId}`),
  createComputer: (body) => apiFetch('/api/computers', { method: 'POST', body: JSON.stringify(body) }),
  updateComputer: (id, body) => apiFetch(`/api/computers/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteComputer: (id) => apiFetch(`/api/computers/${id}`, { method: 'DELETE' }),

  // INCIDENTS
  getIncidents: () => apiFetch('/api/incidents'),
  getIncidentsByComputer: (cid) => apiFetch(`/api/incidents/computer/${cid}`),
  createIncident: (body) => apiFetch('/api/incidents', { method: 'POST', body: JSON.stringify(body) }),
  updateIncident: (id, body) => apiFetch(`/api/incidents/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteIncident: (id) => apiFetch(`/api/incidents/${id}`, { method: 'DELETE' }),
};

function mostrarMsg(id, texto, tipo) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = texto;
  el.className = `message ${tipo}`;
  setTimeout(() => el.style.display = 'none', 5000);
}
