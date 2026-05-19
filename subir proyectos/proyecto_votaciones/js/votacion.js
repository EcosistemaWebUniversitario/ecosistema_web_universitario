// Lógica del sistema de votación

let seleccionOrganizacion = new Set();
let seleccionLider = null;
let usuarioActual = null;

// Inicializar la votación
function cargarCandidatos() {
    usuarioActual = verificarSesion();
    if (!usuarioActual) return;
    
    // Verificar si ya votó
    if (usuarioActual.ha_votado_organizacion && usuarioActual.ha_votado_lider) {
        if (votacionFinalizada()) {
            window.location.href = 'resultados.html';
        } else {
            window.location.href = 'espera.html';
        }
        return;
    }
    
    // Verificar si la votación está activa
    if (!votacionActiva()) {
        mostrarMensajeVotacion('La votación no está activa en este momento', 'warning');
        document.querySelectorAll('button').forEach(btn => btn.disabled = true);
        return;
    }
    
    // Cargar candidatos para organización
    const candidatosOrg = obtenerCandidatos('organizacion');
    const contenedorOrg = document.getElementById('candidatosOrganizacion');
    contenedorOrg.innerHTML = '';
    
    candidatosOrg.forEach(candidato => {
        const card = crearCardCandidato(candidato, 'organizacion');
        contenedorOrg.appendChild(card);
    });
    
    // Cargar candidatos para líder
    const candidatosLider = obtenerCandidatos('lider');
    const contenedorLider = document.getElementById('candidatosLider');
    contenedorLider.innerHTML = '';
    
    candidatosLider.forEach(candidato => {
        const card = crearCardCandidato(candidato, 'lider');
        contenedorLider.appendChild(card);
    });
    
    // Actualizar interfaz según estado de votación
    if (usuarioActual.ha_votado_organizacion) {
        document.getElementById('paso1').style.display = 'none';
        document.getElementById('paso2').style.display = 'block';
        document.querySelectorAll('.tab-button')[1].click();
    }
}

// Crear tarjeta de candidato
function crearCardCandidato(candidato, tipo) {
    const card = document.createElement('div');
    card.className = 'candidato-card';
    card.dataset.id = candidato.id;
    card.dataset.tipo = tipo;
    
    const img = document.createElement('img');
    img.src = candidato.foto || 'https://via.placeholder.com/100x100?text=Candidato';
    img.alt = candidato.nombre;
    img.style.width = '100px';
    img.style.height = '100px';
    img.style.borderRadius = '50%';
    img.style.objectFit = 'cover';
    img.style.marginBottom = '10px';
    
    const h3 = document.createElement('h3');
    h3.textContent = candidato.nombre;
    
    const p = document.createElement('p');
    p.textContent = candidato.descripcion || 'Candidato estudiantil';
    
    const button = document.createElement('button');
    button.className = 'btn-primary';
    button.textContent = 'Seleccionar';
    button.onclick = () => seleccionarCandidato(candidato.id, tipo);
    
    card.appendChild(img);
    card.appendChild(h3);
    card.appendChild(p);
    card.appendChild(button);
    
    return card;
}

// Seleccionar candidato
function seleccionarCandidato(id, tipo) {
    if (tipo === 'organizacion') {
        // Código existente para organización (múltiple)
        if (seleccionOrganizacion.has(id)) {
            seleccionOrganizacion.delete(id);
        } else if (seleccionOrganizacion.size < 7) {
            seleccionOrganizacion.add(id);
        } else {
            mostrarMensajeVotacion('Máximo 7 candidatos permitidos para la organización', 'warning');
            return;
        }
        
        // Actualizar contador
        document.getElementById('contadorSeleccionados').textContent = seleccionOrganizacion.size;
        
        // Habilitar/deshabilitar botón siguiente
        document.getElementById('btnSiguiente').disabled = seleccionOrganizacion.size === 0;
        
    } else if (tipo === 'lider') {
        // Pedir confirmación si ya había selección
        if (!confirmarSeleccionLider(id)) {
            return;
        }
        
        // Resetear selección anterior
        resetearSeleccionLider(id);
        
        // Actualizar visualmente
        actualizarEstilosSeleccion(id, tipo);
    }
    // Actualizar estilos visuales
    actualizarEstilosSeleccion(id, tipo);
}

