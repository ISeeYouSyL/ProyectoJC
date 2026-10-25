// Importar React y hooks necesarios //

import { useState } from 'react'

// Componente de Modal para iniciar sesión //

function ModalLogin({ visible, onClose, onLogin }) {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')

  if (!visible) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(correo, contrasena)
  }

// Renderizado del componente //

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content">
        <span className="modal-close" onClick={onClose}>&times;</span>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="correo-sesion">Correo electrónico</label>
          <input 
            type="email" 
            id="correo-sesion" 
            name="correo" 
            required 
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />

          <label htmlFor="contrasena-sesion">Contraseña</label>
          <input 
            type="password" 
            id="contrasena-sesion" 
            name="contrasena" 
            required 
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />

          <input type="submit" value="Iniciar Sesión" />
        </form>
      </div>
    </div>
  )
}

export default ModalLogin
