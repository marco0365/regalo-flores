// Selección de elementos del DOM que participan en la animación principal.
const petalsLayer = document.getElementById('petalsLayer');
const hint = document.querySelector('.hint');
const arrow = document.querySelector('.arrow');
const mensajeIndicador = document.querySelector('.mensaje-indicador');
const flower = document.querySelector('.flower');
const florContenedor = document.querySelector('.flor-contenedor');
const semilla = document.querySelector('.semilla');
const lineaSuelo = document.querySelector('.linea-suelo');
const tallo = document.getElementById('tallo-principal');
const ramas = document.querySelectorAll('.rama-secundaria');
const hojas = document.querySelectorAll('.hoja-brote');

// Inicialización del dibujo del árbol: se calcula la longitud de cada trazo para animarlo con stroke-dashoffset.
if (tallo) {
  const longitudTallo = tallo.getTotalLength();
  tallo.style.strokeDasharray = longitudTallo;
  tallo.style.strokeDashoffset = longitudTallo;
}

ramas.forEach((rama) => {
  const longitudRama = rama.getTotalLength();
  rama.style.strokeDasharray = longitudRama;
  rama.style.strokeDashoffset = longitudRama;
});

hojas.forEach((hoja) => {
  hoja.classList.remove('visible');
});

// Crea un pétalo individual para la lluvia de fondo.
function createPetal() {
  const petal = document.createElement('span');
  petal.className = 'petal';

  const size = 10 + Math.random() * 16;
  const left = Math.random() * 100;
  const duration = 8 + Math.random() * 12;
  const sway = (Math.random() - 0.5) * 120;

  petal.style.width = `${size}px`;
  petal.style.height = `${size * 1.45}px`;
  petal.style.left = `${left}vw`;
  petal.style.animationDuration = `${duration}s`;
  petal.style.setProperty('--sway', `${sway}px`);

  petalsLayer.appendChild(petal);
}

// Genera la lluvia de pétalos inicial para ambientar la escena.
function generatePetalRain() {
  const totalPetals = 24;
  for (let i = 0; i < totalPetals; i += 1) {
    createPetal();
  }
}

generatePetalRain();

