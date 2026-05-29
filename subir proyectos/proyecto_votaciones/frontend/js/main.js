// js/main.js — Funciones compartidas entre todas las páginas

function mostrarMensaje(texto, tipo = 'info', elementId = 'message') {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = texto;
  el.className = `message ${tipo}`;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 5000);
}

async function cerrarSesion() {
  await API.logout();
  window.location.href = '/';
}

async function cerrarSesionAdmin() {
  await API.logout();
  window.location.href = '/admin-login.html';
}

function cambiarTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-button').forEach(el => el.classList.remove('active'));
  document.getElementById(tab === 'login' ? 'loginForm' : 'registerForm')?.classList.add('active');
  document.querySelector(`[data-tab="${tab}"]`)?.classList.add('active');
}
