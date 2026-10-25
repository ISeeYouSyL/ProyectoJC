// Importar React y hooks necesarios //

import { useState } from 'react'

// Componente de Modal para registrarse //

function ModalRegistro({ visible, onClose, onRegistro }) {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [rol, setRol] = useState('deportista')

  if (!visible) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onRegistro(nombre, correo, contrasena, rol)
  }

// Renderizado del componente //

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content">
        <span className="modal-close" onClick={onClose}>&times;</span>
        <h2>Registrarse</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="nombre-registro">Nombre</label>
          <input 
            type="text" 
            id="nombre-registro" 
            name="nombre" 
            required 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <label htmlFor="correo-registro">Correo electrónico</label>
          <input 
            type="email" 
            id="correo-registro" 
            name="correo" 
            required 
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />

          <label htmlFor="contrasena-registro">Contraseña</label>
          <input 
            type="password" 
            id="contrasena-registro" 
            name="contrasena" 
            required 
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />

          <label htmlFor="rol-registro">Rol</label>
          <select 
            id="rol-registro" 
            name="rol"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          >
            <option value="deportista">Deportista</option>
            <option value="entrenador">Entrenador</option>
          </select>

          <input type="submit" value="Registrarse" />
        </form>
      </div>
    </div>
  )
}

export default ModalRegistro
