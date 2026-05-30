// js/api.js — Cliente HTTP que reemplaza sql.js + localStorage
const API = {
  async login(email, password) {
    const r = await fetch('/api/login', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matricula: email, password })
    });
    return r.json();
  },
  async loginAdmin(email, password) {
    const r = await fetch('/api/login-admin', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return r.json();
  },
  async registro(email, password, nombre) {
    const r = await fetch('/api/registro', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username: nombre })
    });
    return r.json();
  },
  async logout() {
    await fetch('/api/logout', { credentials: 'include' });
  },
  async sesion() {
    const r = await fetch('/api/sesion', { credentials: 'include' });
    return r.json();
  },
  async getCandidatos(tipo) {
    const url = tipo ? `/api/candidatos?tipo=${tipo}` : '/api/candidatos';
    const r = await fetch(url, { credentials: 'include' });
    return r.json();
  },
  async agregarCandidato(nombre, tipo, descripcion = '', profile_id = null) {
    const r = await fetch('/api/candidatos', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, tipo, descripcion, profile_id })
    });
    return r.json();
  },
  async eliminarCandidato(id) {
    const r = await fetch(`/api/candidatos/${id}`, {
      method: 'DELETE', credentials: 'include'
    });
    return r.json();
  },
  async estadoVotacion() {
    const r = await fetch('/api/votacion/estado', { credentials: 'include' });
    return r.json();
  },
  async miEstado() {
    const r = await fetch('/api/votacion/mi-estado', { credentials: 'include' });
    return r.json();
  },
  async votarOrganizacion(candidato_ids) {
    const r = await fetch('/api/votacion/votar-organizacion', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidato_ids })
    });
    return r.json();
  },
  async votarLider(candidato_id) {
    const r = await fetch('/api/votacion/votar-lider', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidato_id })
    });
    return r.json();
  },
  async resultados() {
    const r = await fetch('/api/resultados', { credentials: 'include' });
    return r.json();
  },
  async getConfiguracion() {
    const r = await fetch('/api/admin/configuracion', { credentials: 'include' });
    return r.json();
  },
  async actualizarConfiguracion(inicio, fin) {
    const r = await fetch('/api/admin/configuracion', {
      method: 'PUT', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inicio_votacion: inicio, fin_votacion: fin })
    });
    return r.json();
  },
  async estadisticasAdmin() {
    const r = await fetch('/api/admin/estadisticas', { credentials: 'include' });
    return r.json();
  }
};
