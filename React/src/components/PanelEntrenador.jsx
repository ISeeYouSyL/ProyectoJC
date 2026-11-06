// Importar React y hooks necesarios //

import { useEffect, useState } from 'react'

// Definir URL del backend para conectarlo en gitpages //

const API_URL = import.meta.env.VITE_API_URL || "https://proyectojc.onrender.com"


// Componente de Panel del Entrenador //

function PanelEntrenador({ token, onCerrar, mostrarNotificacion }) {
  const [deportistas, setDeportistas] = useState([])
  const [eventos, setEventos] = useState([])
  const [titulo, setTitulo] = useState('')
  const [tipo, setTipo] = useState('entrenamiento')
  const [fecha, setFecha] = useState('')
  const [lugar, setLugar] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const encabezados = { Authorization: `Bearer ${token}` }

  const nombreTipo = (valor) => valor === 'competencia' ? 'Competencia' : 'Entrenamiento'

  const cargarDatos = async () => {
    try {
      const [respuestaDeportistas, respuestaEventos] = await Promise.all([
        fetch(`${API_URL}/api/deportistas`, { headers: encabezados }),
        fetch(`${API_URL}/api/eventos`, { headers: encabezados })
      ])
      setDeportistas(await respuestaDeportistas.json())
      setEventos(await respuestaEventos.json())
    } catch {
      mostrarNotificacion('No fue posible cargar tu información.', 'error')
    }
  }

  useEffect(() => { cargarDatos() }, [])

  const crearEvento = async (e) => {
    e.preventDefault()
    const respuesta = await fetch(`${API_URL}/api/eventos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...encabezados },
      body: JSON.stringify({ titulo, tipo, fecha, lugar, descripcion })
    })
    const datos = await respuesta.json()
    if (!respuesta.ok) return mostrarNotificacion(datos.mensaje, 'error')

    setTitulo(''); setTipo('entrenamiento'); setFecha(''); setLugar(''); setDescripcion('')
    cargarDatos()
    mostrarNotificacion(datos.mensaje, 'exito')
  }

  const eliminarEvento = async (id) => {
    const respuesta = await fetch(`${API_URL}/api/eventos/${id}`, { method: 'DELETE', headers: encabezados })
    const datos = await respuesta.json()
    if (!respuesta.ok) return mostrarNotificacion(datos.mensaje, 'error')
    cargarDatos()
    mostrarNotificacion(datos.mensaje, 'exito')
  }

  return (
    <main className="panel-rol">
      <div className="encabezado-admin"><h2>Panel del entrenador</h2><button className="boton" onClick={onCerrar}>Volver</button></div>
      <section className="admin-seccion">
        <h3>Mi grupo de deportistas</h3>
        {deportistas.length ? <ul className="lista-nombres">{deportistas.map(deportista => <li key={deportista._id}>{deportista.nombre} — {deportista.correo}</li>)}</ul> : <p>Aún no tienes deportistas asignados. El administrador debe asignarlos a tu grupo.</p>}
      </section>
      <section className="admin-seccion">
        <h3>Crear entrenamiento o competencia</h3>
        <form onSubmit={crearEvento}>
          <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Nombre del evento" required />
          <select value={tipo} onChange={e => setTipo(e.target.value)} required>
            <option value="entrenamiento">Entrenamiento</option>
            <option value="competencia">Competencia</option>
          </select>
          <input type="datetime-local" value={fecha} onChange={e => setFecha(e.target.value)} required />
          <input value={lugar} onChange={e => setLugar(e.target.value)} placeholder="Lugar" required />
          <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Información adicional" />
          <button className="boton" type="submit">Publicar fecha</button>
        </form>
      </section>
      <section className="admin-seccion">
        <h3>Próximas fechas</h3>
        {eventos.map(evento => (
          <div className="fila-admin" key={evento._id}>
            <span>
              <strong>{evento.titulo}</strong> — {nombreTipo(evento.tipo)}
              <br />
              {new Date(evento.fecha).toLocaleString('es-CO')} · {evento.lugar}
              {evento.descripcion ? <><br />{evento.descripcion}</> : null}
            </span>
            <button className="boton-eliminar" onClick={() => eliminarEvento(evento._id)}>Eliminar</button>
          </div>
        ))}
        {!eventos.length && <p>No tienes eventos creados.</p>}
      </section>
    </main>
  )
}

export default PanelEntrenador
