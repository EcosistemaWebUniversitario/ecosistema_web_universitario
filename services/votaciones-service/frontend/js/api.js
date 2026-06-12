// js/api.js — Cliente HTTP unificado para votaciones (JWT)
const API = {
  // Obtener el token JWT del localStorage
  _getToken() {
    return localStorage.getItem('token') ??
           localStorage.getItem('access_token') ??
           localStorage.getItem('authToken');
  },

  // Hacer una petición autenticada (agrega Authorization si hay token)
  async _fetch(url, options = {}) {
    const token = this._getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });
    return res.json();
  },

  // --- Autenticación (ahora delegada al auth-service) ---
  // Las funciones login, registro, logout ya no se usan en este módulo.
  // Se mantienen como stubs que redirigen al auth-service por si acaso.
  async login() {
    window.location.href = '/auth/login';
    return { success: false };
  },
  async loginAdmin() {
    window.location.href = '/auth/login';
    return { success: false };
  },
  async registro() {
    window.location.href = '/auth/registro';
    return { success: false };
  },
  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('authToken');
    window.location.href = '/auth';
  },

  // --- Sesión (obtenida desde el auth-service) ---
  async sesion() {
    const token = this._getToken();
    if (!token) return { autenticado: false };
    try {
      const res = await this._fetch('/api/auth/me');
      if (res.ok && res.role) {
        return {
          autenticado: true,
          username: res.profile?.full_name || 'Usuario',
          role: res.role,
        };
      }
      return { autenticado: false };
    } catch {
      return { autenticado: false };
    }
  },

  // --- Candidatos ---
  async getCandidatos(tipo) {
    const url = tipo
      ? `/api/votaciones/candidatos?tipo=${tipo}`
      : '/api/votaciones/candidatos';
    return this._fetch(url);
  },
  async agregarCandidato(nombre, tipo, descripcion = '', profile_id = null) {
    return this._fetch('/api/votaciones/candidatos', {
      method: 'POST',
      body: JSON.stringify({ nombre, tipo, descripcion, profile_id }),
    });
  },
  async eliminarCandidato(id) {
    return this._fetch(`/api/votaciones/candidatos/${id}`, { method: 'DELETE' });
  },

  // --- Votación ---
  async estadoVotacion() {
    return this._fetch('/api/votaciones/votacion/estado');
  },
  async miEstado() {
    return this._fetch('/api/votaciones/votacion/mi-estado');
  },
  async votarOrganizacion(candidato_ids) {
    return this._fetch('/api/votaciones/votacion/votar-organizacion', {
      method: 'POST',
      body: JSON.stringify({ candidato_ids }),
    });
  },
  async votarLider(candidato_id) {
    return this._fetch('/api/votaciones/votacion/votar-lider', {
      method: 'POST',
      body: JSON.stringify({ candidato_id }),
    });
  },

  // --- Resultados ---
  async resultados() {
    return this._fetch('/api/votaciones/resultados');
  },

  // --- Admin ---
  async getConfiguracion() {
    return this._fetch('/api/votaciones/admin/configuracion');
  },
  async actualizarConfiguracion(inicio, fin) {
    return this._fetch('/api/votaciones/admin/configuracion', {
      method: 'PUT',
      body: JSON.stringify({ inicio_votacion: inicio, fin_votacion: fin }),
    });
  },
  async estadisticasAdmin() {
    return this._fetch('/api/votaciones/admin/estadisticas');
  },
};