// Actualizar estilos de selección
function actualizarEstilosSeleccion(id, tipo) {
    const cards = document.querySelectorAll(`.candidato-card[data-tipo="${tipo}"]`);
    
    cards.forEach(card => {
        const cardId = parseInt(card.dataset.id);
        
        if (tipo === 'organizacion') {
            // Organización: múltiple selección
            card.classList.toggle('seleccionado', seleccionOrganizacion.has(cardId));
            
        } else if (tipo === 'lider') {
            // Líder: selección única
            
            // Si esta tarjeta es la seleccionada
            if (cardId === id) {
                card.classList.toggle('seleccionado', seleccionLider === cardId);
                card.classList.toggle('lider-seleccionado', seleccionLider === cardId);
            }
            
            // Si hay un líder seleccionado, bloquear los demás
            if (seleccionLider && cardId !== seleccionLider) {
                card.classList.add('lider-bloqueado');
            } else {
                card.classList.remove('lider-bloqueado');
            }
        }
    });
}

// Navegación entre pasos
function siguientePaso() {
    if (seleccionOrganizacion.size === 0) {
        mostrarMensajeVotacion('Debes seleccionar al menos un candidato para la organización', 'error');
        return;
    }
    
    document.getElementById('paso1').style.display = 'none';
    document.getElementById('paso2').style.display = 'block';
}

function pasoAnterior() {
    document.getElementById('paso2').style.display = 'none';
    document.getElementById('paso1').style.display = 'block';
}

// Enviar votos
async function enviarVotos() {
    // Validación: Verificar que el usuario está logueado
    if (!usuarioActual) {
        mostrarMensajeVotacion('Debes iniciar sesión para votar', 'error');
        window.location.href = 'index.html';
        return;
    }

    // Validación 1: Organización - mínimo 1, máximo 7
    if (seleccionOrganizacion.size === 0) {
        mostrarMensajeVotacion('Debes seleccionar al menos un miembro para la organización (máximo 7)', 'error');
        return;
    }

    if (seleccionOrganizacion.size > 7) {
        mostrarMensajeVotacion('Solo puedes seleccionar máximo 7 miembros para la organización', 'error');
        return;
    }

    // Validación 2: Líder - exactamente 1
    if (!seleccionLider) {
        mostrarMensajeVotacion('Debes seleccionar UN líder de la organización', 'error');
        return;
    }

    // Validación 3: Verificar que la votación esté activa
    if (!votacionActiva()) {
        mostrarMensajeVotacion('La votación ha finalizado. No se pueden registrar más votos.', 'error');
        return;
    }

    // Validación 4: Verificar que el usuario no haya votado ya
    if (usuarioActual.ha_votado_organizacion || usuarioActual.ha_votado_lider) {
        mostrarMensajeVotacion('Ya has votado anteriormente. No puedes votar nuevamente.', 'error');
        setTimeout(() => {
            window.location.href = 'resultados.html';
        }, 2000);
        return;
    }

    // Confirmación final
    const organizacionCount = seleccionOrganizacion.size;
    const candidatoLider = obtenerCandidatos('lider').find(c => c.id === seleccionLider);
    const nombreLider = candidatoLider ? candidatoLider.nombre : 'el líder seleccionado';

    const confirmacion = confirm(
        `¿ESTÁS SEGURO DE ENVIAR TUS VOTOS?\n\n` +
        `🔹 ORGANIZACIÓN (${organizacionCount} candidatos):\n` +
        `Vas a votar por ${organizacionCount} miembro(s) de organización\n\n` +
        `👑 LÍDER:\n` +
        `Vas a votar por: ${nombreLider}\n\n` +
        `⚠️ Esta acción NO se puede deshacer.`
    );

    if (!confirmacion) return;

    // Mostrar loading
    const btnEnviar = document.getElementById('btnEnviar');
    const btnOriginalText = btnEnviar.textContent;
    btnEnviar.textContent = 'Registrando votos...';
    btnEnviar.disabled = true;

    try {
        console.log('Iniciando registro de votos...');
        console.log('Usuario ID:', usuarioActual.id);
        console.log('Candidatos organización:', Array.from(seleccionOrganizacion));
        console.log('Candidato líder:', seleccionLider);

        // 1. Registrar votos de organización
        let votosOrgExitosos = 0;
        const candidatosOrgArray = Array.from(seleccionOrganizacion);
        
        for (const candidatoId of candidatosOrgArray) {
            const resultado = ejecutarActualizacion(
                "INSERT INTO votos_organizacion (usuario_id, candidato_id) VALUES (?, ?)",
                [usuarioActual.id, candidatoId]
            );
            
            if (resultado > 0) {
                votosOrgExitosos++;
                console.log(`✅ Voto organización registrado: candidato ${candidatoId}`);
            } else {
                console.error(`❌ Error en voto organización: candidato ${candidatoId}`);
            }
        }

        // 2. Registrar voto de líder
        const votoLiderResultado = ejecutarActualizacion(
            "INSERT INTO votos_lider (usuario_id, candidato_id) VALUES (?, ?)",
            [usuarioActual.id, seleccionLider]
        );
        
        console.log('Resultado voto líder:', votoLiderResultado);

        // 3. Marcar usuario como que ya votó
        if (votosOrgExitosos > 0) {
            ejecutarActualizacion(
                "UPDATE usuarios SET ha_votado_organizacion = 1 WHERE id = ?",
                [usuarioActual.id]
            );
            console.log('✅ Usuario marcado como votó organización');
        }

        if (votoLiderResultado > 0) {
            ejecutarActualizacion(
                "UPDATE usuarios SET ha_votado_lider = 1 WHERE id = ?",
                [usuarioActual.id]
            );
            console.log('✅ Usuario marcado como votó líder');
        }

        // 4. Guardar base de datos inmediatamente
        if (typeof guardarBaseDatos === 'function') {
            guardarBaseDatos();
            console.log('✅ Base de datos guardada en localStorage');
        }

        // 5. Actualizar usuario en sessionStorage
        usuarioActual.ha_votado_organizacion = 1;
        usuarioActual.ha_votado_lider = 1;
        sessionStorage.setItem('usuario', JSON.stringify(usuarioActual));

        // 6. Mostrar mensaje de éxito
        mostrarMensajeVotacion(
            `✅ ¡VOTOS REGISTRADOS EXITOSAMENTE!\n\n` +
            `Has votado por ${votosOrgExitosos} miembro(s) de organización\n` +
            `Has votado por: ${nombreLider} como líder\n\n` +
            `Redirigiendo a resultados...`,
            'success'
        );

        // 7. Redirigir después de 3 segundos
        setTimeout(() => {
            if (votacionFinalizada()) {
                window.location.href = 'resultados.html';
            } else {
                window.location.href = 'espera.html';
            }
        }, 3000);

    } catch (error) {
        console.error('❌ ERROR DETALLADO:', error);
        
        // Restaurar botón
        btnEnviar.textContent = btnOriginalText;
        btnEnviar.disabled = false;
        
        // Mostrar error específico
        let mensajeError = 'Error al registrar votos. ';
        
        if (error.message.includes('UNIQUE constraint failed')) {
            mensajeError += 'Ya has votado anteriormente.';
        } else if (error.message.includes('no such table')) {
            mensajeError += 'Error en la base de datos. Recarga la página.';
        } else {
            mensajeError += error.message;
        }
        
        mostrarMensajeVotacion(mensajeError, 'error');
        
        // Opcional: ofrecer reintentar
        setTimeout(() => {
            if (confirm('Hubo un error. ¿Quieres intentar enviar tus votos nuevamente?')) {
                enviarVotos();
            }
        }, 2000);
    }
}

