// Funciones del panel de administración

let adminActual = null;

// Cargar datos del panel de administración
function cargarDatosAdmin() {
    adminActual = verificarAdmin();
    if (!adminActual) return;
    
    // Cargar lista de candidatos
    actualizarListaCandidatos();
    
    // Cargar configuración actual
    cargarConfiguracionActual();
    
    // Actualizar estado del sistema
    actualizarEstadoSistema();
    
    // Configurar formularios
    configurarFormularios();
}

// Actualizar lista de candidatos
function actualizarListaCandidatos() {
    const candidatos = obtenerCandidatos();
    const listaElement = document.getElementById('listaCandidatos');
    
    if (candidatos.length === 0) {
        listaElement.innerHTML = '<p class="message warning">No hay candidatos registrados</p>';
        return;
    }
    
    listaElement.innerHTML = candidatos.map(candidato => `
        <div class="candidato-item">
            <div class="candidato-info">
                <h4>${candidato.nombre}</h4>
                <span class="tipo tipo-${candidato.tipo}">${candidato.tipo.toUpperCase()}</span>
                <p>${candidato.descripcion || 'Sin descripción'}</p>
            </div>
            <div class="candidato-actions">
                <button onclick="eliminarCandidato(${candidato.id})" class="btn-danger">
                    Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Cargar configuración actual
function cargarConfiguracionActual() {
    const config = obtenerConfiguracion();
    
    if (config.inicio_votacion) {
        document.getElementById('inicioVotacion').value = 
            config.inicio_votacion.substring(0, 16);
    }
    
    if (config.fin_votacion) {
        document.getElementById('finVotacion').value = 
            config.fin_votacion.substring(0, 16);
    }
}

// Actualizar estado del sistema
function actualizarEstadoSistema() {
    const estadoElement = document.getElementById('estadoSistema');
    const contadoresElement = document.getElementById('contadoresAdmin');
    
    const estaActiva = votacionActiva();
    const config = obtenerConfiguracion();
    const tiempoRestante = obtenerTiempoRestante();
    
    // Actualizar estado
    if (estaActiva) {
        estadoElement.textContent = 'VOTACIÓN ACTIVA';
        estadoElement.className = 'estado-activo';
    } else {
        estadoElement.textContent = 'VOTACIÓN INACTIVA';
        estadoElement.className = 'estado-inactivo';
    }
    
    // Obtener estadísticas
    const totalUsuarios = ejecutarConsulta("SELECT COUNT(*) as total FROM usuarios")[0].total;
    const totalVotantes = ejecutarConsulta("SELECT COUNT(*) as total FROM usuarios WHERE ha_votado_lider = 1")[0].total;
    const totalCandidatos = ejecutarConsulta("SELECT COUNT(*) as total FROM candidatos")[0].total;
    const votosOrganizacion = ejecutarConsulta("SELECT COUNT(*) as total FROM votos_organizacion")[0].total;
    
    // Actualizar contadores
    contadoresElement.innerHTML = `
        <div class="contador-item">
            <h4>Usuarios</h4>
            <p>${totalUsuarios}</p>
        </div>
        <div class="contador-item">
            <h4>Candidatos</h4>
            <p>${totalCandidatos}</p>
        </div>
        <div class="contador-item">
            <h4>Votantes</h4>
            <p>${totalVotantes}</p>
        </div>
        <div class="contador-item">
            <h4>Votos Org.</h4>
            <p>${votosOrganizacion}</p>
        </div>
    `;
}

// Configurar formularios
function configurarFormularios() {
    // Formulario de agregar candidato
    document.getElementById('formCandidato').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombreCandidato').value.trim();
        const tipo = document.getElementById('tipoCandidato').value;
        const descripcion = document.getElementById('descripcionCandidato').value.trim();
        
        if (!nombre || !tipo) {
            alert('Por favor, completa todos los campos obligatorios');
            return;
        }
        
        const resultado = agregarCandidato(nombre, tipo, descripcion);
        
        if (resultado > 0) {
            guardarBaseDatos();
            alert('Candidato agregado exitosamente');
            this.reset();
            actualizarListaCandidatos();
            actualizarEstadoSistema();
        } else {
            alert('Error al agregar candidato');
        }
    });
    
    // Formulario de tiempo de votación
    document.getElementById('formTiempoVotacion').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const inicio = document.getElementById('inicioVotacion').value;
        const fin = document.getElementById('finVotacion').value;
        
        if (!inicio || !fin) {
            alert('Por favor, completa ambas fechas');
            return;
        }
        
        if (new Date(fin) <= new Date(inicio)) {
            alert('La fecha de fin debe ser posterior a la fecha de inicio');
            return;
        }
        
        const resultado = actualizarConfiguracion(inicio, fin);
        
        if (resultado > 0) {
            alert('Tiempo de votación actualizado exitosamente');
            actualizarEstadoSistema();
        } else {
            alert('Error al actualizar el tiempo de votación');
        }
    });
}

// Eliminar candidato
function eliminarCandidato(id) {
    if (confirm('¿Estás seguro de eliminar este candidato? Esta acción no se puede deshacer.')) {
        const resultado = ejecutarActualizacion("DELETE FROM candidatos WHERE id = ?", [id]);
        
        if (resultado > 0) {
            alert('Candidato eliminado exitosamente');
            actualizarListaCandidatos();
            actualizarEstadoSistema();
        } else {
            alert('Error al eliminar candidato');
        }
    }
}

// Generar usuarios de ejemplo
function generarUsuariosEjemplo() {
    cargarUsuariosEjemplo();
    alert('Usuarios de ejemplo generados exitosamente');
    actualizarEstadoSistema();
}

// Reiniciar votación
function reiniciarVotacion() {
    if (!confirm('⚠️ ADVERTENCIA ⚠️\n\n¿Estás seguro de reiniciar la votación?\n\nEsto eliminará todos los votos y restablecerá el estado de los usuarios. Esta acción NO se puede deshacer.')) {
        return;
    }
    
    // Reiniciar votos
    ejecutarActualizacion("DELETE FROM votos_organizacion");
    ejecutarActualizacion("DELETE FROM votos_lider");
    
    // Reiniciar estado de usuarios
    ejecutarActualizacion("UPDATE usuarios SET ha_votado_organizacion = 0, ha_votado_lider = 0 WHERE es_admin = 0");
    
    alert('Votación reiniciada exitosamente');
    actualizarEstadoSistema();
}

// Exportar resultados a CSV
function exportarResultadosCSV() {
    const resultados = obtenerTodosResultados();
    
    let csv = 'Resultados de Elecciones Estudiantiles\n\n';
    
    // Resultados de organización
    csv += 'Miembros de Organización (Top 7)\n';
    csv += 'Posición,Nombre,Votos,Porcentaje\n';
    
    resultados.organizacion.forEach((candidato, index) => {
        const porcentaje = resultados.estadisticas.votosOrganizacion > 0 
            ? ((candidato.votos / resultados.estadisticas.votosOrganizacion) * 100).toFixed(2)
            : '0.00';
        csv += `${index + 1},"${candidato.nombre}",${candidato.votos},${porcentaje}%\n`;
    });
    
    // Resultados de líder
    csv += '\nLíder de Organización\n';
    csv += 'Posición,Nombre,Votos\n';
    
    if (resultados.lider) {
        csv += `1,"${resultados.lider.nombre}",${resultados.lider.votos}\n`;
    }
    
    // Estadísticas
    csv += '\nEstadísticas Generales\n';
    csv += 'Métrica,Valor\n';
    csv += `Total de Usuarios,${ejecutarConsulta("SELECT COUNT(*) as total FROM usuarios")[0].total}\n`;
    csv += `Total Votantes,${resultados.estadisticas.totalVotantes}\n`;
    csv += `Votos Organización,${resultados.estadisticas.votosOrganizacion}\n`;
    csv += `Votos Líder,${resultados.estadisticas.votosLider}\n`;
    csv += `Porcentaje Participación,${resultados.estadisticas.porcentaje}%\n`;
    
    // Crear y descargar archivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resultados-elecciones-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    URL.revokeObjectURL(url);
}

// Exportar resultados a JSON
function exportarResultadosJSON() {
    const resultados = obtenerTodosResultados();
    const fecha = new Date().toISOString();
    
    const data = {
        fechaExportacion: fecha,
        resultados: resultados,
        metadata: {
            sistema: 'Sistema de Votación Estudiantil',
            version: '1.0'
        }
    };
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resultados-elecciones-${fecha.split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}