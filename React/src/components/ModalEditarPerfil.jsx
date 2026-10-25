// Importar React y hooks necesarios //

import { useState } from 'react'

// Componente de Modal para editar perfil  //

function ModalEditarPerfil({ visible, onClose, onActualizar, usuario }) {
  const [nombre, setNombre] = useState(usuario?.nombre || '')
  const [contrasenaActual, setContrasenaActual] = useState('')
  const [contrasenaNueva, setContrasenaNueva] = useState('')

  if (!visible) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onActualizar(nombre, contrasenaActual, contrasenaNueva)
  }

// Renderizado del componente //

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content">
        <span className="modal-close" onClick={onClose}>&times;</span>
        <h2>Editar Perfil</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="nombre-editar">Nombre</label>
          <input 
            type="text" 
            id="nombre-editar" 
            name="nombre" 
            required 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <label htmlFor="contrasena-actual-editar">Contraseña actual</label>
          <input 
            type="password" 
            id="contrasena-actual-editar" 
            name="contrasena_actual" 
            required 
            value={contrasenaActual}
            onChange={(e) => setContrasenaActual(e.target.value)}
          />

          <label htmlFor="contrasena-nueva-editar">Nueva contraseña (dejar vacío para no cambiar)</label>
          <input 
            type="password" 
            id="contrasena-nueva-editar" 
            name="contrasena_nueva"
            value={contrasenaNueva}
            onChange={(e) => setContrasenaNueva(e.target.value)}
          />

          <input type="submit" value="Guardar Cambios" />
        </form>
      </div>
    </div>
  )
}

export default ModalEditarPerfil
