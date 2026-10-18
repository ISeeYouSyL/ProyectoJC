// Variables generales // 

const botonMenu = document.getElementById("menu-btn");
const navegacion = document.querySelector("nav");
const formulario = document.querySelector("form");


// Menú hamburguesa para Celular //

if (botonMenu && navegacion) {
    botonMenu.addEventListener("click", function () {
        const menuAbierto = navegacion.classList.toggle("active");

        botonMenu.textContent = menuAbierto ? "×" : "☰";
        botonMenu.setAttribute(
            "aria-label",
            menuAbierto ? "Cerrar menú" : "Abrir menú"
        );
    });

    const enlaces = document.querySelectorAll("nav a");

    enlaces.forEach(function (enlace) {
        enlace.addEventListener("click", function () {
            navegacion.classList.remove("active");
            botonMenu.textContent = "☰";
            botonMenu.setAttribute("aria-label", "Abrir menú");
        });
    });
}


// Mensajes del formulario //

function mostrarMensaje(texto, esError, esGlobal = false) {
    if (esGlobal) {

        // Usar notificación global // 

        const notificacion = document.getElementById("notificacion-global");
        notificacion.textContent = texto;
        notificacion.className = "notificacion-global mostrar " + (esError ? "error" : "exito");

        // Ocultar después de 3 segundos // 

        setTimeout(function () {
            notificacion.classList.remove("mostrar");
        }, 3000);
    } else {

        // Usar mensaje del formulario //

        let aviso = document.getElementById("estado-formulario");

        if (!aviso) {
            aviso = document.createElement("p");
            aviso.id = "estado-formulario";
            formulario.appendChild(aviso);
        }

        aviso.textContent = texto;
        aviso.style.marginTop = "15px";
        aviso.style.fontWeight = "bold";
        aviso.style.textAlign = "center";
        aviso.style.color = esError ? "#C62828" : "#198754";
    }
}


// Validación del formulario //

if (formulario) {
    formulario.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const mensaje = document.getElementById("mensaje").value.trim();

        if (nombre.length < 3) {
            mostrarMensaje("Escribe un nombre válido.", true);
        } else if (!correo.includes("@") || !correo.includes(".")) {
            mostrarMensaje("Escribe un correo válido.", true);
        } else if (mensaje.length < 10) {
            mostrarMensaje("El mensaje debe tener al menos 10 caracteres.", true);
        } else {
            try {
                const respuesta = await fetch("/api/mensajes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nombre: nombre,
                        correo: correo,
                        mensaje: mensaje,
                        programa: formulario.dataset.programa || ""
                    })
                });

                const datos = await respuesta.json();

                if (!respuesta.ok) {
                    mostrarMensaje(datos.mensaje || "No fue posible enviar el mensaje.", true);
                    return;
                }

                mostrarMensaje("¡Mensaje enviado correctamente! Pronto nos comunicaremos contigo.", false);
                formulario.reset();
                delete formulario.dataset.programa;
            } catch (error) {
                mostrarMensaje("No se pudo conectar con el servidor. Inténtalo de nuevo.", true);
            }
        }
    });
}


// Frases de Inicio //

const frases = [
    "No se trata de las limitaciones, sino de la determinación.",
    "El deporte nos une y nos hace más fuertes.",
    "Cada entrenamiento es un paso hacia una meta.",
    "La inclusión también se juega en equipo.",
    "No hay límites para quien decide avanzar."
];

function mostrarFraseAleatoria() {
    const posicionAleatoria = Math.floor(Math.random() * frases.length);
    const fraseSeleccionada = frases[posicionAleatoria];

    const textoHero = document.getElementById("frase-motivadora");

    if (textoHero) {
        textoHero.textContent = fraseSeleccionada;
    }
}

mostrarFraseAleatoria();


// Selección de Programas Deportivos //

const botonesInteres = document.querySelectorAll(".boton-interes");
const seccionContacto = document.getElementById("contacto");
const campoMensaje = document.getElementById("mensaje");