// Genera la copa del corazón con muchas flores distribuidas por la forma del contorno y el interior del corazón.
function generarCopaCorazon() {
  const copaCorazon = document.getElementById('copa-corazon');
  if (!copaCorazon || copaCorazon.dataset.yaGenerado === 'true') {
    return;
  }

  copaCorazon.dataset.yaGenerado = 'true';
  copaCorazon.setAttribute('transform', 'translate(0 30)');
  copaCorazon.innerHTML = '';

  const totalFlores = 500;
  const puntos = [];
  const candidatos = [];

  // Rejilla inteligente dentro de la forma del corazón para rellenar huecos y mantener la silueta clara.
  for (let y = 26; y <= 256; y += 9) {
    for (let x = 48; x <= 352; x += 9) {
      const nx = (x - 200) / 120;
      const ny = (y - 120) / 110;
      const formaCorazon = (nx * nx + ny * ny - 1) ** 3 - (nx * nx) * (ny ** 3) <= 0;

      if (!formaCorazon) {
        continue;
      }

      const yFinal = 240 - y;

      candidatos.push({
        x: x + (Math.random() - 0.5) * 8,
        y: yFinal + (Math.random() - 0.5) * 8,
      });
    }
  }

  while (puntos.length < totalFlores && candidatos.length > 0) {
    const indice = Math.floor(Math.random() * candidatos.length);
    const candidato = candidatos.splice(indice, 1)[0];

    puntos.push({
      x: candidato.x,
      y: candidato.y,
      escala: 0.85 + Math.random() * 1.1,
    });
  }

  // Si quedan huecos, se rellenan con puntos aleatorios dentro de la zona del corazón.
  while (puntos.length < totalFlores) {
    const angulo = Math.random() * Math.PI * 2;
    const distancia = Math.random() * 88;
    const x = 200 + Math.cos(angulo) * distancia;
    const y = 120 + Math.sin(angulo) * distancia * 0.82;

    const yFinal = 240 - y;

    if (x < 55 || x > 345 || yFinal < 20 || yFinal > 255) {
      continue;
    }

    puntos.push({
      x,
      y: yFinal,
      escala: 0.9 + Math.random() * 1.1,
    });
  }

  if (puntos.length < totalFlores) {
    const centroX = 200;
    const centroY = 120;

    while (puntos.length < totalFlores) {
      const angulo = Math.random() * Math.PI * 2;
      const distancia = Math.random() * 92;
      const x = centroX + Math.cos(angulo) * distancia;
      const y = centroY + Math.sin(angulo) * distancia * 0.8;

      const yFinal = 240 - y;

      if (x < 55 || x > 345 || yFinal < 20 || yFinal > 255) {
        continue;
      }

      puntos.push({ x, y: yFinal, escala: 0.85 + Math.random() * 1.0 });
    }
  }

  // Inserta cada flor dentro del SVG con una aparición progresiva.
  let index = 0;
  const intervalo = window.setInterval(() => {
    if (index >= puntos.length) {
      window.clearInterval(intervalo);

      // Cuando termina la copa, se muestran los mensajes finales.
      const loveMessage = document.querySelector('.love-message');
      const celebrationMessage = document.querySelector('.celebration-message');
      if (loveMessage) {
        loveMessage.classList.add('visible');
      }
      if (celebrationMessage) {
        celebrationMessage.classList.add('visible');
      }
      return;
    }

    const punto = puntos[index];
    const flor = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    flor.setAttribute('href', 'flor.svg');
    flor.setAttribute('class', 'flor-corazon');
    flor.setAttribute('x', String(punto.x - 12));
    flor.setAttribute('y', String(punto.y - 12));
    flor.setAttribute('width', '24');
    flor.setAttribute('height', '24');
    flor.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    flor.setAttribute('transform', `scale(${punto.escala})`);

    copaCorazon.appendChild(flor);

    window.setTimeout(() => {
      flor.classList.add('flor-visible');
    }, 10);

    index += 1;
  }, 16);
}

// Cuando el usuario hace clic en la flor inicial, se encoge y aparece la semilla.
flower.addEventListener('click', () => {
  if (hint.classList.contains('is-hidden')) {
    return;
  }

  mensajeIndicador.classList.add('ocultar');
  hint.classList.add('is-hidden');

  flower.style.transition = 'transform 1.5s cubic-bezier(0.18, 0.89, 0.32, 1.1)';
  flower.style.transform = 'scale(0)';
  flower.style.transformOrigin = 'center';

  window.setTimeout(() => {
    flower.style.display = 'none';
    semilla.classList.add('visible');
  }, 1500);
});

// Mismo efecto si el usuario hace clic sobre el contenedor de la flor.
florContenedor.addEventListener('click', () => {
  if (florContenedor.classList.contains('encoger')) {
    return;
  }

  mensajeIndicador.classList.add('ocultar');
  hint.classList.add('is-hidden');

  florContenedor.classList.add('encoger');

  window.setTimeout(() => {
    florContenedor.style.display = 'none';
    semilla.classList.add('visible');
  }, 1500);
});

// La semilla cae al suelo, hace crecer el árbol y luego genera la copa en forma de corazón.
semilla.addEventListener('click', () => {
  if (!semilla.classList.contains('visible') || semilla.classList.contains('caer')) {
    return;
  }

  semilla.classList.add('caer');
  lineaSuelo.classList.add('expandir-suelo');
  semilla.style.pointerEvents = 'none';

  window.setTimeout(() => {
    if (!tallo) {
      return;
    }

    const arbol = document.getElementById('contenedor-arbol');
    if (arbol) {
      arbol.style.opacity = '1';
    }

    tallo.style.strokeDashoffset = '0';

    window.setTimeout(() => {
      ramas.forEach((rama) => {
        rama.style.strokeDashoffset = '0';
      });

      window.setTimeout(() => {
        hojas.forEach((hoja) => {
          hoja.classList.add('visible');
        });

        window.setTimeout(() => {
          generarCopaCorazon();
        }, 1200);
      }, 1200);
    }, 1200);
  }, 2500);
});
