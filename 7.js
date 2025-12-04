// ============================================
// SISTEMA DE VIDA DEL JUGADOR CON CORAZONES
// ============================================

// Variables de vida
let vidaMaxima = 5;
let vidaActual = 5;
let invulnerable = false;
let contenedorCorazones = null;

// Audio de daño y muerte
const audioDañoJugador = new Audio("Daño Antiguo En Minecraft (Oof) - Efecto de Sonido (HD) #effects #sound.mp3");
const audioMuerteJugador = new Audio("WhatsApp Video 2025-11-22 at 4.27.47 PM.mp3");
audioDañoJugador.volume = 0.4;
audioMuerteJugador.volume = 0.6;

// ============================================
// CREAR INTERFAZ DE CORAZONES
// ============================================
function crearInterfazVida() {
  if (contenedorCorazones) {
    contenedorCorazones.remove();
  }

  contenedorCorazones = document.createElement("div");
  contenedorCorazones.id = "contenedor-corazones";
  contenedorCorazones.style.position = "fixed";
  contenedorCorazones.style.top = "150px";
  contenedorCorazones.style.left = "20px";
  contenedorCorazones.style.display = "flex";
  contenedorCorazones.style.gap = "10px";
  contenedorCorazones.style.zIndex = "1500";
  contenedorCorazones.style.display = "flex";

  actualizarCorazones();
  gameArea.appendChild(contenedorCorazones);
}

// ============================================
// ACTUALIZAR VISUALIZACIÓN DE CORAZONES
// ============================================
function actualizarCorazones() {
  if (!contenedorCorazones) return;

  contenedorCorazones.innerHTML = "";

  for (let i = 0; i < vidaMaxima; i++) {
    const corazon = document.createElement("div");
    corazon.className = "corazon";
    corazon.style.width = "40px";
    corazon.style.height = "40px";
    corazon.style.fontSize = "35px";
    corazon.style.filter = "drop-shadow(2px 2px 4px rgba(0,0,0,0.8))";
    corazon.style.transition = "all 0.3s";

    if (i < vidaActual) {
      corazon.textContent = "❤️";
      corazon.style.animation = "latido 1s infinite";
    } else {
      corazon.textContent = "🖤";
      corazon.style.opacity = "0.4";
    }

    contenedorCorazones.appendChild(corazon);
  }

  contenedorCorazones.style.display = "flex";
}

// ============================================
// ANIMACIÓN DE LATIDO
// ============================================
const styleCorazones = document.createElement('style');
styleCorazones.textContent = `
  @keyframes latido {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @keyframes dañoFlash {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(3) sepia(1) hue-rotate(-50deg); }
  }
`;
document.head.appendChild(styleCorazones);

// ============================================
// RECIBIR DAÑO DEL JUGADOR
// ============================================
function recibirDañoJugador() {
  if (invulnerable || vidaActual <= 0) return;

  vidaActual--;
  console.log(` El jugador recibió daño! Vida: ${vidaActual}/${vidaMaxima}`);

  audioDañoJugador.currentTime = 0;
  audioDañoJugador.play().catch(() => {});

  player.style.animation = "dañoFlash 0.2s 3";
  setTimeout(() => {
    player.style.animation = "";
  }, 600);

  actualizarCorazones();

  invulnerable = true;
  let parpadeo = setInterval(() => {
    player.style.opacity = player.style.opacity === "0.3" ? "1" : "0.3";
  }, 100);

  setTimeout(() => {
    invulnerable = false;
    clearInterval(parpadeo);
    player.style.opacity = "1";
  }, 2000);

  if (vidaActual <= 0) {
    morirJugador();
  }
}

// ============================================
// CURAR AL JUGADOR
// ============================================
function curarJugador(cantidad = 1) {
  if (vidaActual >= vidaMaxima) {
    console.log(" Vida completa!");
    return;
  }

  vidaActual = Math.min(vidaActual + cantidad, vidaMaxima);
  console.log(` Curado! Vida: ${vidaActual}/${vidaMaxima}`);
  
  player.style.filter = "brightness(1.5) sepia(0.3) hue-rotate(90deg)";
  setTimeout(() => {
    player.style.filter = "brightness(1)";
  }, 500);
  
  actualizarCorazones();
}

// ============================================
// MUERTE DEL JUGADOR
// ============================================
function morirJugador() {
  console.log(" EL JUGADOR HA MUERTO");
  
  //  DETENER MÚSICA DEL JEFE
  if (typeof audioAparicionJefe !== 'undefined') {
    audioAparicionJefe.pause();
    audioAparicionJefe.currentTime = 0;
  }
  
  audioMuerteJugador.currentTime = 0;
  audioMuerteJugador.play().catch(() => {});
  
  keys = {a: false, d: false};
  conArma = false;
  
  player.style.transition = "all 1s";
  player.style.opacity = "0";
  player.style.transform = "rotate(90deg) scale(0.5)";
  
  setTimeout(() => {
    mostrarPantallaGameOver();
  }, 1500);
}

