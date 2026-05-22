import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;



// Middleware
app.use(cors());
app.use(express.json());
app.use('/auth',authRoutes)

// // Ruta de logins
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Busca el usuario por email
//     const result = await pool.query('SELECT * FROM usuario WHERE correo = $1', [email]);
//     const user = result.rows[0];

//     if (!user) {
//       return res.status(401).json({ message: 'Credenciales inválidas' });
//     }

//     // Verifica la contraseña
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Credenciales inválidas' });
//     }

//     // Genera un token JWT
//     const token = jwt.sign({ id: user.id }, 'tu_secreto_jwt', { expiresIn: '1h' });

//     return res.json({ token });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Error en el servidor' });
//   }
// });

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Puerto de tu frontend
  credentials: true
}));
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API funcionando', 
    rutas: [
      '/auth/login',
      '/auth/loginAdm',
      '/auth/verificar'
    ]
  });
});

// Rutas de autenticación
app.use('/auth', authRoutes);

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:3000`);
  console.log(`Frontend debe estar en http://localhost:5173`);
});

// Ruta de prueba de conexión a BD
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as time, version() as version');
    res.json({ 
      success: true, 
      time: result.rows[0].time,
      version: result.rows[0].version
    });
  } catch (error) {
    console.error('Error en test-db:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ruta para listar usuarios (solo para pruebas)
app.get('/test-users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_estudiante, correo, nombre_estudiante FROM estudiante');
    res.json({ 
      success: true, 
      count: result.rows.length,
      users: result.rows
    });
  } catch (error) {
    console.error('Error en test-users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});