botonesInteres.forEach(function (boton) {
    boton.addEventListener("click", async function () {
        const codigoPrograma = boton.dataset.programa;
        
        try {
            const respuesta = await fetch("/api/programas/" + codigoPrograma);
            const programaElegido = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error("Programa no encontrado");
            }

            campoMensaje.value = "Estoy interesado/a en el programa de " + programaElegido.nombre + ".";
            formulario.dataset.programa = programaElegido.nombre;
            seccionContacto.scrollIntoView({ behavior: "smooth" });
            campoMensaje.focus();
        } catch (error) {
            mostrarMensaje("No se pudo consultar el programa. Inténtalo de nuevo.", true);
        }
    });
});


// Modo oscuro //

const botonTema = document.getElementById("tema-btn");
let modoOscuro = false;

function cambiarTema() {
    modoOscuro = !modoOscuro;

    document.body.classList.toggle("modo-oscuro", modoOscuro);

    if (modoOscuro) {
        botonTema.textContent = "☀️";
        botonTema.setAttribute("aria-label", "Desactivar modo oscuro");
    } else {
        botonTema.textContent = "🌙";
        botonTema.setAttribute("aria-label", "Activar modo oscuro");
    }
}

botonTema.addEventListener("click", cambiarTema);


// Tamaño del texto //

const botonAumentar = document.getElementById("aumentar-texto");
const botonDisminuir = document.getElementById("disminuir-texto");

let tamanoTexto = 100;

function cambiarTamanoTexto(cambio) {
    const nuevoTamano = tamanoTexto + cambio;

    if (nuevoTamano >= 90 && nuevoTamano <= 120) {
        tamanoTexto = nuevoTamano;
        document.documentElement.style.fontSize = tamanoTexto + "%";
    }
}

botonAumentar.addEventListener("click", function () {
    cambiarTamanoTexto(10);
});

botonDisminuir.addEventListener("click", function () {
    cambiarTamanoTexto(-10);
});


// Fuente para dislexia //

const botonFuenteDislexia = document.getElementById("fuente-dislexia");

if (botonFuenteDislexia) {
    botonFuenteDislexia.addEventListener("click", function () {
        const fuenteActiva = document.body.classList.toggle("fuente-dislexia");

        botonFuenteDislexia.setAttribute("aria-pressed", fuenteActiva);
        botonFuenteDislexia.setAttribute(
            "aria-label",
            fuenteActiva ? "Desactivar fuente de lectura fácil" : "Activar fuente de lectura fácil"
        );
    });
}


// Alto contraste //

const botonAltoContraste = document.getElementById("alto-contraste");

if (botonAltoContraste) {
    botonAltoContraste.addEventListener("click", function () {
        const contrasteActivo = document.body.classList.toggle("alto-contraste");

        botonAltoContraste.setAttribute("aria-pressed", contrasteActivo);
        botonAltoContraste.setAttribute(
            "aria-label",
            contrasteActivo ? "Desactivar alto contraste" : "Activar alto contraste"
        );
    });
}


// Modo escuchar //

const botonEscuchar = document.getElementById("modo-escuchar");
let lecturaActiva = false;

function detenerLectura() {
    window.speechSynthesis.cancel();
    lecturaActiva = false;
    botonEscuchar.textContent = "🔊";
    botonEscuchar.setAttribute("aria-pressed", "false");
    botonEscuchar.setAttribute("aria-label", "Escuchar el contenido de la página");
}

function escucharPagina() {
    if (!("speechSynthesis" in window)) {
        mostrarMensaje("Tu navegador no permite la lectura en voz alta.", true);
        return;
    }

    if (lecturaActiva) {
        detenerLectura();
        return;
    }

    const contenido = document.querySelector("main").innerText;
    const lectura = new SpeechSynthesisUtterance(contenido);

    lectura.lang = "es-CO";
    lectura.rate = 0.9;
    lectura.onend = detenerLectura;
    lectura.onerror = detenerLectura;

    lecturaActiva = true;
    botonEscuchar.textContent = "■";
    botonEscuchar.setAttribute("aria-pressed", "true");
    botonEscuchar.setAttribute("aria-label", "Detener lectura de la página");
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(lectura);
}

if (botonEscuchar) {
    botonEscuchar.addEventListener("click", escucharPagina);
}


// Modales de Autenticación //

const btnLogin = document.getElementById("btn-login");
const btnRegister = document.getElementById("btn-register");
const modalLogin = document.getElementById("modal-login");
const modalRegister = document.getElementById("modal-register");
const formLogin = document.getElementById("form-login");
const formRegister = document.getElementById("form-register");
const closeButtons = document.querySelectorAll(".modal-close");

