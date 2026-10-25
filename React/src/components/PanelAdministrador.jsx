// Importar React y hooks necesarios //

import { useEffect, useState } from 'react'

// Componente de Panel del Administrador //

function PanelAdministrador({ token, onCerrar, onCambios, mostrarNotificacion }) {
  const [mensajes, setMensajes] = useState([])
  const [programas, setProgramas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [nombre, setNombre] = useState('')
  const [codigo, setCodigo] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const encabezados = { Authorization: `Bearer ${token}` }

// Función para cargar datos del panel //

  const cargarDatos = async () => {
    try {
      const [respuestaMensajes, respuestaProgramas, respuestaUsuarios] = await Promise.all([
        fetch('http://localhost:3000/api/mensajes', { headers: encabezados }),
        fetch('http://localhost:3000/api/programas'),
        fetch('http://localhost:3000/api/usuarios', { headers: encabezados })
      ])

      if (!respuestaMensajes.ok || !respuestaUsuarios.ok) throw new Error()
      setMensajes(await respuestaMensajes.json())
      setProgramas(await respuestaProgramas.json())
      setUsuarios(await respuestaUsuarios.json())
    } catch {
      mostrarNotificacion('No fue posible cargar el panel de administración.', 'error')
    }
  }

  useEffect(() => { cargarDatos() }, [])

// Funciones para manejar la creación de programas //

  const crearPrograma = async (e) => {
    e.preventDefault()
    const respuesta = await fetch('http://localhost:3000/api/programas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...encabezados },
      body: JSON.stringify({ codigo, nombre, descripcion })
    })
    const datos = await respuesta.json()

    if (!respuesta.ok) return mostrarNotificacion(datos.mensaje, 'error')

    setNombre('')
    setCodigo('')
    setDescripcion('')
    cargarDatos()
    onCambios()
    mostrarNotificacion('Programa creado correctamente.', 'exito')
  }

// Función para asignar deportistas a entrenadores //

  const asignarDeportista = async (deportistaId, entrenadorId) => {
    if (!entrenadorId) return mostrarNotificacion('Selecciona un entrenador válido.', 'error')

    const respuesta = await fetch(`http://localhost:3000/api/usuarios/${deportistaId}/entrenador`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...encabezados },
      body: JSON.stringify({ entrenadorId })
    })
    const datos = await respuesta.json()

    if (!respuesta.ok) return mostrarNotificacion(datos.mensaje, 'error')

    cargarDatos()
    mostrarNotificacion(datos.mensaje, 'exito')
  }

// Función para eliminar programas //

  const eliminarPrograma = async (id) => {
    const respuesta = await fetch(`http://localhost:3000/api/programas/${id}`, {
      method: 'DELETE',
      headers: encabezados
    })
    const datos = await respuesta.json()

    if (!respuesta.ok) return mostrarNotificacion(datos.mensaje, 'error')

    cargarDatos()
    onCambios()
    mostrarNotificacion('Programa eliminado.', 'exito')
  }

// Renderizado del componente //

  return (
    <main id="panel-administrador">
      <div className="encabezado-admin">
        <h2>Panel de administración</h2>
        <button className="boton" onClick={onCerrar}>Volver a la página</button>
      </div>

      <section className="admin-seccion">
        <h3>Agregar programa deportivo</h3>
        <form onSubmit={crearPrograma}>
          <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre del programa" required />
          <input value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Código: ejemplo-futbol" required />
          <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción" required />
          <button className="boton" type="submit">Guardar programa</button>
        </form>
      </section>

      <section className="admin-seccion">
        <h3>Programas publicados</h3>
        <div className="lista-admin">
          {programas.map(programa => (
            <div key={programa._id} className="fila-admin">
              <span>{programa.nombre}</span>
              <button className="boton-eliminar" onClick={() => eliminarPrograma(programa._id)}>Eliminar</button>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-seccion">
        <h3>Asignar deportistas a un entrenador</h3>
        <div className="lista-admin">
          {usuarios.filter(usuario => usuario.rol === 'deportista').length === 0 ? (
            <p>Aún no hay deportistas registrados.</p>
          ) : usuarios.filter(usuario => usuario.rol === 'deportista').map(deportista => (
            <div key={deportista._id} className="fila-admin">
              <span>
                {deportista.nombre} — {deportista.correo}
                <br />
                Grupo: {deportista.entrenador?.nombre || 'Sin asignar'}
              </span>
              <select
                key={`${deportista._id}-${deportista.entrenador?._id || 'none'}`}
                defaultValue={deportista.entrenador?._id || ''}
                onChange={e => asignarDeportista(deportista._id, e.target.value)}
              >
                <option value="">Seleccionar entrenador</option>
                {usuarios.filter(usuario => usuario.rol === 'entrenador').map(entrenador => (
                  <option key={entrenador._id} value={entrenador._id}>{entrenador.nombre}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-seccion">
        <h3>Mensajes recibidos</h3>
        <div className="lista-admin">
          {mensajes.length === 0 ? <p>Aún no hay mensajes.</p> : mensajes.map(mensaje => (
            <article key={mensaje._id} className="mensaje-admin">
              <strong>{mensaje.nombre}</strong> — {mensaje.correo}
              <p>{mensaje.mensaje}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default PanelAdministrador
