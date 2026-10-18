// Variables para conexion // 

const express = require("express");
const path = require("path");


// Importar la conexión y modelos //

const { conectarDB, Programa, Mensaje, Usuario, programasIniciales } = require("./basedatos");


// Inicializamos Express //

const app = express();
const PORT = process.env.PORT || 3000;


// Middlewares //

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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

app.post("/api/programas", async (req, res) => {
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

app.put("/api/programas/:id", async (req, res) => {
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

app.delete("/api/programas/:id", async (req, res) => {
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

app.get("/api/mensajes", async (req, res) => {
  try {
    const mensajes = await Mensaje.find().sort({ fecha: -1 });
    res.status(200).json(mensajes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los mensajes.", error: error.message });
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
      rol: rol || "deportista"
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

    if (usuario.contrasena !== contrasena) {
      return res.status(401).json({ mensaje: "La contraseña es incorrecta." });
    }

    res.status(200).json({
      exito: true,
      mensaje: "Sesión iniciada correctamente.",
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

app.put("/api/usuarios/perfil", async (req, res) => {
  try {
    const { correo, nombre, contrasena_actual, contrasena_nueva } = req.body;

    if (!correo || !nombre || !contrasena_actual) {
      return res.status(400).json({ mensaje: "Todos los campos son requeridos." });
    }

    const usuario = await Usuario.findOne({ correo: correo.toLowerCase() });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    if (usuario.contrasena !== contrasena_actual) {
      return res.status(401).json({ mensaje: "La contraseña actual es incorrecta." });
    }

    usuario.nombre = nombre;

    if (contrasena_nueva && contrasena_nueva.length >= 6) {
      usuario.contrasena = contrasena_nueva;
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