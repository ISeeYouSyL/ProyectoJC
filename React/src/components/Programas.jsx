// Importar React y hooks necesarios //

import { useEffect, useState } from 'react'

// Componente de Programas //

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
]

//  Funcion del componente Programas //

function Programas({ actualizacion, onInteres }) {
  const [programas, setProgramas] = useState(programasIniciales)

  useEffect(() => {
    fetch('http://localhost:3000/api/programas')
      .then(respuesta => respuesta.ok ? respuesta.json() : programasIniciales)
      .then(datos => setProgramas(datos))
      .catch(() => setProgramas(programasIniciales))
  }, [actualizacion])

// Renderizado del componente //

  return (
    <section id="programas">
      <h2>Nuestros Programas Deportivos</h2>
      <div className="contenedor-programas">
        {programas.map((programa) => (
          <article key={programa.codigo}>
            <h3>{programa.nombre}</h3>
            <p>{programa.descripcion}</p>
            <button 
              type="button" 
              className="boton boton-interes"
              onClick={() => onInteres(programa.nombre)}
            >
              Me interesa
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Programas