function abrirModal(modal) {
    modal.style.display = "block";
}

function cerrarModal(modal) {
    modal.style.display = "none";
}

if (btnLogin) {
    btnLogin.addEventListener("click", function () {
        abrirModal(modalLogin);
    });
}

if (btnRegister) {
    btnRegister.addEventListener("click", function () {
        abrirModal(modalRegister);
    });
}

closeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        cerrarModal(btn.closest(".modal"));
    });
});

window.addEventListener("click", function (event) {
    if (event.target.classList.contains("modal")) {
        cerrarModal(event.target);
    }
});


// Registro de usuario //

if (formRegister) {
    formRegister.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        const nombre = document.getElementById("reg-nombre").value.trim();
        const correo = document.getElementById("reg-correo").value.trim();
        const contrasena = document.getElementById("reg-contrasena").value;
        const rol = document.getElementById("reg-rol").value;

        if (nombre.length < 3) {
            mostrarMensaje("El nombre debe tener al menos 3 caracteres.", true);
            return;
        }

        if (!correo.includes("@")) {
            mostrarMensaje("Ingresa un correo válido.", true);
            return;
        }

        if (contrasena.length < 6) {
            mostrarMensaje("La contraseña debe tener al menos 6 caracteres.", true);
            return;
        }

        try {
            const respuesta = await fetch("/api/usuarios/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre: nombre,
                    correo: correo,
                    contrasena: contrasena,
                    rol: rol
                })
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                mostrarMensaje(datos.mensaje || "Error al registrar.", true);
                return;
            }

            mostrarMensaje(datos.mensaje, false, true);
            formRegister.reset();
            cerrarModal(modalRegister);
        } catch (error) {
            mostrarMensaje("No se pudo conectar con el servidor.", true);
        }
    });
}


// Inicio de sesion //


if (formLogin) {
    formLogin.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        const correo = document.getElementById("login-correo").value.trim();
        const contrasena = document.getElementById("login-contrasena").value;

        if (!correo || !contrasena) {
            mostrarMensaje("Completa todos los campos.", true);
            return;
        }

        try {
            const respuesta = await fetch("/api/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    correo: correo,
                    contrasena: contrasena
                })
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                mostrarMensaje(datos.mensaje || "Error al iniciar sesión.", true);
                return;
            }

            mostrarMensaje(datos.mensaje, false, true);
            formLogin.reset();
            cerrarModal(modalLogin);

            // Guardar usuario y actualizar UI //
            localStorage.setItem("usuario", JSON.stringify(datos.usuario));
            actualizarEstadoUsuario();
        } catch (error) {
            mostrarMensaje("No se pudo conectar con el servidor.", true);
        }
    });
}


// Función para actualizar el estado del usuario en la UI // 

function actualizarEstadoUsuario() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const authButtons = document.querySelector(".auth-buttons");
    const usuarioLogueado = document.getElementById("usuario-logueado");
    const avatarIniciales = document.getElementById("avatar-iniciales");
    const dropdownNombre = document.getElementById("dropdown-nombre");
    const dropdownRol = document.getElementById("dropdown-rol");

    if (usuario) {
        authButtons.style.display = "none";
        usuarioLogueado.style.display = "flex";

        // Obtener iniciales del nombre //

        const iniciales = usuario.nombre.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
        avatarIniciales.textContent = iniciales;

        dropdownNombre.textContent = usuario.nombre;
        dropdownRol.textContent = usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1);
    } else {
        authButtons.style.display = "flex";
        usuarioLogueado.style.display = "none";
    }
}


// Menú desplegable del avatar // 

const avatarBtn = document.getElementById("avatar-btn");
const dropdownMenu = document.getElementById("dropdown-menu");

if (avatarBtn && dropdownMenu) {
    avatarBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle("active");
    });

    // Cerrar menú al hacer clic fuera //

    document.addEventListener("click", function (e) {
        if (!avatarBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove("active");
        }
    });
}


// Ver perfil // 

