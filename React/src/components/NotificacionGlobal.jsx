// Importar React y hooks necesarios //

import { useState, useEffect } from 'react'

// Componente de Notificación Global //

function NotificacionGlobal({ mensaje, tipo, visible }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        // Aquí podrías agregar una función para ocultar la notificación
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [visible])

  if (!visible || !mensaje) return null

// Renderizado del componente //

  return (
    <div className={`notificacion-global mostrar ${tipo}`}>
      {mensaje}
    </div>
  )
}

export default NotificacionGlobal
