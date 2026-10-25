// Importaciones de React y componentes necesarios // 

import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import InfoClub from './components/InfoClub'
import Programas from './components/Programas'
import Contacto from './components/Contacto'
import Footer from './components/Footer'
import ModalLogin from './components/ModalLogin'
import ModalRegistro from './components/ModalRegistro'
import ModalEditarPerfil from './components/ModalEditarPerfil'
import VistaPerfil from './components/VistaPerfil'
import NotificacionGlobal from './components/NotificacionGlobal'
import PanelAdministrador from './components/PanelAdministrador'
import PanelEntrenador from './components/PanelEntrenador'
import PanelDeportista from './components/PanelDeportista'

// Componente principal de la aplicación //

function App() {
  const [usuario, setUsuario] = useState(null)
  const [modalLoginVisible, setModalLoginVisible] = useState(false)
  const [modalRegistroVisible, setModalRegistroVisible] = useState(false)
  const [modalEditarPerfilVisible, setModalEditarPerfilVisible] = useState(false)
  const [vistaPerfilVisible, setVistaPerfilVisible] = useState(false)
  const [panelAdminVisible, setPanelAdminVisible] = useState(false)
  const [panelEntrenadorVisible, setPanelEntrenadorVisible] = useState(false)
  const [panelDeportistaVisible, setPanelDeportistaVisible] = useState(false)
  const [actualizacionProgramas, setActualizacionProgramas] = useState(0)
  const [notificacion, setNotificacion] = useState({ mensaje: '', tipo: '', visible: false })
  const [modoOscuro, setModoOscuro] = useState(false)
  const [tamanoTexto, setTamanoTexto] = useState(100)
  const [fuenteDislexia, setFuenteDislexia] = useState(false)
  const [altoContraste, setAltoContraste] = useState(false)
  const [lecturaActiva, setLecturaActiva] = useState(false)
  const [mensajeContacto, setMensajeContacto] = useState('')

  // Cargar usuario del localStorage al iniciar //

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario')
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado))
    }

  }, [])


  // Botones de accesibilidad //

  useEffect(() => {
    document.documentElement.style.fontSize = tamanoTexto + '%'
    document.body.classList.toggle('modo-oscuro', modoOscuro)
    document.body.classList.toggle('fuente-dislexia', fuenteDislexia)
    document.body.classList.toggle('alto-contraste', altoContraste)

  }, [modoOscuro, tamanoTexto, fuenteDislexia, altoContraste])

  const cambiarTamanoTexto = (cambio) => {
    setTamanoTexto(valorActual => Math.min(Math.max(valorActual + cambio, 90), 120))
  }

  const cambiarModoEscuchar = () => {
    if (!('speechSynthesis' in window)) {
      mostrarNotificacion('Tu navegador no permite la lectura en voz alta', 'error')
      return
    }

    if (lecturaActiva) {
      window.speechSynthesis.cancel()
      setLecturaActiva(false)
      return
    }

    const contenido = document.querySelector('main')?.innerText
    if (!contenido) return

    const lectura = new SpeechSynthesisUtterance(contenido)
    lectura.lang = 'es-CO'
    lectura.rate = 0.9
    lectura.onend = () => setLecturaActiva(false)
    lectura.onerror = () => setLecturaActiva(false)

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(lectura)
    setLecturaActiva(true)
  }


// Función para mostrar notificaciones //

  const mostrarNotificacion = (mensaje, tipo) => {
    setNotificacion({ mensaje, tipo, visible: true })
    setTimeout(() => {
      setNotificacion({ mensaje: '', tipo: '', visible: false })
    }, 3000)
  }


// Funciones de manejo de autenticación y perfil //

  const handleLogin = async (correo, contrasena) => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena })
      })
      const datos = await respuesta.json()
      
      if (respuesta.ok) {
        setUsuario(datos.usuario)
        localStorage.setItem('usuario', JSON.stringify(datos.usuario))
        localStorage.setItem('token', datos.token)
        setModalLoginVisible(false)
        mostrarNotificacion(datos.mensaje, 'exito')
      } else {
        mostrarNotificacion(datos.mensaje, 'error')
      }
    } catch (error) {
      mostrarNotificacion('Error al conectar con el servidor', 'error')
    }
  }


// Función para manejar el registro de un nuevo usuario //

  const handleRegistro = async (nombre, correo, contrasena, rol) => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/usuarios/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, contrasena, rol })
      })
      const datos = await respuesta.json()
      
      if (respuesta.ok) {
        setModalRegistroVisible(false)
        mostrarNotificacion(datos.mensaje, 'exito')
      } else {
        mostrarNotificacion(datos.mensaje, 'error')
      }
    } catch (error) {
      mostrarNotificacion('Error al conectar con el servidor', 'error')
    }
  }

// Función para cerrar sesión //

  const handleCerrarSesion = () => {
    setUsuario(null)
    setPanelAdminVisible(false)
    setPanelEntrenadorVisible(false)
    setPanelDeportistaVisible(false)
    localStorage.removeItem('usuario')
    localStorage.removeItem('token')
    mostrarNotificacion('Sesión cerrada correctamente', 'exito')
  }

// Funciones para manejar la vista de perfil y edición //

  const handleVerPerfil = () => {
    setVistaPerfilVisible(true)
  }

  const handleVolver = () => {
    setVistaPerfilVisible(false)
  }

  const handleEditarPerfil = () => {
    setModalEditarPerfilVisible(true)
  }