const btnPerfil = document.getElementById("btn-perfil");
if (btnPerfil) {
    btnPerfil.addEventListener("click", function () {
        dropdownMenu.classList.remove("active");

        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (usuario) {

            // Ocultar contenido principal y mostrar vista de perfil

            document.getElementById("main-content").style.display = "none";
            document.getElementById("vista-perfil").style.display = "block";

            // Llenar datos del perfil

            const iniciales = usuario.nombre.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
            document.getElementById("perfil-iniciales").textContent = iniciales;
            document.getElementById("perfil-nombre").textContent = usuario.nombre;
            document.getElementById("perfil-correo").textContent = usuario.correo;
            document.getElementById("perfil-rol").textContent = usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1);
            document.getElementById("perfil-fecha").textContent = new Date().toLocaleDateString('es-CO');
        }
    });
}


// Volver al inicio // 

const btnVolver = document.getElementById("btn-volver");
if (btnVolver) {
    btnVolver.addEventListener("click", function () {
        document.getElementById("vista-perfil").style.display = "none";
        document.getElementById("main-content").style.display = "block";
    });
}


// Editar perfil // 

const btnEditarPerfil = document.getElementById("btn-editar-perfil");
const modalEditarPerfil = document.getElementById("modal-editar-perfil");
const formEditarPerfil = document.getElementById("form-editar-perfil");

if (btnEditarPerfil) {
    btnEditarPerfil.addEventListener("click", function () {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (usuario) {
            document.getElementById("edit-nombre").value = usuario.nombre;
            document.getElementById("edit-contrasena-actual").value = "";
            document.getElementById("edit-contrasena-nueva").value = "";
            abrirModal(modalEditarPerfil);
        }
    });
}

if (formEditarPerfil) {
    formEditarPerfil.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (!usuario) return;

        const nombre = document.getElementById("edit-nombre").value.trim();
        const contrasenaActual = document.getElementById("edit-contrasena-actual").value;
        const contrasenaNueva = document.getElementById("edit-contrasena-nueva").value;

        if (nombre.length < 3) {
            mostrarMensaje("El nombre debe tener al menos 3 caracteres.", true);
            return;
        }

        if (!contrasenaActual) {
            mostrarMensaje("Debes ingresar tu contraseña actual.", true);
            return;
        }

        if (contrasenaNueva && contrasenaNueva.length < 6) {
            mostrarMensaje("La nueva contraseña debe tener al menos 6 caracteres.", true);
            return;
        }

        try {
            const respuesta = await fetch("/api/usuarios/perfil", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    correo: usuario.correo,
                    nombre: nombre,
                    contrasena_actual: contrasenaActual,
                    contrasena_nueva: contrasenaNueva
                })
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                mostrarMensaje(datos.mensaje || "Error al actualizar perfil.", true);
                return;
            }

            mostrarMensaje(datos.mensaje, false, true);

            // Actualizar usuario en localStorage // 

            localStorage.setItem("usuario", JSON.stringify(datos.usuario));

            // Actualizar UI // 

            actualizarEstadoUsuario();

            // Actualizar datos del perfil en la vista // 

            const iniciales = datos.usuario.nombre.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
            const perfilIniciales = document.getElementById("perfil-iniciales");
            const perfilNombre = document.getElementById("perfil-nombre");

            if (perfilIniciales) perfilIniciales.textContent = iniciales;
            if (perfilNombre) perfilNombre.textContent = datos.usuario.nombre;

            formEditarPerfil.reset();
            cerrarModal(modalEditarPerfil);
        } catch (error) {
            mostrarMensaje("No se pudo conectar con el servidor.", true);
        }
    });
}


// Cerrar modal de editar perfil // 

if (modalEditarPerfil) {
    const closeButtonsEditar = modalEditarPerfil.querySelectorAll(".modal-close");
    closeButtonsEditar.forEach(function (btn) {
        btn.addEventListener("click", function () {
            cerrarModal(modalEditarPerfil);
        });
    });

    // Cerrar al hacer clic fuera // 

    window.addEventListener("click", function (event) {
        if (event.target === modalEditarPerfil) {
            cerrarModal(modalEditarPerfil);
        }
    });
}


// Cerrar sesión //

const btnLogout = document.getElementById("btn-logout");
if (btnLogout) {
    btnLogout.addEventListener("click", function () {
        dropdownMenu.classList.remove("active");
        localStorage.removeItem("usuario");
        actualizarEstadoUsuario();
        mostrarMensaje("Sesión cerrada correctamente.", false, true);
    });
}


// Verificar si hay usuario logueado al cargar la página // 

actualizarEstadoUsuario();




    
