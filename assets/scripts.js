/*
  Archivo principal de JavaScript de mi portafolio.

  Aquí manejo:
  1. El año automático del footer.
  2. El precargador inicial con saludos.
  3. El efecto de escritura en la sección "Sobre mí".
*/


/*
  Actualizo automáticamente el año del footer.
  Así no tengo que cambiarlo manualmente cada año.
*/
const elementoYear = document.getElementById("year");

if (elementoYear) {
  elementoYear.textContent = new Date().getFullYear();
}


/*
  Defino los saludos que quiero mostrar en el precargador.
  La idea es que el sitio empiece con una entrada breve y elegante.
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
  Tomo desde el HTML los elementos del precargador.
  palabraInicio es el texto que va cambiando.
  cargadorInicio es la pantalla completa que cubre el sitio al cargar.
*/
const palabraInicio = document.getElementById("palabra-inicio");
const cargadorInicio = document.getElementById("cargador-inicio");


/*
  Con esta función reinicio la animación de cada palabra.
  Esto permite que cada saludo vuelva a entrar con el mismo efecto visual.
*/
function reiniciarAnimacionPalabra(elemento) {
  elemento.style.animation = "none";

  /*
    Fuerzo al navegador a recalcular el elemento.
    Esto hace posible volver a aplicar la misma animación.
  */
  elemento.offsetHeight;

  elemento.style.animation = "aparecerPalabra 0.28s ease";
}


/*
  Ejecuto el precargador solamente si los elementos existen.
  Esto evita errores si más adelante cambio algo del HTML.
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
        Cuando terminan los saludos, agrego la clase que oculta el cargador.
        La transición visual está definida en CSS.
      */
      cargadorInicio.classList.add("ocultar-cargador");

      /*
        Después del desvanecido, retiro el cargador del flujo visual.
        Así ya no bloquea clics ni interacción con la página.
      */
      setTimeout(() => {
        cargadorInicio.style.display = "none";
      }, 900);
    }
  }, 260);
}


/*
  Preparo el efecto de escritura para los textos de la sección "Sobre mí".
  En el HTML identifiqué esos párrafos con data-escritura="true".
*/
const textosParaEscribir = Array.from(
  document.querySelectorAll(".texto-escritura[data-escritura='true']")
);


/*
  Guardo el texto original de cada párrafo.
  También limpio espacios repetidos para que la escritura se vea más ordenada.
*/
const textosOriginales = textosParaEscribir.map((elemento) => {
  return elemento.textContent.trim().replace(/\s+/g, " ");
});


/*
  Vacío los párrafos al iniciar.
  Luego JavaScript los va escribiendo cuando llegue a la sección "Sobre mí".
*/
textosParaEscribir.forEach((elemento) => {
  elemento.textContent = "";
});


/*
  Esta función crea una pausa.
  La uso para separar un poco la escritura entre un párrafo y el siguiente.
*/
function esperar(tiempo) {
  return new Promise((resolver) => {
    setTimeout(resolver, tiempo);
  });
}


/*
  Esta función escribe un texto letra por letra dentro de un elemento.
  Mientras escribe, agrego la clase "escribiendo" para mostrar el cursor.
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
  Esta variable evita que el efecto de escritura se repita.
  Solo quiero que ocurra una vez cuando el usuario llegue a "Sobre mí".
*/
let escrituraIniciada = false;


/*
  Escribo los párrafos de "Sobre mí" en orden.
  Primero aparece un párrafo, hago una pausa breve y luego aparece el siguiente.
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
  Detecto cuándo la sección "Sobre mí" entra en pantalla.
  Así el texto no se escribe al cargar la página, sino cuando bajo hasta esa sección.
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
  muestro los textos completos para no perder información.
*/
if (!("IntersectionObserver" in window)) {
  textosParaEscribir.forEach((elemento, indice) => {
    elemento.textContent = textosOriginales[indice];
  });
}


/*
  Cambio visual de la barra de navegación.
  Mientras estoy en la portada, la barra es transparente.
  Cuando bajo a las demás secciones, la barra vuelve a ser una cápsula clara.
*/
const encabezado = document.querySelector(".encabezado");
const portada = document.getElementById("inicio");

if (encabezado && portada && "IntersectionObserver" in window) {
  const observadorPortada = new IntersectionObserver(
    (entradas) => {
      const entrada = entradas[0];

      if (entrada.isIntersecting) {
        encabezado.classList.add("en-portada");
      } else {
        encabezado.classList.remove("en-portada");
      }
    },
    {
      threshold: 0.35
    }
  );

  observadorPortada.observe(portada);
}
