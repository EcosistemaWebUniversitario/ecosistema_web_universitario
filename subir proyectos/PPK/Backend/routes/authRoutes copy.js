import express, { response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pg from 'pg';
// import { agregarFacultad, obtenerFacultades, obtenerFacultad, obtenerFacultadNomb, eliminarFacultad, actualizarFacultad} from '../controllers/facultadController';


const router = express.Router()

// Configuración de la base de datos
const pool = new pg.Pool({
  user: 'ed',
  host: 'localhost',
  database: 'basedatos',
  password: '1234',
  port: 5432,
});

const verifityToken = async (req, res, next) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
      return res.status(403).json({message: "no existe el token"})
    }
    const decoded = jwt.verify(token, 'yilian_yailin')
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(500).json({message: "error en el servidor"})
  }
}

router.get('/verificar', verifityToken, async (req, res) => {
  try {
    const usuario = await pool.query('SELECT * FROM usuario WHERE id_usuario = $1', [req.userId]);
    if(usuario.rows.length === 0){
      return res.status(404).json({message: "usuario no encontrado"})
    }
    return res.status(201).json(usuario.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
})

router.post('/login', async (req,res)=>{
const { email, password } = req.body;

  try {
    // Busca el usuario por email
    const {rows} = await pool.query('SELECT * FROM estudiante WHERE correo = $1', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'usuario no existe' });
    }

    // Verifica la contraseña
    const isMatch = await bcrypt.compare(password, rows[0].contraseña)
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

  
    // Genera un token JWT
    const token = jwt.sign({ id: rows[0].id_usuario }, 'yilian_yailin', { expiresIn: '1h' });
  
    return res.status(201).json({token});
  } catch (error) {
    console.error('Error en /auth/login:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
})

router.post('/loginAdm', async (req,res)=>{
  const { email, password } = req.body;
  
    try {
      // Busca el usuario por email
      const {rows} = await pool.query('SELECT * FROM administrador WHERE correo = $1', [email]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'usuario no existe' });
      }
  
      // Verifica la contraseña
      const isMatch = (password == rows[0].contraseña)? true : false;
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
  
    
      // Genera un token JWT
      const token = jwt.sign({ id: rows[0].id_usuario }, 'yilian_yailin', { expiresIn: '1h' });
      return res.status(201).json({token});
    } catch (error) {
      console.error('Error en /auth/loginAdm:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  })

// ASIGNATURAS!!!!!!
// Agregar una asignatura
router.post('/asignaturas', async (req, res) => {
  const { nombre } = req.body;
      try {

      const result = await pool.query('INSERT INTO asignatura(nombre_asignatura) VALUES($1)', [nombre]);
      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al agregar la asignatura');
  }
});

// Agregar una asignatura a una carrera
router.post('/asignaturas/carrera', async (req, res) => {
  const { id_carrera, id_asignatura } = req.body;
  console.log(id_carrera, id_asignatura)
      try {

      const result = await pool.query('INSERT INTO carrera_asignatura(id_carrera, id_asignatura) VALUES($1, $2)', [id_carrera, id_asignatura]);
      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al agregar la asignatura');
  }
});


// Obtener todas las asignaturas
router.get('/asignaturas', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM asignatura');
      res.json(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener las asignaturas');
  }
});

// Obtener una asignatura
router.get('/asignaturas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM asignatura WHERE id_asignatura = $1', [id]);

    if(result.rows.length === 0){
      return res.status(404).json({message: "asignatura no encontrada"});
    }
    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la asignatura');
  }
})

//Obtener una asignatura por nombre
router.get('/asignaturas/nombre/:nombre', async (req, res) => {
  const { nombre } = req.params;

  try {
    const result = await pool.query('SELECT * FROM asignatura WHERE nombre_asignatura = $1', [nombre]);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la asignatura');
  }
});

//Obtener asignaturas por carrera
router.get('/asignaturas/carrera/:id', async (req, res) => {
  const { id } = req.params;
  console.log( id)

  try {
    const result = await pool.query('SELECT * FROM carrera_asignatura ca JOIN asignatura a ON ca.id_asignatura = a.id_asignatura JOIN carrera c ON ca.id_carrera = c.id_carrera WHERE ca.id_carrera = $1', [id]);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la asignatura');
  }
});

//Obtener asignaturas por carrera y nombre
router.get('/asignaturas/:carrera/:id', async (req, res) => {
  const { carrera, id } = req.params;
  console.log( id)

  try {
    const result = await pool.query('SELECT * FROM carrera_asignatura ca JOIN asignatura a ON ca.id_asignatura = a.id_asignatura JOIN carrera c ON ca.id_carrera = c.id_carrera WHERE ca.id_carrera = $1 AND ca.id_asignatura = $2', [carrera, id]);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la asignatura');
  }
});

