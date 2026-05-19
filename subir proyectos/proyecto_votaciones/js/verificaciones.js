// verificaciones.js - Verificaciones de acceso globales

// Función para verificar si la votación ha finalizado
function votacionFinalizada() {
    try {
        const config = obtenerConfiguracion();
        if (!config || !config.fin_votacion) {
            return false;
        }
        const ahora = new Date().toISOString();
        return ahora > config.fin_votacion;
    } catch (error) {
        console.error('Error verificando votación finalizada:', error);
        return false;
    }
}

// Función para verificar acceso a resultados
function verificarAccesoResultados() {
    try {
        const admin = JSON.parse(sessionStorage.getItem('admin') || '{}');
        const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
        
        // 1. Admin siempre tiene acceso
        if (admin.id) {
            console.log('✅ Acceso concedido: Administrador');
            return true;
        }
        
        // 2. Usuario normal: solo si la votación ha finalizado
        if (usuario.id) {
            const finalizada = votacionFinalizada();
            if (finalizada) {
                console.log('✅ Acceso concedido: Usuario - Votación finalizada');
                return true;
            } else {
                console.log('❌ Acceso denegado: Usuario - Votación aún en curso');
                return false;
            }
        }
        
        // 3. No ha iniciado sesión
        console.log('❌ Acceso denegado: No autenticado');
        return false;
        
    } catch (error) {
        console.error('Error en verificarAccesoResultados:', error);
        return false;
    }
}

// Verificar acceso cuando se carga la página de resultados
function verificarAccesoPagina() {
    // Solo aplicar a resultados.html
    if (!window.location.href.includes('resultados.html')) {
        return;
    }
    
    const tieneAcceso = verificarAccesoResultados();
    
    if (!tieneAcceso) {
        const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
        const admin = JSON.parse(sessionStorage.getItem('admin') || '{}');
        
        if (admin.id) {
            // Admin debería tener acceso, algo salió mal
            console.log('⚠️ Admin sin acceso - error inesperado');
            return;
        }
        
        if (usuario.id) {
            // Usuario normal, redirigir a espera
            window.location.href = 'espera.html';
        } else {
            // No autenticado, redirigir al login
            window.location.href = 'index.html';
        }
    }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', async function() {
    // Inicializar base de datos si está disponible
    if (typeof initDatabase === 'function') {
        try {
            await initDatabase();
        } catch (error) {
            console.error('Error inicializando BD:', error);
        }
    }
    
    // Verificar acceso para la página actual
    verificarAccesoPagina();
});