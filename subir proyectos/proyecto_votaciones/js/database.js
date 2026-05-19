// SQL.js para SQLite en el navegador
let db = null;
let SQL = null;
let isDatabaseInitialized = false;

// Función hash simple para contraseñas (para proyecto escolar)
function hashPassword(password) {
    return btoa(password); // Base64 simple
}

// Función para verificar contraseña
function verifyPassword(inputPassword, storedHash) {
    return hashPassword(inputPassword) === storedHash;
}

// Inicializar la base de datos
async function initDatabase() {
    try {
        if (isDatabaseInitialized && db) {
            console.log('Base de datos ya inicializada');
            return true;
        }
        
        // Cargar SQL.js
        SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });
        
        // Intentar cargar base de datos guardada
        const savedDB = localStorage.getItem('voting_database');
        
        if (savedDB) {
            const data = new Uint8Array(JSON.parse(savedDB));
            db = new SQL.Database(data);
            console.log('Base de datos cargada desde localStorage');
        } else {
            db = new SQL.Database();
            console.log('Nueva base de datos creada');
        }
        
        // Crear tablas
        crearTablas();
        
        // Insertar datos iniciales si no existen
        inicializarDatos();
        
        // Guardar base de datos periódicamente
        setInterval(guardarBaseDatos, 30000); // Cada 30 segundos
        
        isDatabaseInitialized = true;
        console.log('Base de datos inicializada correctamente');
        return true;
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        return false;
    }
}

// Función para guardar base de datos en localStorage
function guardarBaseDatos() {
    if (db) {
        try {
            const data = db.export();
            localStorage.setItem('voting_database', JSON.stringify(Array.from(data)));
            console.log('Base de datos guardada en localStorage');
        } catch (error) {
            console.error('Error al guardar base de datos:', error);
        }
    }
}