// Eliminar una asignatura
router.delete('/asignaturas/:id', async (req, res) => {
  const { id } = req.params;
  try {
      await pool.query('DELETE FROM asignatura WHERE id_asignatura = $1', [id]);
      res.status(204).send();
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar la asignatura');
  }
});

//Eliminar una asignatura de una carrera
router.delete('/asignaturas/:id/:idAsig', async (req, res) => {
  const { id, idAsig } = req.params;
  try {
      await pool.query('DELETE FROM carrera_asignatura WHERE id_carrera = $1 AND id_asignatura = $2', [id, idAsig]);
      res.status(204).send();
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar la asignatura');
  }
});

// Actualizar una asignatura
router.put('/asignaturas/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  try {
      const result = await pool.query('UPDATE asignatura SET nombre_asignatura = $1 WHERE id_asignatura = $2 RETURNING *', [nombre, id]);
      if(result.rows.length === 0){
        return res.status(404).json({message: "asignatura no encontrada"});
      }
      res.status(204).send();
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al actualizar la asignatura');
  }
});

// obtener asignaturas por la carrera de la brigada
router.get('/asignaturas/brigada/brigada/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const result = await pool.query('SELECT a.id_asignatura, a.nombre_asignatura FROM asignatura a  JOIN carrera_asignatura ca ON a.id_asignatura = ca.id_asignatura JOIN carrera c ON ca.id_carrera = c.id_carrera JOIN brigada b ON c.id_carrera = b.id_carrera WHERE b.id_brigada = $1', [id]);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la asignatura');
  }

});





// FACULTADES!!!!!!
// Agregar una facultad
router.post('/facultades', async (req, res) => {
    const { nombre } = req.body;
        try {
       const verificar = await pool.query('SELECT * FROM facultad WHERE nombre_facultad = $1', [nombre]);
  
       if (verificar.rows.length > 0) {
           return res.status(400).json({message: "la facultad ya existe"});
       }
  
        const result = await pool.query('INSERT INTO facultad(nombre_facultad) VALUES($1)', [nombre]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar la facultad');
    }
  }
);


// Obtener todas las facultades
router.get('/facultades', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM facultad');
      res.json(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener las facultades');
  }
});

// Obtener una facultad
router.get('/facultades/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM facultad WHERE id_facultad = $1', [id]);

    if(result.rows.length === 0){
      return res.status(404).json({message: "facultad no encontrada"});
    }
    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la facultad');
  }
});

//Obtener una facultad por nombre
router.get('/facultades/nombre/:nombre', async (req, res) => {
  const { nombre } = req.params;

  try {
    const result = await pool.query('SELECT * FROM facultad WHERE nombre_facultad = $1', [nombre]);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la asignatura');
  }
});


// Eliminar una facultad
router.delete('/facultades/:id', async (req, res) => {
  const { id } = req.params;
  try {
      await pool.query('DELETE FROM facultad WHERE id_facultad = $1', [id]);
      res.status(204).send();
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar la facultad');
  }
});

// Actualizar una facultad
router.put('/facultades/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  try {
      const result = await pool.query('UPDATE facultad SET nombre_facultad = $1 WHERE id_facultad = $2 RETURNING *', [nombre, id]);
      if(result.rows.length === 0){
        return res.status(404).json({message: "facultad no encontrada"});
      }
      res.status(204).send();
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al actualizar la facultad');
  }
});



// CARRERAS!!!!!!
// Agregar una carrera
router.post('/carreras', async (req, res) => {
  const { id_facultad, nombre_carrera, años } = req.body;
      try {

      const result = await pool.query('INSERT INTO carrera(id_facultad, nombre_carrera, años) VALUES($1, $2, $3)', [id_facultad, nombre_carrera, años]);
      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al agregar la carrera');
  }
});


// Obtener todas las carreras
router.get('/carreras', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM carrera');
      res.json(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener las carreras');
  }
});

// Obtener una carrera
router.get('/carreras/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM carrera WHERE id_carrera = $1', [id]);

    if(result.rows.length === 0){
      return res.status(404).json({message: "carrera no encontrada"});
    }
    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la carrera');
  }
})

// Obtener una carrera por facultad
router.get('/carreras/facultad/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const result = await pool.query('SELECT * FROM carrera WHERE id_facultad = $1', [id]);
      res.json(result.rows);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error en el servidor');
  }
});

