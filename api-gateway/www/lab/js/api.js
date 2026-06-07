// frontend/js/api.js
function getToken() {
  return localStorage.getItem('token') ??
         localStorage.getItem('access_token') ??
         localStorage.getItem('authToken');
}

const API = {
  isLoggedIn() { return !!getToken(); },
  clearToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('authToken');
  },

  async apiFetch(path, options = {}) {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(path, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) { API.clearToken(); window.location.href = '/auth'; }
    return { ok: res.ok, status: res.status, data, message: data.error || data.message };
  },

  // LABS (ahora todas las rutas base terminan con /)
  getLabs:        ()     => API.apiFetch('/api/labs/'),
  createLab:      (body) => API.apiFetch('/api/labs/',        { method: 'POST',   body: JSON.stringify(body) }),
  updateLab:      (id, body) => API.apiFetch(`/api/labs/${id}/`, { method: 'PUT',    body: JSON.stringify(body) }),
  deleteLab:      (id)   => API.apiFetch(`/api/labs/${id}/`, { method: 'DELETE' }),

  // COMPUTERS
  getComputers:    ()     => API.apiFetch('/api/computers/'),
  getComputersByLab: (labId) => API.apiFetch(`/api/computers/lab/${labId}/`),
  createComputer:  (body) => API.apiFetch('/api/computers/',   { method: 'POST',   body: JSON.stringify(body) }),
  updateComputer:  (id, body) => API.apiFetch(`/api/computers/${id}/`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteComputer:  (id)   => API.apiFetch(`/api/computers/${id}/`, { method: 'DELETE' }),

  // INCIDENTS
  getIncidents:    ()     => API.apiFetch('/api/incidents/'),
  getIncidentsByComputer: (cid) => API.apiFetch(`/api/incidents/computer/${cid}/`),
  createIncident:  (body) => API.apiFetch('/api/incidents/',   { method: 'POST',   body: JSON.stringify(body) }),
  updateIncident:  (id, body) => API.apiFetch(`/api/incidents/${id}/`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteIncident:  (id)   => API.apiFetch(`/api/incidents/${id}/`, { method: 'DELETE' }),
};