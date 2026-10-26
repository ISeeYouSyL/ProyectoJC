// importar react y hooks necesarios //

import { useState, useEffect } from 'react'

// Componente Hero //

function Hero() {
  const [frase, setFrase] = useState('')

  const frases = [
    "No se trata de las limitaciones, sino de la determinación.",
    "El deporte nos une y nos hace más fuertes.",
    "Cada entrenamiento es un paso hacia una meta.",
    "La inclusión también se juega en equipo.",
    "No hay límites para quien decide avanzar."
  ]

  useEffect(() => {
    const posicionAleatoria = Math.floor(Math.random() * frases.length)
    setFrase(frases[posicionAleatoria])
  }, [])

  // Renderizado del componente //

  return (
    <section id="hero">
      <h1>Club Deportivo GoD</h1>
      <h3>Jugamos • Incluimos • Transformamos</h3>
      <p id="frase-motivadora">{frase}</p>
      <a href="#programas" className="boton">
        Conoce nuestros programas
      </a>
    </section>
  )
}

export default Hero