//Obtener una carrera por nombre
router.get('/carreras/nombre/:nombre', async (req, res) => {
  const { nombre } = req.params;

  try {
    const result = await pool.query('SELECT * FROM carrera WHERE nombre_carrera = $1', [nombre]);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la asignatura');
  }
});

// Eliminar una carrera
router.delete('/carreras/:id', async (req, res) => {
  const { id } = req.params;
  try {
      await pool.query('DELETE FROM carrera WHERE id_carrera = $1', [id]);
      res.status(204).send();
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar la carrera');
  }
});

// Actualizar una carrera
router.put('/carreras/:id', async (req, res) => {
  const { id } = req.params;
  const { id_facultad, nombre_carrera, años } = req.body;

  try {
      const result = await pool.query('UPDATE carrera SET id_facultad = $1, nombre_carrera = $2, años = $3 WHERE id_carrera = $4 RETURNING *', [id_facultad, nombre_carrera, años, id]);
      if(result.rows.length === 0){
        return res.status(404).json({message: "carrera no encontrada"});
      }
      res.status(204).send();
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al actualizar la carrera');
  }
});




// BRIGADAS!!!!!!
// Agregar una brigada
router.post('/brigadas', async (req, res) => {
  const { id_carrera, nombre_brigada, año_brigada, añoFinal_brigada } = req.body;
      try {

      const result = await pool.query('INSERT INTO brigada(id_carrera, nombre_brigada, año_brigada, añoFinal_brigada) VALUES($1, $2, $3, $4)', [id_carrera, nombre_brigada, año_brigada, añoFinal_brigada]);
      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al agregar la brigada');
  }
});


// Obtener todas las brigadas
router.get('/brigadas', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM brigada');
      res.json(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener las brigadas');
  }
});

// Obtener una brigada
router.get('/brigadas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM brigada WHERE id_brigada = $1', [id]);

    if(result.rows.length === 0){
      return res.status(404).json({message: "brigada no encontrada"});
    }
    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la brigada');
  }
})

// Obtener brigadas por carrera
router.get('/brigadas/carrera/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const result = await pool.query('SELECT * FROM brigada WHERE id_carrera = $1', [id]);
      res.json(result.rows);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error en el servidor');
  }
});

//Obtener una brigada por nombre
router.get('/brigadas/nombre/:nombre', async (req, res) => {
  const { nombre } = req.params;

  try {
    const result = await pool.query('SELECT * FROM brigada WHERE nombre_brigada = $1', [nombre]);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la asignatura');
  }
});

// Eliminar una brigada
router.delete('/brigadas/:id', async (req, res) => {
  const { id } = req.params;
  try {
      await pool.query('DELETE FROM brigada WHERE id_brigada = $1', [id]);
      res.status(204).send();
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar la brigada');
  }
});

// Actualizar una brigada
router.put('/brigadas/:id', async (req, res) => {
  const { id } = req.params;
  const { id_carrera, nombre_brigada, año_brigada, añoFinal_brigada } = req.body;

  try {
      const result = await pool.query('UPDATE brigada SET id_carrera = $1, nombre_brigada = $2, año_brigada = $3, añoFinal_brigada = $4 WHERE id_brigada = $5 RETURNING *', [id_carrera, nombre_brigada, año_brigada, añoFinal_brigada, id]);
      if(result.rows.length === 0){
        return res.status(404).json({message: "brigada no encontrada"});
      }
      res.status(204).send();
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al actualizar la brigada');
  }
});


// ESTUDIANTES!!!!!!
// Agregar un estudiante
router.post('/estudiantes', async (req, res) => {
  const { correo, contraseña, id_brigada, nombre_estudiante, carnet } = req.body;
      try {
      const hashPassword = await bcrypt.hash(contraseña, 10);
      const result = await pool.query('INSERT INTO estudiante(correo, contraseña, rol, id_brigada, nombre_estudiante, carnet) VALUES($1, $2, "estudiante", $3, $4, $5)', [correo, hashPassword, id_brigada, nombre_estudiante, carnet]);
      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al agregar el estudiante');
  }
});


// Obtener todos los estudiantes
router.get('/estudiantes', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM estudiante');
      res.json(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener las estudiantes');
  }
});

// Obtener un estudiante
router.get('/estudiantes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM estudiante WHERE id_estudiante = $1', [id]);

    if(result.rows.length === 0){
      return res.status(404).json({message: "estudiante no encontrado"});
    }
    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la estudiante');
  }
})


// Obtener un estudiante por id_usuario
router.get('/estudiantes/usuario/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM estudiante WHERE id_usuario = $1', [id]);

    if(result.rows.length === 0){
      return res.status(404).json({message: "estudiante no encontrado"});
    }
    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la estudiante');
  }
})