// Crear todas las tablas necesarias
function crearTablas() {
    // Tabla de usuarios
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            matricula TEXT UNIQUE NOT NULL,
            nombre TEXT NOT NULL,
            password TEXT NOT NULL,
            ha_votado_organizacion BOOLEAN DEFAULT 0,
            ha_votado_lider BOOLEAN DEFAULT 0,
            es_admin BOOLEAN DEFAULT 0
        );
    `);

    // Tabla de candidatos
    db.run(`
        CREATE TABLE IF NOT EXISTS candidatos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            foto TEXT,
            descripcion TEXT,
            tipo TEXT NOT NULL CHECK (tipo IN ('organizacion', 'lider', 'ambos'))
        );
    `);

    // Tabla de votos organización
    db.run(`
        CREATE TABLE IF NOT EXISTS votos_organizacion (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            candidato_id INTEGER,
            fecha_voto TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
            FOREIGN KEY (candidato_id) REFERENCES candidatos(id),
            UNIQUE(usuario_id, candidato_id)
        );
    `);

    // Tabla de votos líder
    db.run(`
        CREATE TABLE IF NOT EXISTS votos_lider (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER UNIQUE,
            candidato_id INTEGER,
            fecha_voto TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
            FOREIGN KEY (candidato_id) REFERENCES candidatos(id)
        );
    `);

    // Configuración del sistema
    db.run(`
        CREATE TABLE IF NOT EXISTS configuracion (
            id INTEGER PRIMARY KEY DEFAULT 1,
            inicio_votacion TIMESTAMP,
            fin_votacion TIMESTAMP,
            CHECK (id = 1)
        );
    `);
}

// Insertar datos iniciales
function inicializarDatos() {
    // Insertar configuración por defecto
    const config = db.exec("SELECT * FROM configuracion");
    if (config.length === 0) {
        db.run(`
            INSERT INTO configuracion (inicio_votacion, fin_votacion) 
            VALUES (datetime('now', '+1 day'), datetime('now', '+2 days'))
        `);
    }

    // Insertar administrador por defecto - CON CONTRASEÑA HASH
    const admin = db.exec("SELECT * FROM usuarios WHERE es_admin = 1 AND matricula = 'admin'");
    if (admin.length === 0) {
        // Usar hashPassword para generar contraseña hasheada
        const adminPasswordHash = hashPassword('admin123');
        db.run(`
            INSERT INTO usuarios (matricula, nombre, password, es_admin) 
            VALUES ('admin', 'Administrador', ?, 1)
        `, [adminPasswordHash]);
        
        console.log('Administrador creado con contraseña hasheada');
    } else {
        // Verificar si la contraseña del admin está en texto plano y actualizarla
        const adminUser = admin[0];
        if (adminUser.password === 'admin123') {
            // Actualizar a hash
            const adminPasswordHash = hashPassword('admin123');
            db.run(`
                UPDATE usuarios SET password = ? WHERE id = ?
            `, [adminPasswordHash, adminUser.id]);
            console.log('Contraseña del admin actualizada a hash');
        }
    }
}

// Ejecutar consulta SELECT
function ejecutarConsulta(sql, params = []) {
    try {
        const stmt = db.prepare(sql);
        stmt.bind(params);
        const resultados = [];
        while (stmt.step()) {
            resultados.push(stmt.getAsObject());
        }
        stmt.free();
        return resultados;
    } catch (error) {
        console.error('Error en consulta:', error);
        return [];
    }
}

// Ejecutar INSERT, UPDATE, DELETE
function ejecutarActualizacion(sql, params = []) {
    try {
        const stmt = db.prepare(sql);
        stmt.run(params);
        stmt.free();
        return db.getRowsModified();
    } catch (error) {
        console.error('Error en actualización:', error);
        return 0;
    }
}

// Exportar base de datos a ArrayBuffer (para guardar)
function exportarBaseDatos() {
    return db.export();
}

// Importar base de datos desde ArrayBuffer
function importarBaseDatos(arrayBuffer) {
    const data = new Uint8Array(arrayBuffer);
    db.close();
    db = new SQL.Database(data);
}

// Funciones específicas para usuarios
function buscarUsuario(matricula, password) {
    const usuarios = ejecutarConsulta(
        "SELECT * FROM usuarios WHERE matricula = ?",
        [matricula]
    );
    
    if (usuarios.length === 0) return [];
    
    const usuario = usuarios[0];
    const inputHash = hashPassword(password);
    
    // Verificar si la contraseña almacenada está hasheada o en texto plano
    if (usuario.password === inputHash) {
        // Contraseña hasheada correcta
        return [usuario];
    } else if (usuario.password === password) {
        // Contraseña en texto plano - convertir a hash y actualizar
        const nuevoHash = hashPassword(password);
        ejecutarActualizacion(
            "UPDATE usuarios SET password = ? WHERE id = ?",
            [nuevoHash, usuario.id]
        );
        console.log(`Usuario ${matricula}: contraseña actualizada a hash`);
        return [usuario];
    }
    
    return [];
}

function verificarUsuarios() {
    const usuarios = ejecutarConsulta("SELECT matricula, nombre, password, es_admin FROM usuarios");
    console.log('=== VERIFICACIÓN DE USUARIOS ===');
    usuarios.forEach(user => {
        console.log(`${user.matricula} - ${user.nombre} - Admin: ${user.es_admin} - Password: ${user.password.substring(0, 10)}...`);
    });
    console.log('===============================');
}

function buscarUsuarioPorMatricula(matricula) {
    return ejecutarConsulta(
        "SELECT * FROM usuarios WHERE matricula = ?",
        [matricula]
    );
}

function crearUsuario(matricula, nombre, password, esAdmin = false) {
    const passwordHash = hashPassword(password);
    
    // ⚠️ PROBLEMA: Si no especificamos los valores, pueden tomar valores por defecto incorrectos
    return ejecutarActualizacion(
        "INSERT INTO usuarios (matricula, nombre, password, es_admin, ha_votado_organizacion, ha_votado_lider) VALUES (?, ?, ?, ?, 0, 0)",
        [matricula, nombre, passwordHash, esAdmin ? 1 : 0]
    );
}

function marcarUsuarioVotoOrganizacion(usuarioId) {
    return ejecutarActualizacion(
        "UPDATE usuarios SET ha_votado_organizacion = 1 WHERE id = ?",
        [usuarioId]
    );
}

function marcarUsuarioVotoLider(usuarioId) {
    return ejecutarActualizacion(
        "UPDATE usuarios SET ha_votado_lider = 1 WHERE id = ?",
        [usuarioId]
    );
}

// Funciones para candidatos
function obtenerCandidatos(tipo = null) {
    if (tipo) {
        return ejecutarConsulta(
            "SELECT * FROM candidatos WHERE tipo = ? OR tipo = 'ambos' ORDER BY nombre",
            [tipo]
        );
    }
    return ejecutarConsulta("SELECT * FROM candidatos ORDER BY nombre");
}

function agregarCandidato(nombre, tipo, descripcion = '', foto = '') {
    return ejecutarActualizacion(
        "INSERT INTO candidatos (nombre, tipo, descripcion, foto) VALUES (?, ?, ?, ?)",
        [nombre, tipo, descripcion, foto]
    );
}

function eliminarCandidato(id) {
    return ejecutarActualizacion("DELETE FROM candidatos WHERE id = ?", [id]);
}

// Funciones para votación
function registrarVotoOrganizacion(usuarioId, candidatoIds) {
    let registros = 0;
    
    // Verificar que no haya votado ya
    const yaVoto = ejecutarConsulta(
        "SELECT * FROM votos_organizacion WHERE usuario_id = ?", 
        [usuarioId]
    );
    
    if (yaVoto.length > 0) {
        console.error('Usuario ya votó en organización');
        return 0;
    }
    
    candidatoIds.forEach(candidatoId => {
        try {
            const resultado = ejecutarActualizacion(
                "INSERT INTO votos_organizacion (usuario_id, candidato_id) VALUES (?, ?)",
                [usuarioId, candidatoId]
            );
            registros += resultado;
            console.log(`Voto org: usuario ${usuarioId}, candidato ${candidatoId}: ${resultado}`);
        } catch (error) {
            console.error('Error insertando voto org:', error);
        }
    });
    
    // Guardar inmediatamente
    guardarBaseDatos();
    return registros;
}

function registrarVotoLider(usuarioId, candidatoId) {
    try {
        // Verificar que no haya votado ya
        const yaVoto = ejecutarConsulta(
            "SELECT * FROM votos_lider WHERE usuario_id = ?", 
            [usuarioId]
        );
        
        if (yaVoto.length > 0) {
            console.error('Usuario ya votó para líder');
            return 0;
        }
        
        const resultado = ejecutarActualizacion(
            "INSERT INTO votos_lider (usuario_id, candidato_id) VALUES (?, ?)",
            [usuarioId, candidatoId]
        );
        
        console.log(`Voto líder: usuario ${usuarioId}, candidato ${candidatoId}: ${resultado}`);
        
        // Guardar inmediatamente
        guardarBaseDatos();
        return resultado;
    } catch (error) {
        console.error('Error insertando voto líder:', error);
        return 0;
    }
}

// Funciones para resultados
function obtenerResultadosOrganizacion() {
    return ejecutarConsulta(`
        SELECT c.id, c.nombre, c.descripcion, COUNT(v.candidato_id) as votos
        FROM candidatos c
        LEFT JOIN votos_organizacion v ON c.id = v.candidato_id
        WHERE c.tipo = 'organizacion' OR c.tipo = 'ambos'
        GROUP BY c.id
        ORDER BY votos DESC
        LIMIT 7
    `);
}

function obtenerResultadoLider() {
    return ejecutarConsulta(`
        SELECT c.id, c.nombre, c.descripcion, COUNT(v.candidato_id) as votos
        FROM candidatos c
        LEFT JOIN votos_lider v ON c.id = v.candidato_id
        WHERE c.tipo = 'lider' OR c.tipo = 'ambos'
        GROUP BY c.id
        ORDER BY votos DESC
        
    `);
}

function obtenerTodosResultados() {
    const organizacion = obtenerResultadosOrganizacion();
    const lider = obtenerResultadoLider(); // Ahora devuelve todos
    
    const totalVotantes = ejecutarConsulta("SELECT COUNT(*) as total FROM usuarios WHERE ha_votado_lider = 1")[0].total;
    const votosOrganizacion = ejecutarConsulta("SELECT COUNT(*) as total FROM votos_organizacion")[0].total;
    const votosLider = ejecutarConsulta("SELECT COUNT(*) as total FROM votos_lider")[0].total;
    
    return {
        organizacion,
        lider, // Ahora es un array con todos los candidatos
        estadisticas: {
            totalVotantes,
            votosOrganizacion,
            votosLider,
            porcentaje: totalVotantes > 0 ? Math.round((totalVotantes / ejecutarConsulta("SELECT COUNT(*) as total FROM usuarios WHERE es_admin = 0")[0].total) * 100) : 0
        }
    };
}

// Funciones de configuración
function obtenerConfiguracion() {
    return ejecutarConsulta("SELECT * FROM configuracion WHERE id = 1")[0];
}

function actualizarConfiguracion(inicio, fin) {
    return ejecutarActualizacion(
        "UPDATE configuracion SET inicio_votacion = ?, fin_votacion = ? WHERE id = 1",
        [inicio, fin]
    );
}

// Verificar si la votación está activa
function votacionActiva() {
    const config = obtenerConfiguracion();
    if (!config.inicio_votacion || !config.fin_votacion) {
        return false;
    }
    
    const ahora = new Date().toISOString();
    return ahora >= config.inicio_votacion && ahora <= config.fin_votacion;
}

// Obtener tiempo restante
function obtenerTiempoRestante() {
    const config = obtenerConfiguracion();
    const fin = new Date(config.fin_votacion);
    const ahora = new Date();
    
    const diferencia = fin - ahora;
    
    if (diferencia <= 0) {
        return "La votación ha finalizado";
    }
    
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${horas}h ${minutos}m restantes`;
}

