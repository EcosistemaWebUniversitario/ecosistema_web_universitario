// Sistema de registro para estudiantes
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

// Manejar registro de estudiantes
async function handleRegister(e) {
    e.preventDefault();
    
    const matricula = document.getElementById('regMatricula').value.trim();
    const nombre = document.getElementById('regNombre').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    // Validaciones
    if (!matricula || !nombre || !password || !confirmPassword) {
        mostrarMensajeRegistro('Por favor, completa todos los campos', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        mostrarMensajeRegistro('Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (password.length < 3) {
        mostrarMensajeRegistro('La contraseña debe tener al menos 3 caracteres', 'error');
        return;
    }
    
    if (matricula.length < 5) {
        mostrarMensajeRegistro('La matrícula debe tener al menos 5 caracteres', 'error');
        return;
    }
    
    try {
        // Verificar si la matrícula ya existe
        const usuarioExistente = buscarUsuarioPorMatricula(matricula);
        
        if (usuarioExistente.length > 0) {
            mostrarMensajeRegistro('Esta matrícula ya está registrada', 'error');
            return;
        }
        
        // Crear usuario
        const resultado = crearUsuario(matricula, nombre, password, false);
        
        if (resultado > 0) {
            mostrarMensajeRegistro('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión', 'success');
            
            // Limpiar formulario
            document.getElementById('registerForm').reset();
            
            // Cambiar a pestaña de login después de 2 segundos
            setTimeout(() => {
                document.querySelector('.tab-button[data-tab="login"]').click();
            }, 2000);
            
        } else {
            mostrarMensajeRegistro('Error al crear la cuenta. Intenta nuevamente.', 'error');
        }
        
    } catch (error) {
        console.error('Error en registro:', error);
        mostrarMensajeRegistro('Error en el sistema. Intenta más tarde.', 'error');
    }
}

// Mostrar mensajes en registro
function mostrarMensajeRegistro(texto, tipo = 'info') {
    const messageElement = document.getElementById('registerMessage') || document.getElementById('message');
    if (messageElement) {
        messageElement.textContent = texto;
        messageElement.className = `message ${tipo}`;
        messageElement.style.display = 'block';
        
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
}

// Cambiar entre pestañas Login/Registro
function cambiarTab(tabName) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Mostrar pestaña seleccionada
    document.getElementById(`${tabName}Form`).classList.add('active');
    
    // Actualizar botones de pestañas
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
        if (button.dataset.tab === tabName) {
            button.classList.add('active');
        }
    });
}