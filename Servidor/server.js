// Variables para conexion // 

const express = require("express");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require ("cors")



// Importar la conexión y modelos //

const { conectarDB, Programa, Mensaje, Usuario, Evento, programasIniciales } = require("./basedatos");


// Inicializamos Express //

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");


// Middlewares //

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Funciones de autenticación y autorización //

function autenticar(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensaje: "Debes iniciar sesión para realizar esta acción." });
  }

  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ mensaje: "Tu sesión no es válida. Inicia sesión nuevamente." });
  }
}

// Middleware para verificar si el usuario es administrador //

function soloAdministrador(req, res, next) {
  if (req.usuario.rol !== "administrador") {
    return res.status(403).json({ mensaje: "Esta acción es exclusiva para administradores." });
  }

  next();
}


// Servir los archivos estáticos del Frontend //

app.use(express.static(__dirname));


// Conectar base de datos //

conectarDB();


// Rutas de la API //

// GET: Obtener todos los programas

app.get("/api/programas", async (req, res) => {
  try {
    const programas = await Programa.find();
    res.status(200).json(programas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener programas.", error: error.message });
  }
});


// Obtener programa específico por parámetro URL (ej: /api/programas/futbol) //

app.get("/api/programas/:codigo", async (req, res) => {
  try {
    const { codigo } = req.params;
    let programa = await Programa.findOne({ codigo: codigo.toLowerCase() });

    // Respaldo local si la base de datos no tiene datos aún //

    if (!programa) {
      programa = programasIniciales.find(p => p.codigo === codigo.toLowerCase());
    }

    if (!programa) {
      return res.status(404).json({ mensaje: "El programa deportivo no fue encontrado." });
    }

    res.status(200).json(programa);
  } catch (error) {
    res.status(500).json({ mensaje: "Error interno del servidor.", error: error.message });
  }
});


// Crear nuevo programa //

app.post("/api/programas", autenticar, soloAdministrador, async (req, res) => {
  try {
    const { codigo, nombre, descripcion } = req.body;

    if (!codigo || !nombre || !descripcion) {
      return res.status(400).json({ mensaje: "Todos los campos son requeridos." });
    }

    const nuevoPrograma = new Programa({ codigo, nombre, descripcion });
    const programaGuardado = await nuevoPrograma.save();

    res.status(201).json({ mensaje: "Programa creado exitosamente", programa: programaGuardado });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al guardar el programa.", error: error.message });
  }
});


// Actualizar un programa existente //

app.put("/api/programas/:id", autenticar, soloAdministrador, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const programaActualizado = await Programa.findByIdAndUpdate(
      id,
      { nombre, descripcion },
      { new: true }
    );

    if (!programaActualizado) {
      return res.status(404).json({ mensaje: "Programa no encontrado." });
    }

    res.status(200).json({ mensaje: "Programa actualizado con éxito.", programa: programaActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar.", error: error.message });
  }
});


// Eliminar un programa //

app.delete("/api/programas/:id", autenticar, soloAdministrador, async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Programa.findByIdAndDelete(id);

    if (!eliminado) {
      return res.status(404).json({ mensaje: "Programa no encontrado." });
    }

    res.status(200).json({ mensaje: "Programa eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el programa.", error: error.message });
  }
});


// Recibir mensaje del formulario //