// Cargar usuarios de ejemplo
function cargarUsuariosEjemplo() {
    const usuarios = [
        { matricula: 'A12345', nombre: 'Juan Pérez', password: '123' },
        { matricula: 'A12346', nombre: 'María García', password: '123' },
        { matricula: 'A12347', nombre: 'Carlos López', password: '123' },
        { matricula: 'A12348', nombre: 'Ana Martínez', password: '123' },
        { matricula: 'A12349', nombre: 'Pedro Rodríguez', password: '123' },
        { matricula: 'A12350', nombre: 'Laura Sánchez', password: '123' },
        { matricula: 'A12351', nombre: 'Miguel González', password: '123' },
        { matricula: 'A12352', nombre: 'Sofía Fernández', password: '123' },
        { matricula: 'A12353', nombre: 'David Ramírez', password: '123' },
        { matricula: 'A12354', nombre: 'Elena Torres', password: '123' },
        { matricula: 'A12355', nombre: 'Javier Díaz', password: '123' }
    ];
    
    usuarios.forEach(usuario => {
        const existe = buscarUsuarioPorMatricula(usuario.matricula);
        if (existe.length === 0) {
            // Crear usuario con contraseña hasheada
            const passwordHash = hashPassword(usuario.password);
            ejecutarActualizacion(
                "INSERT INTO usuarios (matricula, nombre, password, es_admin) VALUES (?, ?, ?, 0)",
                [usuario.matricula, usuario.nombre, passwordHash]
            );
        }
    });
    
    // Cargar candidatos de ejemplo si no existen
    const candidatos = obtenerCandidatos();
    if (candidatos.length === 0) {
        const candidatosEjemplo = [
            { nombre: 'Carlos Mendoza', tipo: 'ambos', descripcion: 'Ing. en Sistemas - 5to semestre' },
            { nombre: 'Ana Silva', tipo: 'ambos', descripcion: 'Ing. en Software - 6to semestre' },
            { nombre: 'Luis Rojas', tipo: 'ambos', descripcion: 'Ing. Informática - 4to semestre' },
            { nombre: 'Marta Vega', tipo: 'ambos', descripcion: 'Ing. en Computación - 5to semestre' },
            { nombre: 'Roberto Cruz', tipo: 'ambos', descripcion: 'Ing. en TI - 6to semestre' },
            { nombre: 'Patricia Mora', tipo: 'ambos', descripcion: 'Ing. en Sistemas - 7mo semestre' },
            { nombre: 'José Herrera', tipo: 'ambos', descripcion: 'Ing. en Software - 8vo semestre' },
            { nombre: 'Gabriela Castro', tipo: 'ambos', descripcion: 'Ing. Informática - 9no semestre' }
        ];
        
        candidatosEjemplo.forEach(candidato => {
            agregarCandidato(candidato.nombre, candidato.tipo, candidato.descripcion);
        });
    }
    
    console.log('Usuarios de ejemplo cargados/corregidos');
}


