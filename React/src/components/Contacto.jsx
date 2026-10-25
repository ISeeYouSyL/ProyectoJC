// Importar React y los hooks necesarios //

import { useEffect, useState } from 'react'

// Componente Contacto //

function Contacto({ mostrarNotificacion, mensajePrefijado }) {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    if (mensajePrefijado) setMensaje(mensajePrefijado)
  }, [mensajePrefijado])

  const enviarMensaje = async (e) => {
    e.preventDefault()

    try {
      const respuesta = await fetch('http://localhost:3000/api/mensajes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, mensaje })
      })
      const datos = await respuesta.json()

      if (!respuesta.ok) return mostrarNotificacion(datos.mensaje, 'error')

      setNombre('')
      setCorreo('')
      setMensaje('')
      mostrarNotificacion(datos.mensaje, 'exito')
    } catch {
      mostrarNotificacion('Error al enviar el mensaje.', 'error')
    }
  }

// Renderizado del componente //

  return (
    <section id="contacto">
      <h2>Contáctanos</h2>
      <p><strong>Dirección:</strong> Cl. 9 #34-01, Cali, Valle del Cauca.</p>
      <p><strong>Teléfono:</strong> +57 311 795 5573</p>
      <p><strong>Correo:</strong> clubgodgiron@gmail.com</p>

      <form onSubmit={enviarMensaje}>
        <h3>Envíanos un mensaje</h3>
        <label htmlFor="nombre">Nombre</label>
        <input type="text" id="nombre" name="nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />

        <label htmlFor="correo">Correo electrónico</label>
        <input type="email" id="correo" name="correo" value={correo} onChange={e => setCorreo(e.target.value)} required />

        <label htmlFor="mensaje">Mensaje</label>
        <textarea id="mensaje" name="mensaje" rows="5" value={mensaje} onChange={e => setMensaje(e.target.value)} required></textarea>

        <input type="submit" value="Enviar" />
      </form>
    </section>
  )
}

export default Contacto