// ============================================
// PANTALLA DE GAME OVER CON VIDEO
// ============================================
function mostrarPantallaGameOver() {
  const pantallaGameOver = document.createElement("div");
  pantallaGameOver.style.position = "fixed";
  pantallaGameOver.style.top = "0";
  pantallaGameOver.style.left = "0";
  pantallaGameOver.style.width = "100vw";
  pantallaGameOver.style.height = "100vh";
  pantallaGameOver.style.background = "rgba(0, 0, 0, 0.95)";
  pantallaGameOver.style.display = "flex";
  pantallaGameOver.style.flexDirection = "column";
  pantallaGameOver.style.justifyContent = "center";
  pantallaGameOver.style.alignItems = "center";
  pantallaGameOver.style.zIndex = "3000";
  
  const titulo = document.createElement("h1");
  titulo.textContent = "GAME OVER";
  titulo.style.fontFamily = "'UnifrakturMaguntia', cursive";
  titulo.style.fontSize = "5rem";
  titulo.style.color = "#FF0000";
  titulo.style.textShadow = "0 0 30px rgba(255, 0, 0, 1)";
  titulo.style.marginBottom = "2rem";
  titulo.style.animation = "pulse 1s infinite";
  
  const mensaje = document.createElement("p");
  mensaje.textContent = "El sheriff ha caído...";
  mensaje.style.fontFamily = "'Press Start 2P', cursive";
  mensaje.style.fontSize = "1.2rem";
  mensaje.style.color = "#FFFFFF";
  mensaje.style.marginBottom = "2rem";
  
  //  CONTENEDOR DE VIDEO
  const videoContainer = document.createElement("div");
  videoContainer.style.width = "640px";
  videoContainer.style.height = "360px";
  videoContainer.style.border = "5px solid #FF0000";
  videoContainer.style.borderRadius = "10px";
  videoContainer.style.overflow = "hidden";
  videoContainer.style.boxShadow = "0 0 30px rgba(255, 0, 0, 0.8)";
  videoContainer.style.marginBottom = "2rem";
  
  const video = document.createElement("video");
  video.style.width = "100%";
  video.style.height = "100%";
  video.style.objectFit = "cover";
  video.controls = true;
  video.autoplay = true;
  
  const source = document.createElement("source");
  // 👇 CAMBIA ESTE NOMBRE POR TU VIDEO DE MUERTE
  source.src = "pipipipixD.mp4"; // ← Pon aquí el nombre de tu video
  source.type = "video/MP4";
  
  video.appendChild(source);
  videoContainer.appendChild(video);
  
  //  SOLO BOTÓN DE REINTENTAR (Sin botón de menú)
  const botonReintentar = document.createElement("button");
  botonReintentar.textContent = "REINTENTAR";
  botonReintentar.className = "boton-menu";
  botonReintentar.style.marginTop = "1rem";
  botonReintentar.onclick = () => {
    pantallaGameOver.remove();
    reiniciarJuego();
  };
  
  pantallaGameOver.appendChild(titulo);
  pantallaGameOver.appendChild(mensaje);
  pantallaGameOver.appendChild(videoContainer);
  pantallaGameOver.appendChild(botonReintentar);
  
  document.body.appendChild(pantallaGameOver);
}

// ============================================
// REINICIAR JUEGO
// ============================================
function reiniciarJuego() {
  vidaActual = vidaMaxima;
  invulnerable = false;
  
  posX = 100;
  worldOffsetX = 0;
  player.style.left = posX + "px";
  player.style.bottom = alturaSuelo + "px";
  player.style.opacity = "1";
  player.style.transform = "scaleX(1)";
  player.style.transition = "";
  
  if (typeof limpiarSistemaEnemigos !== 'undefined') {
    limpiarSistemaEnemigos();
  }
  if (typeof limpiarSistemaJefe !== 'undefined') {
    limpiarSistemaJefe();
  }
  if (typeof limpiarNPC !== 'undefined') {
    limpiarNPC();
  }
  
  iniciarJuego();
  actualizarCorazones();
}

// ============================================
// INICIALIZAR SISTEMA DE VIDA
// ============================================
function inicializarSistemaVida() {
  vidaActual = vidaMaxima;
  invulnerable = false;
  crearInterfazVida();
  console.log(" Sistema de vida inicializado: " + vidaMaxima + " corazones");
}

// ============================================
// LIMPIAR SISTEMA DE VIDA
// ============================================
function limpiarSistemaVida() {
  if (contenedorCorazones) {
    contenedorCorazones.remove();
    contenedorCorazones = null;
  }
  vidaActual = vidaMaxima;
  invulnerable = false;
}

console.log("Sistema de vida con corazones cargado");
console.log("Vida máxima: " + vidaMaxima + " corazones");

console.log(" Video de muerte activado");

