// Mostrar resultados de la votación

function cargarResultados() {
    // Verificar permisos
    const admin = JSON.parse(sessionStorage.getItem('admin') || '{}');
    const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
    
    // Si no es admin y la votación no ha finalizado, redirigir
    if (!admin.id && !votacionFinalizada()) {
        if (usuario.id) {
            // Si es usuario que ya votó, redirigir a espera
            window.location.href = 'espera.html';
        } else {
            // Si no ha iniciado sesión, redirigir al login
            window.location.href = 'index.html';
        }
        return;
    }
    
    // Obtener resultados de organización
    const resultadosOrg = obtenerResultadosOrganizacion();
    const totalVotosOrg = ejecutarConsulta("SELECT COUNT(*) as total FROM votos_organizacion")[0].total;
    
    // Mostrar resultados de organización (7 ganadores)
    mostrarResultadosOrganizacion(resultadosOrg, totalVotosOrg);
    
    // Mostrar resultados de líder (TODOS los candidatos)
    mostrarResultadosLider(); // Esta ahora muestra todos
    
    // Mostrar estadísticas
    const estadisticas = {
        totalVotantes: ejecutarConsulta("SELECT COUNT(*) as total FROM usuarios WHERE ha_votado_lider = 1")[0].total,
        votosOrganizacion: totalVotosOrg,
        votosLider: ejecutarConsulta("SELECT COUNT(*) as total FROM votos_lider")[0].total,
        porcentaje: 0 // Calcular si es necesario
    };
    
    mostrarEstadisticas(estadisticas);
}
// Mostrar resultados de organización
function mostrarResultadosOrganizacion(candidatos, totalVotos) {
    const container = document.getElementById('resultadosOrganizacion');
    
    if (candidatos.length === 0) {
        container.innerHTML = '<p class="message warning">No hay votos registrados para la organización</p>';
        return;
    }
    
    container.innerHTML = candidatos.map((candidato, index) => {
        const porcentaje = totalVotos > 0 
            ? Math.round((candidato.votos / totalVotos) * 100)
            : 0;
        
        const esGanador = index < 7 ? 'ganador' : '';
        
        return `
            <div class="resultado-item ${esGanador}">
                <div class="posicion">${index + 1}°</div>
                <div class="info-candidato">
                    <h3>${candidato.nombre}</h3>
                    <p>${candidato.descripcion || ''}</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${porcentaje}%"></div>
                    </div>
                </div>
                <div class="votos-info">
                    <div class="votos-count">${candidato.votos}</div>
                    <div class="votos-porcentaje">${porcentaje}%</div>
                </div>
            </div>
        `;
    }).join('');
}

// Mostrar resultados de líder
// Mostrar resultados de líder - TODOS los candidatos
function mostrarResultadosLider() {
    const container = document.getElementById('resultadosLider');
    
    // Obtener TODOS los candidatos a líder, no solo el ganador
    const candidatos = obtenerResultadoLider(); // Esta función ya está modificada
    // O usar directamente:
    // const candidatos = ejecutarConsulta(`
    //     SELECT c.id, c.nombre, c.descripcion, COUNT(v.candidato_id) as votos
    //     FROM candidatos c
    //     LEFT JOIN votos_lider v ON c.id = v.candidato_id
    //     WHERE c.tipo = 'lider' OR c.tipo = 'ambos'
    //     GROUP BY c.id
    //     ORDER BY votos DESC
    // `);
    
    if (candidatos.length === 0) {
        container.innerHTML = '<p class="message warning">No hay votos registrados para líder</p>';
        return;
    }
    
    // Calcular total de votos para líder
    const totalVotos = candidatos.reduce((total, candidato) => total + candidato.votos, 0);
    
    container.innerHTML = candidatos.map((candidato, index) => {
        const porcentaje = totalVotos > 0 
            ? Math.round((candidato.votos / totalVotos) * 100)
            : 0;
        
        // Marcar al ganador (primer lugar)
        const esGanador = index === 0 && candidato.votos > 0 ? 'ganador' : '';
        
        return `
            <div class="resultado-item ${esGanador}">
                <div class="posicion">${index + 1}°</div>
                <div class="info-candidato">
                    <h3>${candidato.nombre}</h3>
                    <p>${candidato.descripcion || ''}</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${porcentaje}%"></div>
                    </div>
                </div>
                <div class="votos-info">
                    <div class="votos-count">${candidato.votos}</div>
                    <div class="votos-porcentaje">${porcentaje}%</div>
                </div>
            </div>
        `;
    }).join('');
}

// Mostrar estadísticas
function mostrarEstadisticas(estadisticas) {
    document.getElementById('totalVotantes').textContent = estadisticas.totalVotantes;
    document.getElementById('votosOrganizacion').textContent = estadisticas.votosOrganizacion;
    document.getElementById('votosLider').textContent = estadisticas.votosLider;
    document.getElementById('porcentajeParticipacion').textContent = `${estadisticas.porcentaje}%`;
}

// Verificar estado de la votación
function verificarEstadoVotacion() {
    const estadoElement = document.getElementById('estadoVotacion');
    const tiempoElement = document.getElementById('tiempoRestante');
    
    const estaActiva = votacionActiva();
    const config = obtenerConfiguracion();
    const tiempoRestante = obtenerTiempoRestante();
    
    if (estaActiva) {
        estadoElement.textContent = 'VOTACIÓN ACTIVA';
        estadoElement.style.color = '#28a745';
        estadoElement.style.fontWeight = 'bold';
    } else {
        estadoElement.textContent = 'VOTACIÓN FINALIZADA';
        estadoElement.style.color = '#dc3545';
        estadoElement.style.fontWeight = 'bold';
    }
    
    tiempoElement.textContent = tiempoRestante;
}

// Actualizar resultados (para el botón de actualizar)
function actualizarResultados() {
    cargarResultados();
    verificarEstadoVotacion();
    
    // Mostrar mensaje de actualización
    const mensaje = document.createElement('div');
    mensaje.className = 'message success';
    mensaje.textContent = 'Resultados actualizados';
    mensaje.style.position = 'fixed';
    mensaje.style.top = '20px';
    mensaje.style.right = '20px';
    mensaje.style.zIndex = '1000';
    
    document.body.appendChild(mensaje);
    
    setTimeout(() => {
        mensaje.remove();
    }, 3000);
}

// Auto-actualizar resultados cada 30 segundos
setInterval(() => {
    if (window.location.href.includes('resultados.html')) {
        cargarResultados();
    }
}, 30000);