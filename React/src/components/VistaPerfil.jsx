// Componente de Visualizacion del Perfil //

function VistaPerfil({ visible, usuario, onVolver, onEditarPerfil }) {
  if (!visible || !usuario) return null

// Función para obtener las iniciales del nombre del usuario //

  const obtenerIniciales = (nombre) => {
    return nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

// Renderizado del componente //

  return (
    <div id="vista-perfil" style={{ display: 'block' }}>
      <section id="perfil-completo">
        <h2>Mi Perfil</h2>
        <div className="contenedor-perfil">
          <div className="avatar-perfil">
            <div className="avatar-grande">
              <span>{obtenerIniciales(usuario.nombre)}</span>
            </div>
          </div>
          <div className="info-perfil">
            <h3>{usuario.nombre}</h3>
            <p><strong>Correo:</strong> {usuario.correo}</p>
            <p><strong>Rol:</strong> {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}</p>
            <p><strong>Fecha de registro:</strong> {new Date().toLocaleDateString('es-CO')}</p>
            <p><strong>Contraseña:</strong> ••••••••••</p>
          </div>
        </div>
        <button className="boton" onClick={onEditarPerfil}>Editar Perfil</button>
        <button className="boton" onClick={onVolver}>Volver al Inicio</button>
      </section>
    </div>
  )
}

export default VistaPerfil
