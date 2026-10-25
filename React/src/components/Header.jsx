// Importar React y hooks necesarios //

import "./Header.css"
import { useState, useEffect } from 'react'

// Componente Header //

function Header({ usuario, onLoginClick, onRegistroClick, onCerrarSesion, onVerPerfil, onAbrirPanelAdmin, onAbrirPanelEntrenador, onAbrirPanelDeportista }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [menuDesplegableActivo, setMenuDesplegableActivo] = useState(false)

  const obtenerIniciales = (nombre) => {
    return nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto)
  }

  const toggleMenuDesplegable = (e) => {
    e.stopPropagation()
    setMenuDesplegableActivo(!menuDesplegableActivo)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.contenedor-avatar')) {
        setMenuDesplegableActivo(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

// Renderizado del componente //

  return (
    <header>
      <button id="menu-btn" onClick={toggleMenu}>☰</button>
      <img src="src/Assets/God.png" alt="Escudo del Club Deportivo GoD" className="escudo" />
      
      <nav className={menuAbierto ? 'active' : ''}>
        <a href="#hero">Inicio</a>
        <a href="#nosotros">Nosotros</a>
        <a href="#programas">Programas</a>
        <a href="#contacto">Contacto</a>
      </nav>

      {usuario ? (
        <div className="usuario-conectado">
          <div className="contenedor-avatar">
            <div className="avatar" onClick={toggleMenuDesplegable}>
              <span>{obtenerIniciales(usuario.nombre)}</span>
            </div>
            <div className={`menu-desplegable ${menuDesplegableActivo ? 'active' : ''}`}>
              <div className="encabezado-menu">
                <span>{usuario.nombre}</span>
                <span>{usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}</span>
              </div>
              <button className="elemento-menu" onClick={() => { setMenuDesplegableActivo(false); onVerPerfil() }}>
                Ver Perfil
              </button>
              {usuario.rol === 'administrador' && (
                <button className="elemento-menu" onClick={() => { setMenuDesplegableActivo(false); onAbrirPanelAdmin() }}>
                  Panel de administración
                </button>
              )}
              {usuario.rol === 'entrenador' && (
                <button className="elemento-menu" onClick={() => { setMenuDesplegableActivo(false); onAbrirPanelEntrenador() }}>
                  Panel del entrenador
                </button>
              )}
              {usuario.rol === 'deportista' && (
                <button className="elemento-menu" onClick={() => { setMenuDesplegableActivo(false); onAbrirPanelDeportista() }}>
                  Mis fechas
                </button>
              )}
              <button className="elemento-menu" onClick={() => { setMenuDesplegableActivo(false); onCerrarSesion() }}>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="botones-autenticacion">
          <button className="boton-autenticacion" onClick={onLoginClick}>Iniciar Sesión</button>
          <button className="boton-autenticacion" onClick={onRegistroClick}>Registrarse</button>
        </div>
      )}

    </header>
  )
}

export default Header