// Mostrar mensajes en la votación
function mostrarMensajeVotacion(texto, tipo = 'info') {
    const mensajeElement = document.getElementById('mensajeVotacion');
    if (mensajeElement) {
        mensajeElement.textContent = texto;
        mensajeElement.className = `message ${tipo}`;
        mensajeElement.style.display = 'block';
        
        setTimeout(() => {
            mensajeElement.style.display = 'none';
        }, 5000);
    }
}

function resetearSeleccionLider(nuevoId) {
    // Deseleccionar visualmente el anterior
    if (seleccionLider) {
        const cardAnterior = document.querySelector(`.candidato-card[data-tipo="lider"][data-id="${seleccionLider}"]`);
        if (cardAnterior) {
            cardAnterior.classList.remove('seleccionado', 'lider-seleccionado');
            
            // Si usa radio buttons
            const radioAnterior = document.querySelector(`#lider-${seleccionLider}`);
            if (radioAnterior) radioAnterior.checked = false;
        }
    }
    
    // Seleccionar el nuevo
    seleccionLider = nuevoId;
    
    // Actualizar contador
    document.getElementById('contadorLider').textContent = 1;
    document.getElementById('btnEnviar').disabled = false;
}

function confirmarSeleccionLider(id) {
    // Si ya hay un líder seleccionado, pedir confirmación
    if (seleccionLider && seleccionLider !== id) {
        const cardNuevo = document.querySelector(`.candidato-card[data-tipo="lider"][data-id="${id}"] h3`);
        const nombreNuevo = cardNuevo ? cardNuevo.textContent : 'este candidato';
        
        if (!confirm(`¿Cambiar tu voto de líder a ${nombreNuevo}?`)) {
            return false;
        }
    }
    
    return true;
}