app.post("/api/mensajes", async (req, res) => {
  try {
    const { nombre, correo, mensaje, programa } = req.body;

    if (!nombre || nombre.length < 3) {
      return res.status(400).json({ mensaje: "El nombre debe tener al menos 3 caracteres." });
    }

    if (!correo || !correo.includes("@")) {
      return res.status(400).json({ mensaje: "Ingresa un correo electrónico válido." });
    }

    if (!mensaje || mensaje.length < 10) {
      return res.status(400).json({ mensaje: "El mensaje debe tener al menos 10 caracteres." });
    }

    const nuevoMensaje = new Mensaje({
      nombre,
      correo,
      mensaje,
      programa: programa || "Consulta General"
    });

    const mensajeGuardado = await nuevoMensaje.save();

    res.status(201).json({
      exito: true,
      mensaje: "¡Mensaje recibido con éxito! Nos comunicaremos contigo pronto.",
      datos: mensajeGuardado
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al procesar el mensaje.", error: error.message });
  }
});


// Ver todos los mensajes (panel de administración) //

app.get("/api/mensajes", autenticar, soloAdministrador, async (req, res) => {
  try {
    const mensajes = await Mensaje.find().sort({ fecha: -1 });
    res.status(200).json(mensajes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los mensajes.", error: error.message });
  }
});


// Consultar usuarios para asignar deportistas (solo administrador) //

app.get("/api/usuarios", autenticar, soloAdministrador, async (req, res) => {
  try {
    const usuarios = await Usuario.find()
      .select("nombre correo rol entrenador")
      .populate("entrenador", "nombre")
      .sort({ nombre: 1 });
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuarios.", error: error.message });
  }
});


// Asignar un deportista a un entrenador (solo administrador) //

app.put("/api/usuarios/:id/entrenador", autenticar, soloAdministrador, async (req, res) => {
  try {
    const { entrenadorId } = req.body;
    const entrenador = await Usuario.findOne({ _id: entrenadorId, rol: "entrenador" });

    if (!entrenador) {
      return res.status(400).json({ mensaje: "Selecciona un entrenador válido." });
    }

    const deportista = await Usuario.findOneAndUpdate(
      { _id: req.params.id, rol: "deportista" },
      { entrenador: entrenadorId },
      { new: true }
    );

    if (!deportista) {
      return res.status(404).json({ mensaje: "Deportista no encontrado." });
    }

    res.status(200).json({ mensaje: "Deportista asignado correctamente." });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al asignar deportista.", error: error.message });
  }
});


// Deportistas asignados al entrenador que inició sesión //

app.get("/api/deportistas", autenticar, async (req, res) => {
  try {
    if (req.usuario.rol !== "entrenador") {
      return res.status(403).json({ mensaje: "Esta información es exclusiva para entrenadores." });
    }

    const deportistas = await Usuario.find({ rol: "deportista", entrenador: req.usuario.id })
      .select("nombre correo")
      .sort({ nombre: 1 });
    res.status(200).json(deportistas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener deportistas.", error: error.message });
  }
});


// Consultar eventos según el rol //

app.get("/api/eventos", autenticar, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    let filtro = {};

    if (req.usuario.rol === "entrenador") filtro = { entrenador: usuario._id };
    if (req.usuario.rol === "deportista") {
      if (!usuario.entrenador) {
        return res.status(200).json([]);
      }
      filtro = { entrenador: usuario.entrenador };
    }

    const eventos = await Evento.find(filtro)
      .populate("entrenador", "nombre")
      .sort({ fecha: 1 });
    res.status(200).json(eventos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener eventos.", error: error.message });
  }
});


// Crear evento (entrenador o administrador) //

app.post("/api/eventos", autenticar, async (req, res) => {
  try {
    if (!["entrenador", "administrador"].includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: "No tienes permiso para crear eventos." });
    }

    const { titulo, fecha, lugar, descripcion, tipo } = req.body;
    if (!titulo || !fecha || !lugar) {
      return res.status(400).json({ mensaje: "Título, fecha y lugar son requeridos." });
    }

    const evento = await Evento.create({
      titulo,
      fecha,
      lugar,
      descripcion,
      tipo: tipo === "competencia" ? "competencia" : "entrenamiento",
      entrenador: req.usuario.id
    });

    res.status(201).json({ mensaje: "Evento creado correctamente.", evento });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear evento.", error: error.message });
  }
});


// Eliminar evento propio o cualquier evento si es administrador //

app.delete("/api/eventos/:id", autenticar, async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) return res.status(404).json({ mensaje: "Evento no encontrado." });

    const esSuEvento = evento.entrenador.toString() === req.usuario.id;
    if (req.usuario.rol !== "administrador" && !esSuEvento) {
      return res.status(403).json({ mensaje: "No tienes permiso para eliminar este evento." });
    }

    await evento.deleteOne();
    res.status(200).json({ mensaje: "Evento eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar evento.", error: error.message });
  }
});


// Rutas de Autenticación //
// Registrar nuevo usuario //

app.post("/api/usuarios/registro", async (req, res) => {
  try {
    const { nombre, correo, contrasena, rol } = req.body;

    if (!nombre || nombre.length < 3) {
      return res.status(400).json({ mensaje: "El nombre debe tener al menos 3 caracteres." });
    }

    if (!correo || !correo.includes("@")) {
      return res.status(400).json({ mensaje: "Ingresa un correo electrónico válido." });
    }

    if (!contrasena || contrasena.length < 6) {
      return res.status(400).json({ mensaje: "La contraseña debe tener al menos 6 caracteres." });
    }

    const usuarioExistente = await Usuario.findOne({ correo: correo.toLowerCase() });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "Este correo ya está registrado." });
    }

    const nuevoUsuario = new Usuario({
      nombre,
      correo: correo.toLowerCase(),
      contrasena,
      rol: rol === "entrenador" ? "entrenador" : "deportista"
    });

    const usuarioGuardado = await nuevoUsuario.save();

    res.status(201).json({
      exito: true,
      mensaje: "¡Registro exitoso! Ahora puedes iniciar sesión.",
      usuario: {
        nombre: usuarioGuardado.nombre,
        correo: usuarioGuardado.correo,
        rol: usuarioGuardado.rol
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar usuario.", error: error.message });
  }
});


// Iniciar sesión //

app.post("/api/usuarios/login", async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ mensaje: "Correo y contraseña son requeridos." });
    }

    const usuario = await Usuario.findOne({ correo: correo.toLowerCase() });

    if (!usuario) {
      return res.status(401).json({ mensaje: "Este correo no está registrado en el sistema." });
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: "La contraseña es incorrecta." });
    }

    const token = jwt.sign(
      { id: usuario._id, correo: usuario.correo, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      exito: true,
      mensaje: "Sesión iniciada correctamente.",
      token,
      usuario: {
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al iniciar sesión.", error: error.message });
  }
});


// Actualizar perfil de usuario //

app.put("/api/usuarios/perfil", autenticar, async (req, res) => {
  try {
    const { nombre, contrasena_actual, contrasena_nueva } = req.body;

    if (!nombre || !contrasena_actual) {
      return res.status(400).json({ mensaje: "Todos los campos son requeridos." });
    }

    const usuario = await Usuario.findOne({ correo: req.usuario.correo });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    const contrasenaValida = await bcrypt.compare(contrasena_actual, usuario.contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: "La contraseña actual es incorrecta." });
    }

    usuario.nombre = nombre;

    if (contrasena_nueva && contrasena_nueva.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      usuario.contrasena = await bcrypt.hash(contrasena_nueva, salt);
    }

    const usuarioActualizado = await usuario.save();

    res.status(200).json({
      exito: true,
      mensaje: "¡Perfil actualizado correctamente!",
      usuario: {
        nombre: usuarioActualizado.nombre,
        correo: usuarioActualizado.correo,
        rol: usuarioActualizado.rol
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar perfil.", error: error.message });
  }
});


// Ruta principal para servir el HTML //

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


// Manejo de rutas inexistentes //

app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada." });
});


// Iniciar servidor // 

app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en puerto ${PORT}`);
});