// En database.js, añade:
function obtenerGanadorLider() {
    return ejecutarConsulta(`
        SELECT c.id, c.nombre, c.descripcion, COUNT(v.candidato_id) as votos
        FROM candidatos c
        LEFT JOIN votos_lider v ON c.id = v.candidato_id
        WHERE c.tipo = 'lider' OR c.tipo = 'ambos'
        GROUP BY c.id
        ORDER BY votos DESC
        LIMIT 1
    `)[0] || null;
}

function votacionFinalizada() {
    const config = obtenerConfiguracion();
    if (!config.fin_votacion) {
        return false;
    }
    const ahora = new Date().toISOString();
    return ahora > config.fin_votacion;
}

function votacionEnCurso() {
    const config = obtenerConfiguracion();
    if (!config.inicio_votacion || !config.fin_votacion) {
        return false;
    }
    const ahora = new Date().toISOString();
    return ahora >= config.inicio_votacion && ahora <= config.fin_votacion;
}

// En database.js, añade esta función:
function corregirUsuariosSinVotar() {
    const usuarios = ejecutarConsulta("SELECT id, matricula FROM usuarios WHERE ha_votado_organizacion = 1 OR ha_votado_lider = 1");
    
    usuarios.forEach(usuario => {
        // Verificar si realmente tiene votos
        const votosOrg = ejecutarConsulta(
            "SELECT COUNT(*) as total FROM votos_organizacion WHERE usuario_id = ?",
            [usuario.id]
        )[0].total;
        
        const votosLider = ejecutarConsulta(
            "SELECT COUNT(*) as total FROM votos_lider WHERE usuario_id = ?",
            [usuario.id]
        )[0].total;
        
        // Si no tiene votos pero está marcado como que votó, corregir
        if (votosOrg === 0 && votosLider === 0) {
            ejecutarActualizacion(
                "UPDATE usuarios SET ha_votado_organizacion = 0, ha_votado_lider = 0 WHERE id = ?",
                [usuario.id]
            );
            console.log(`✅ Corregido usuario ${usuario.matricula} (ID: ${usuario.id})`);
        }
    });
    
    guardarBaseDatos();
}


