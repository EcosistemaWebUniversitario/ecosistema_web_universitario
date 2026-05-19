// Debug para login de administrador
document.addEventListener('DOMContentLoaded', async function() {
    await initDatabase();
    
    // Verificar si el admin existe
    const admin = ejecutarConsulta("SELECT * FROM usuarios WHERE matricula = 'admin'");
    
    if (admin.length === 0) {
        console.error('ADMIN NO ENCONTRADO en la base de datos');
        // Crear admin si no existe
        const adminPasswordHash = hashPassword('admin123');
        ejecutarActualizacion(
            "INSERT INTO usuarios (matricula, nombre, password, es_admin) VALUES ('admin', 'Administrador', ?, 1)",
            [adminPasswordHash]
        );
        console.log('Administrador creado automáticamente');
    } else {
        console.log('Admin encontrado:', admin[0]);
        console.log('Hash de admin123:', hashPassword('admin123'));
        console.log('Contraseña almacenada:', admin[0].password);
    }
    
    // Verificar todos los usuarios
    verificarUsuarios();
});

// Función para debug directo desde consola
function debugAdminLogin() {
    const password = prompt('Ingresa contraseña para admin:');
    const hash = hashPassword(password);
    console.log('Hash generado:', hash);
    
    const admin = ejecutarConsulta("SELECT * FROM usuarios WHERE matricula = 'admin'");
    console.log('Admin en BD:', admin[0]);
    console.log('Coinciden?', admin[0].password === hash);
    
    if (admin[0].password === hash) {
        alert('✓ Contraseña CORRECTA');
    } else {
        alert('✗ Contraseña INCORRECTA\nHash esperado: ' + admin[0].password + '\nHash ingresado: ' + hash);
    }
}

// Función para resetear admin
function resetAdminPassword() {
    if (confirm('¿Resetear contraseña del admin a "admin123"?')) {
        const adminPasswordHash = hashPassword('admin123');
        const resultado = ejecutarActualizacion(
            "UPDATE usuarios SET password = ? WHERE matricula = 'admin'",
            [adminPasswordHash]
        );
        
        if (resultado > 0) {
            alert('✓ Contraseña del admin reseteada a "admin123"');
            console.log('Nuevo hash:', adminPasswordHash);
        } else {
            alert('✗ Error al resetear contraseña');
        }
    }
}