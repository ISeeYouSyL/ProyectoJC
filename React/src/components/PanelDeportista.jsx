// Importar React y hooks necesarios //

import { useEffect, useState } from 'react'

// Componente de Panel del Deportista //

function PanelDeportista({ token, onCerrar, mostrarNotificacion }) {
  const [eventos, setEventos] = useState([])

  const nombreTipo = (valor) => valor === 'competencia' ? 'Competencia' : 'Entrenamiento'

  useEffect(() => {
    fetch('http://localhost:3000/api/eventos', { headers: { Authorization: `Bearer ${token}` } })
      .then(respuesta => respuesta.ok ? respuesta.json() : Promise.reject())
      .then(setEventos)
      .catch(() => mostrarNotificacion('No fue posible cargar tus fechas.', 'error'))
  }, [])

// Renderizado del componente //

  return (
    <main className="panel-rol">
      <div className="encabezado-admin"><h2>Mis próximas fechas</h2><button className="boton" onClick={onCerrar}>Volver</button></div>
      <section className="admin-seccion">
        <p>Aquí ves los entrenamientos y competencias que publica tu entrenador.</p>
        {eventos.length ? eventos.map(evento => (
          <article className="evento-deportista" key={evento._id}>
            <h3>{evento.titulo}</h3>
            <p><strong>Tipo:</strong> {nombreTipo(evento.tipo)}</p>
            <p><strong>Fecha:</strong> {new Date(evento.fecha).toLocaleString('es-CO')}</p>
            <p><strong>Lugar:</strong> {evento.lugar}</p>
            {evento.entrenador?.nombre && <p><strong>Entrenador:</strong> {evento.entrenador.nombre}</p>}
            {evento.descripcion && <p>{evento.descripcion}</p>}
          </article>
        )) : <p>Tu entrenador aún no ha publicado fechas para ti.</p>}
      </section>
    </main>
  )
}

export default PanelDeportista