// Función para mandar mensaje de interes en formulario //

  const handleInteresPrograma = (nombrePrograma) => {
    setMensajeContacto(`Estoy interesado/a en el programa de ${nombrePrograma}.`)
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
  }


// Función para actualizar perfil del usuario //

  const handleActualizarPerfil = async (nombre, contrasenaActual, contrasenaNueva) => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/usuarios/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          nombre,
          contrasena_actual: contrasenaActual,
          contrasena_nueva: contrasenaNueva
        })
      })
      const datos = await respuesta.json()
      
      if (respuesta.ok) {
        setUsuario(datos.usuario)
        localStorage.setItem('usuario', JSON.stringify(datos.usuario))
        setModalEditarPerfilVisible(false)
        mostrarNotificacion(datos.mensaje, 'exito')
      } else {
        mostrarNotificacion(datos.mensaje, 'error')
      }
    } catch (error) {
      mostrarNotificacion('Error al conectar con el servidor', 'error')
    }
  }

// Renderizado del componente principal //

  return (
    <>
      <Header 
        usuario={usuario}
        onLoginClick={() => setModalLoginVisible(true)}
        onRegistroClick={() => setModalRegistroVisible(true)}
        onCerrarSesion={handleCerrarSesion}
        onVerPerfil={handleVerPerfil}
        onAbrirPanelAdmin={() => setPanelAdminVisible(true)}
        onAbrirPanelEntrenador={() => setPanelEntrenadorVisible(true)}
        onAbrirPanelDeportista={() => setPanelDeportistaVisible(true)}
      />
      <div className="controles-texto" aria-label="Controles de accesibilidad">
        <button type="button" onClick={() => cambiarTamanoTexto(-10)} aria-label="Disminuir tamaño de texto">A-</button>
        <button type="button" onClick={() => cambiarTamanoTexto(10)} aria-label="Aumentar tamaño de texto">A+</button>
        <button type="button" onClick={() => setFuenteDislexia(activa => !activa)} aria-pressed={fuenteDislexia} aria-label="Activar o desactivar fuente de lectura fácil">Aa</button>
      </div>
      <div className="botones-tema">
        <button id="escuchar-btn" type="button" onClick={cambiarModoEscuchar} aria-pressed={lecturaActiva} aria-label="Activar o detener lectura de la página">{lecturaActiva ? '■' : '🔊'}</button>
        <button id="alto-contraste-btn" type="button" onClick={() => setAltoContraste(activo => !activo)} aria-pressed={altoContraste} aria-label="Activar o desactivar alto contraste">◐</button>
        <button id="tema-btn" type="button" onClick={() => setModoOscuro(activo => !activo)} aria-pressed={modoOscuro} aria-label="Activar o desactivar modo oscuro">{modoOscuro ? '☀️' : '🌙'}</button>
      </div>
      <main id="main-content" style={{ display: vistaPerfilVisible || panelAdminVisible || panelEntrenadorVisible || panelDeportistaVisible ? 'none' : 'block' }}>
        <Hero />
        <InfoClub />
        <Programas actualizacion={actualizacionProgramas} onInteres={handleInteresPrograma} />
        <Contacto mostrarNotificacion={mostrarNotificacion} mensajePrefijado={mensajeContacto} />
      </main>
      <VistaPerfil 
        visible={vistaPerfilVisible && !panelAdminVisible && !panelEntrenadorVisible && !panelDeportistaVisible}
        usuario={usuario}
        onVolver={handleVolver}
        onEditarPerfil={handleEditarPerfil}
      />
      {panelAdminVisible && usuario?.rol === 'administrador' && (
        <PanelAdministrador
          token={localStorage.getItem('token')}
          onCerrar={() => setPanelAdminVisible(false)}
          onCambios={() => setActualizacionProgramas(valor => valor + 1)}
          mostrarNotificacion={mostrarNotificacion}
        />
      )}
      {panelEntrenadorVisible && usuario?.rol === 'entrenador' && (
        <PanelEntrenador
          token={localStorage.getItem('token')}
          onCerrar={() => setPanelEntrenadorVisible(false)}
          mostrarNotificacion={mostrarNotificacion}
        />
      )}
      {panelDeportistaVisible && usuario?.rol === 'deportista' && (
        <PanelDeportista
          token={localStorage.getItem('token')}
          onCerrar={() => setPanelDeportistaVisible(false)}
          mostrarNotificacion={mostrarNotificacion}
        />
      )}
      <Footer />
      <ModalLogin 
        visible={modalLoginVisible}
        onClose={() => setModalLoginVisible(false)}
        onLogin={handleLogin}
      />
      <ModalRegistro 
        visible={modalRegistroVisible}
        onClose={() => setModalRegistroVisible(false)}
        onRegistro={handleRegistro}
      />
      <ModalEditarPerfil 
        visible={modalEditarPerfilVisible}
        onClose={() => setModalEditarPerfilVisible(false)}
        onActualizar={handleActualizarPerfil}
        usuario={usuario}
      />
      <NotificacionGlobal 
        mensaje={notificacion.mensaje}
        tipo={notificacion.tipo}
        visible={notificacion.visible}
      />
    </>
  )
}

export default App
