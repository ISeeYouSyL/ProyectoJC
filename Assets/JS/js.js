// Variables // 
const botonMenu = document.getElementById("menu-btn");
const navegacion = document.querySelector("nav");
const formulario = document.querySelector("form");

// Menú hamburguesa //
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
function mostrarMensaje(texto, esError) {
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

// Validación del formulario //
if (formulario) {
    formulario.addEventListener("submit", function (evento) {
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
            mostrarMensaje("¡Mensaje enviado correctamente! Pronto nos comunicaremos contigo.", false);

            console.log("Formulario enviado:", {
                nombre: nombre,
                correo: correo,
                mensaje: mensaje
            });

            formulario.reset();
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
const programas = {
    futbol: "Fútbol 5 Visual",
    baloncesto: "Baloncesto en Silla de Ruedas",
    paraatletismo: "Paraatletismo",
    paranatacion: "Paranatación",
    boccia: "Boccia"
};

const botonesInteres = document.querySelectorAll(".boton-interes");
const seccionContacto = document.getElementById("contacto");
const campoMensaje = document.getElementById("mensaje");

botonesInteres.forEach(function (boton) {
    boton.addEventListener("click", function () {
        const codigoPrograma = boton.dataset.programa;
        const programaElegido = programas[codigoPrograma];

        if (programaElegido) {
            campoMensaje.value = "Estoy interesado/a en el programa de " + programaElegido + ".";
            seccionContacto.scrollIntoView({ behavior: "smooth" });
            campoMensaje.focus();

            console.log("Programa seleccionado:", programaElegido);
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