function diagnosticarUsuario(matricula) {
    const usuario = buscarUsuarioPorMatricula(matricula);
    if (usuario.length === 0) {
        console.log(`❌ Usuario ${matricula} no encontrado`);
        return;
    }
    
    const u = usuario[0];
    console.log('=== DIAGNÓSTICO USUARIO ===');
    console.log(`ID: ${u.id}`);
    console.log(`Matrícula: ${u.matricula}`);
    console.log(`Nombre: ${u.nombre}`);
    console.log(`ha_votado_organizacion: ${u.ha_votado_organizacion} (${typeof u.ha_votado_organizacion})`);
    console.log(`ha_votado_lider: ${u.ha_votado_lider} (${typeof u.ha_votado_lider})`);
    console.log(`es_admin: ${u.es_admin}`);
    
    // Ver votos reales
    const votosOrg = ejecutarConsulta("SELECT COUNT(*) as total FROM votos_organizacion WHERE usuario_id = ?", [u.id])[0].total;
    const votosLider = ejecutarConsulta("SELECT COUNT(*) as total FROM votos_lider WHERE usuario_id = ?", [u.id])[0].total;
    
    console.log(`Votos organización reales: ${votosOrg}`);
    console.log(`Votos líder reales: ${votosLider}`);
    
    // Verificar consistencia
    const orgInconsistente = (u.ha_votado_organizacion && votosOrg === 0) || (!u.ha_votado_organizacion && votosOrg > 0);
    const liderInconsistente = (u.ha_votado_lider && votosLider === 0) || (!u.ha_votado_lider && votosLider > 0);
    
    if (orgInconsistente || liderInconsistente) {
        console.log('⚠️ INCONSISTENCIA DETECTADA');
        if (orgInconsistente) {
            console.log(`- ha_votado_organizacion (${u.ha_votado_organizacion}) no coincide con votos reales (${votosOrg})`);
        }
        if (liderInconsistente) {
            console.log(`- ha_votado_lider (${u.ha_votado_lider}) no coincide con votos reales (${votosLider})`);
        }
    } else {
        console.log('✅ Datos consistentes');
    }
    console.log('==========================');
}