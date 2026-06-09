const elementoYear = document.getElementById("year");

if (elementoYear) {
  elementoYear.textContent = new Date().getFullYear();
}

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

const palabraInicio = document.getElementById("palabra-inicio");
const cargadorInicio = document.getElementById("cargador-inicio");

let indiceSaludo = 0;

const intervaloSaludos = setInterval(() => {
  indiceSaludo++;

  if (indiceSaludo < saludos.length) {
    palabraInicio.textContent = saludos[indiceSaludo];

    palabraInicio.style.animation = "none";
    palabraInicio.offsetHeight;
    palabraInicio.style.animation = "aparecerPalabra 0.28s ease";
  } else {
    clearInterval(intervaloSaludos);
    cargadorInicio.classList.add("ocultar-cargador");

    setTimeout(() => {
      cargadorInicio.style.display = "none";
    }, 900);
  }
}, 260);