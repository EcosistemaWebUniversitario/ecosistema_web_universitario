// Manejo de autenticación y sesiones

// Login de estudiantes
document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const matricula = document.getElementById('matricula').value.trim();
    const password = document.getElementById('password').value;
    
    if (!matricula || !password) {
        mostrarMensaje('Por favor, completa todos los campos', 'error');
        return;
    }

    // Mostrar loading
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Verificando...';
    submitBtn.disabled = true;
    
    setTimeout(async () => {
        try {
            await initDatabase(); // Asegurar BD inicializada
            const usuario = buscarUsuario(matricula, password);
            
            if (usuario.length > 0) {
                if (usuario[0].es_admin) {
                    mostrarMensaje('Este usuario es administrador. Usa el login de administrador.', 'error');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    return;
                }
                
                // ⭐ DEBUG: Verificar valores reales
                console.log('Usuario encontrado:', usuario[0]);
                console.log('ha_votado_organizacion:', usuario[0].ha_votado_organizacion, 'tipo:', typeof usuario[0].ha_votado_organizacion);
                console.log('ha_votado_lider:', usuario[0].ha_votado_lider, 'tipo:', typeof usuario[0].ha_votado_lider);
                
                // Guardar usuario en sessionStorage
                sessionStorage.setItem('usuario', JSON.stringify(usuario[0]));
                
                // ⭐⭐ CORRECCIÓN: Verificar SI ha votado (usando conversión explícita)
                const haVotadoOrg = Boolean(Number(usuario[0].ha_votado_organizacion));
                const haVotadoLider = Boolean(Number(usuario[0].ha_votado_lider));
                
                console.log('Convertido - org:', haVotadoOrg, 'líder:', haVotadoLider);
                
                if (haVotadoOrg && haVotadoLider) {
                    // ✅ YA VOTÓ
                    if (votacionFinalizada()) {
                        mostrarMensaje('Ya has votado. Redirigiendo a resultados...', 'success');
                        setTimeout(() => {
                            window.location.href = 'resultados.html';
                        }, 1500);
                    } else {
                        mostrarMensaje('Ya has votado. Espera a que termine la votación para ver resultados.', 'info');
                        setTimeout(() => {
                            window.location.href = 'espera.html';
                        }, 1500);
                    }
                } else {
                    // ✅ NO HA VOTADO (o no completó la votación)
                    mostrarMensaje('¡Acceso exitoso! Redirigiendo a votación...', 'success');
                    setTimeout(() => {
                        window.location.href = 'votacion.html';
                    }, 1500);
                }
            } else {
                mostrarMensaje('Matrícula o contraseña incorrectos', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error en login:', error);
            mostrarMensaje('Error en el sistema. Intenta nuevamente.', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }, 500);
});

// Login de administrador
document.getElementById('adminLoginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('adminUser').value;
    const password = document.getElementById('adminPassword').value;
    
    if (!usuario || !password) {
        mostrarMensaje('Por favor, completa todos los campos', 'error');
        return;
    }
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Verificando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        const admin = buscarUsuario(usuario, password);
        
        if (admin.length > 0 && admin[0].es_admin) {
            mostrarMensaje('✓ Acceso concedido como administrador', 'success');
            sessionStorage.setItem('admin', JSON.stringify(admin[0]));
            
            setTimeout(() => {
                window.location.href = 'admin-panel.html';
            }, 1000);
            
        } else {
            // Debug info
            const storedAdmin = ejecutarConsulta("SELECT * FROM usuarios WHERE matricula = 'admin'");
            console.log('Admin en BD:', storedAdmin);
            console.log('Hash de admin123:', hashPassword('admin123'));
            
            mostrarMensaje('Credenciales de administrador incorrectas', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }, 500);
});

// Verificar sesión de usuario
function verificarSesion() {
    const usuario = sessionStorage.getItem('usuario');
    if (!usuario) {
        window.location.href = 'index.html';
        return null;
    }
    
    const usuarioObj = JSON.parse(usuario);
    
    // Mostrar nombre de usuario en la interfaz
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = `Bienvenido/a: ${usuarioObj.nombre}`;
    }
    
    return usuarioObj;
}

// Verificar sesión de administrador
function verificarAdmin() {
    const admin = sessionStorage.getItem('admin');
    if (!admin) {
        window.location.href = 'admin-login.html';
        return null;
    }
    return JSON.parse(admin);
}

// Cerrar sesión
function cerrarSesion() {
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('admin');
    window.location.href = 'index.html';
}

function cerrarSesionAdmin() {
    sessionStorage.removeItem('admin');
    window.location.href = 'admin-login.html';
}

// Mostrar mensajes
function mostrarMensaje(texto, tipo = 'info') {
    const messageElement = document.getElementById('message') || document.getElementById('adminMessage');
    if (messageElement) {
        messageElement.textContent = texto;
        messageElement.className = `message ${tipo}`;
        messageElement.style.display = 'block';
        
        // Scroll al mensaje si está abajo
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
}
// Función para mostrar/ocultar elementos según permisos
// En la función verificarPermisos, añade esto:
function verificarPermisos() {
    const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
    const admin = JSON.parse(sessionStorage.getItem('admin') || '{}');
    
    // Si es admin, no hay restricciones
    if (admin.id) {
        return { usuario, admin };
    }
    
    // Si es usuario normal y ya votó
    if (usuario.id && (usuario.ha_votado_organizacion && usuario.ha_votado_lider)) {
        // Verificar si la votación ha terminado
        if (!votacionFinalizada()) {
            // Si no ha terminado, redirigir a página de espera
            if (!window.location.href.includes('espera.html')) {
                window.location.href = 'espera.html';
            }
        } else {
            // Si ya terminó, permitir ver resultados
            if (!window.location.href.includes('resultados.html')) {
                window.location.href = 'resultados.html';
            }
        }
    }
    
    return { usuario, admin };
}




