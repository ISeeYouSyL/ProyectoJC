// Variables de conexion // 

const mongoose = require("mongoose");
require("dotenv").config();


// Conexión a MongoDB //

const MONGODB_URI = process.env.MONGODB_URI 


// Esquema de Programas Deportivos //

const programaSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true, lowercase: true, trim: true },
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true }
}, { timestamps: true });

const Programa = mongoose.model("Programa", programaSchema);


// Esquema de Mensajes de Contacto //

const mensajeSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  correo: { type: String, required: true, trim: true },
  mensaje: { type: String, required: true, trim: true },
  programa: { type: String, default: "Consulta General" },
  fecha: { type: Date, default: Date.now }
});

const Mensaje = mongoose.model("Mensaje", mensajeSchema);


// Esquema de Usuarios //

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  correo: { type: String, required: true, unique: true, trim: true },
  contrasena: { type: String, required: true },
  rol: { type: String, required: true, enum: ["administrador", "entrenador", "deportista"], default: "deportista" },
  fechaRegistro: { type: Date, default: Date.now }
});

const Usuario = mongoose.model("Usuario", usuarioSchema);


// Datos por defecto para sembrar la base de datos la primera vez //

const programasIniciales = [
  {
    codigo: "futbol",
    nombre: "Fútbol 5 Visual",
    descripcion: "Disciplina dirigida a personas con discapacidad visual, promoviendo la integración y el trabajo en equipo."
  },
  {
    codigo: "baloncesto",
    nombre: "Baloncesto en Silla de Ruedas",
    descripcion: "Programa orientado al desarrollo técnico, físico y competitivo para deportistas usuarios de sillas de ruedas."
  },
  {
    codigo: "paraatletismo",
    nombre: "Paraatletismo",
    descripcion: "Entrenamientos en pruebas de pista y campo adaptadas para diferentes tipos de discapacidad."
  },
  {
    codigo: "paranatacion",
    nombre: "Paranatación",
    descripcion: "Formación y entrenamiento en natación adaptada, fomentando el desarrollo de habilidades acuáticas."
  },
  {
    codigo: "boccia",
    nombre: "Boccia",
    descripcion: "Deporte de precisión y estrategia, diseñado para personas con discapacidad física severa."
  }
];


// Función para inicializar datos por defecto //

async function inicializarProgramas() {
  try {
    const conteo = await Programa.countDocuments();
    if (conteo === 0) {
      await Programa.insertMany(programasIniciales);
      console.log("Programas deportivos cargados correctamente en la base de datos.");
    }
  } catch (error) {
    console.error("Error al inicializar programas:", error.message);
  }
}


// Función para conectar a MongoDB //

async function conectarDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Conexión establecida con la base de datos.");
    await inicializarProgramas();
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error.message);
  }
}

// Exportar funciones y modelos //


module.exports = {
  conectarDB,
  Programa,
  Mensaje,
  Usuario,
  programasIniciales
};