// Obtener  estudiantes por brigada
router.get('/estudiantes/brigada/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const result = await pool.query('SELECT * FROM estudiante WHERE e.id_brigada = $1 GROUP BY e.id_estudiante', [id]);
      res.json(result.rows);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error en el servidor');
  }
});

//Obtener un estudiante por correo
router.get('/estudiantes/correo/:correo', async (req, res) => {
  const { correo } = req.params;

  try {
    const result = await pool.query('SELECT * FROM estudiante WHERE correo = $1', [correo]);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el estudiante');
  }
});


// Eliminar una estudiante
router.delete('/estudiantes/:id', async (req, res) => {
  const { id } = req.params;
  try {
      await pool.query('DELETE FROM estudiante WHERE id_estudiante = $1', [id]);
      res.status(204).send();
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar el estudiante');
  }
});

// Actualizar un estudiante
router.put('/estudiantes/:id', async (req, res) => {
  const { id } = req.params;
  const { correo, contraseña, id_brigada, nombre_estudiante, carnet } = req.body;

  try {
     const hashPassword = await bcrypt.hash(contraseña, 10);
      const result = await pool.query('UPDATE estudiante SET correo = $1, contraseña = $2, id_brigada = $3, nombre_estudiante = $4, carnet =$5  WHERE id_estudiante = $6 RETURNING *', [correo, hashPassword, id_brigada, nombre_estudiante, carnet, id]);
      if(result.rows.length === 0){
        return res.status(404).json({message: "estudiante no encontrado"});
      }
      res.status(204).send();
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al actualizar el estudiante');
  }
});




// NOTAS!!!!!!
// Agregar una nota
router.post('/notas', async (req, res) => {
  const { id_estudiante, id_asignatura, valor, año } = req.body;
      try {

      const result = await pool.query('INSERT INTO nota(id_estudiante, id_asignatura, valor, año) VALUES($1, $2, $3, $4)', [id_estudiante, id_asignatura, valor, año]);
      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al agregar la nota');
  }
});

// Obtener un nota
router.get('/notas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM nota n JOIN asignatura a ON n.id_asignatura = a.id_asignatura WHERE id_nota = $1', [id]);

    if(result.rows.length === 0){
      return res.status(404).json({message: "nota no encontrada"});
    }
    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la nota');
  }
})

// Obtener notas por estudiante
router.get('/notas/estudiante/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const result = await pool.query('SELECT * FROM nota n JOIN asignatura a ON n.id_asignatura = a.id_asignatura WHERE n.id_estudiante = $1 ORDER BY n.año asc', [id]);
      res.json(result.rows); 
  } catch (err) {
      console.error(err);
      res.status(500).send('Error en el servidor');
  }
});

//Obtener notas por año
router.get('/notas/estudiante/:id/:ano', async (req, res) => {
  const { id, ano } = req.params;
  console.log(ano);
  try {
    const result = await pool.query('SELECT * FROM nota n JOIN asignatura a ON n.id_asignatura = a.id_asignatura WHERE n.id_estudiante = $1 AND n.año = $2', [id, ano]);
    res.json(result.rows); 
} catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
}
});


//Obtener una nota por estudiante y asignatura
router.get('/notas/:asignatura/:nombre', async (req, res) => {
  const { asignatura, nombre } = req.params;

  try {
    const result = await pool.query('SELECT * FROM nota WHERE id_asignatura = $1 AND id_estudiante = $2', [asignatura, nombre]);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la nota');
  }
});

// Eliminar una nota
router.delete('/notas/:id', async (req, res) => {
  const { id } = req.params;
  try {
      await pool.query('DELETE FROM nota WHERE id_nota = $1', [id]);
      res.status(204).send();
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar la nota');
  }
});

// Actualizar un nota
router.put('/notas/:id', async (req, res) => {
  const { id } = req.params;
  const { id_estudiante, id_asignatura, valor, año } = req.body;

  try {
      const result = await pool.query('UPDATE nota SET id_estudiante = $1, id_asignatura = $2, valor =$3, año = $4  WHERE id_nota = $5 RETURNING *', [id_estudiante, id_asignatura, valor, año, id]);
      if(result.rows.length === 0){
        return res.status(404).json({message: "nota no encontrada"});
      }
      res.status(204).send();
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al actualizar la nota');
  }
});

// Obtener el promedio de un estudiante
router.get('/notas/promedio/promedio/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const result = await pool.query('SELECT ROUND(AVG(valor), 1) FROM nota WHERE id_estudiante = $1', [id]);
      res.json(result.rows);
      console.log(result.rows)
  } catch (err) {
      console.error(err);
      res.status(500).send('Error en el servidor');
  }
});

export default router;