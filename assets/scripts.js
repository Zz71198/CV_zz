/*
  Archivo principal de JavaScript de mi portafolio.
  Aquí manejo tres cosas:
  1. El año automático del footer.
  2. El precargador inicial con saludos.
  3. El efecto de escritura en la sección "Sobre mí".
*/


/*
  Primero actualizo automáticamente el año del footer.
  Así no tengo que cambiarlo manualmente cada año.
*/
const elementoYear = document.getElementById("year");

if (elementoYear) {
  elementoYear.textContent = new Date().getFullYear();
}


/*
  Lista de saludos que aparecen en el precargador inicial.
  Cada palabra se muestra por un momento antes de entrar al sitio.
*/
const saludos = [
  "Hola",
  "Hello",
  "Bonjour",
  "Ciao",
  "Hallo",
  "Olá",
  "Salut",
  "こんにちは",
  "안녕하세요"
];


/*
  Tomo los elementos del precargador desde el HTML.
  palabraInicio es el texto que cambia.
  cargadorInicio es la pantalla completa del precargador.
*/
const palabraInicio = document.getElementById("palabra-inicio");
const cargadorInicio = document.getElementById("cargador-inicio");


/*
  Esta función reinicia la animación de una palabra.
  La uso para que cada saludo aparezca con el efecto definido en CSS.
*/
function reiniciarAnimacionPalabra(elemento) {
  elemento.style.animation = "none";

  /*
    Esta línea fuerza al navegador a recalcular el elemento.
    Así puedo volver a aplicar la misma animación.
  */
  elemento.offsetHeight;

  elemento.style.animation = "aparecerPalabra 0.28s ease";
}


/*
  Aquí ejecuto el precargador.
  Solo lo hago si los elementos existen, para evitar errores si algún día cambio el HTML.
*/
if (palabraInicio && cargadorInicio) {
  let indiceSaludo = 0;

  const intervaloSaludos = setInterval(() => {
    indiceSaludo++;

    if (indiceSaludo < saludos.length) {
      palabraInicio.textContent = saludos[indiceSaludo];
      reiniciarAnimacionPalabra(palabraInicio);
    } else {
      clearInterval(intervaloSaludos);

      /*
        Cuando terminan los saludos, agrego esta clase.
        El CSS se encarga de hacer el desvanecido.
      */
      cargadorInicio.classList.add("ocultar-cargador");

      /*
        Después de la transición, oculto completamente el precargador.
        Así ya no bloquea clics ni interacción con la página.
      */
      setTimeout(() => {
        cargadorInicio.style.display = "none";
      }, 900);
    }
  }, 260);
}


/*
  Ahora preparo el efecto de escritura para la sección "Sobre mí".
  Busco todos los textos que tengan data-escritura="true".
*/
const textosParaEscribir = Array.from(
  document.querySelectorAll(".texto-escritura[data-escritura='true']")
);


/*
  Guardo el texto original de cada párrafo.
  Luego vacío los párrafos para que JavaScript los escriba poco a poco.
*/
const textosOriginales = textosParaEscribir.map((elemento) => {
  return elemento.textContent.trim().replace(/\s+/g, " ");
});

textosParaEscribir.forEach((elemento) => {
  elemento.textContent = "";
});


/*
  Esta función crea una pausa sencilla.
  La uso para separar un poco la escritura entre párrafos.
*/
function esperar(tiempo) {
  return new Promise((resolver) => {
    setTimeout(resolver, tiempo);
  });
}


/*
  Esta función escribe un texto letra por letra dentro de un elemento.
  También agrega la clase "escribiendo" para mostrar el cursor en CSS.
*/
function escribirTexto(elemento, texto, velocidad = 18) {
  return new Promise((resolver) => {
    let posicion = 0;

    elemento.classList.add("escribiendo");

    const intervaloEscritura = setInterval(() => {
      elemento.textContent += texto.charAt(posicion);
      posicion++;

      if (posicion >= texto.length) {
        clearInterval(intervaloEscritura);
        elemento.classList.remove("escribiendo");
        resolver();
      }
    }, velocidad);
  });
}


/*
  Esta variable evita que el efecto de escritura se repita varias veces.
  Solo quiero que se active una vez cuando llego a la sección.
*/
let escrituraIniciada = false;


/*
  Esta función escribe todos los párrafos de "Sobre mí" en orden.
  Primero escribe uno, espera un poco y luego sigue con el siguiente.
*/
async function iniciarEscrituraSobreMi() {
  if (escrituraIniciada) {
    return;
  }

  escrituraIniciada = true;

  for (let i = 0; i < textosParaEscribir.length; i++) {
    await escribirTexto(textosParaEscribir[i], textosOriginales[i], 18);
    await esperar(280);
  }
}


/*
  Uso IntersectionObserver para detectar cuándo aparece la sección "Sobre mí".
  Así el texto no se escribe apenas carga la página, sino cuando bajo hasta esa parte.
*/
const seccionSobreMi = document.getElementById("sobre-mi");

if (seccionSobreMi && textosParaEscribir.length > 0 && "IntersectionObserver" in window) {
  const observadorSobreMi = new IntersectionObserver(
    (entradas) => {
      const entrada = entradas[0];

      if (entrada.isIntersecting) {
        iniciarEscrituraSobreMi();
        observadorSobreMi.disconnect();
      }
    },
    {
      threshold: 0.35
    }
  );

  observadorSobreMi.observe(seccionSobreMi);
}


/*
  Si el navegador no soporta IntersectionObserver,
  muestro los textos completos para que no se pierda información.
*/
if (!("IntersectionObserver" in window)) {
  textosParaEscribir.forEach((elemento, indice) => {
    elemento.textContent = textosOriginales[indice];
  });
}
