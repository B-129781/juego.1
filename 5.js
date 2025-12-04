// ============================================
// ELEMENTOS DOM
// ============================================
const menuPrincipal = document.getElementById("menu-principal");
const pantallaCreditos = document.getElementById("pantalla-creditos");
const gameArea = document.getElementById("game-area");
const player = document.getElementById("player");
const btnJugar = document.getElementById("btn-jugar");
const btnCreditos = document.getElementById("btn-creditos");
const btnCargar = document.getElementById("btn-cargar");
const btnDatos = document.getElementById("btn-datos");
const btnVolverCreditos = document.getElementById("btn-volver-creditos");
const btnMenuDesdeJuego = document.getElementById("btn-menu-desde-juego");
const mensajeGuardado = document.getElementById("mensaje-guardado");

// ============================================
// AUDIO
// ============================================
const audioDisparo = new Audio("disparo.MP3");     
const audioSacarArma = new Audio("mp3.MP3");   
const audioMeterArma = new Audio("meter-arma.MP3");   
const audioRecargar = new Audio("revolver.MP3");      
const audioSinBalas = new Audio("sin balas.MP3");
const audioRelincho = new Audio("horse-neigh-390297.MP3");
const musicaMenu = new Audio("Menu.MP3");
const musicaArea = new Audio("Ghost.mp3");

audioDisparo.volume = 0.15;
audioSacarArma.volume = 0.6;
audioMeterArma.volume = 0.6;
audioRecargar.volume = 0.3;
audioSinBalas.volume = 0.70;
audioRelincho.volume = 0.8;
musicaMenu.volume = 0.1;
musicaMenu.loop = true;
musicaArea.volume = 0.4;
musicaArea.loop = true;

// ============================================
// VARIABLES DEL JUEGO
// ============================================
let posX = 100;
let worldOffsetX = 0;
const speed = 5;
let keys = {a: false, d: false};
let frame = 0;
let lastFrameTime = 0;
const frameRate = 100;
let direccion = "derecha";
let conArma = false;
let disparando = false;
let juegoIniciado = false;

// Sistema de física y salto
let enElSuelo = true;
let velocidadY = 0;
const gravedad = 0.8;
const fuerzaSalto = -15;
const alturaSuelo = 100;

// Sistema de munición
const balasMaximas = 6;
let balasActuales = balasMaximas;
let recargando = false;
let teclaRPresionada = false;

// ============================================
// CONFIGURACIÓN DE SPRITES
// ============================================
const framesSinArma = [
  "Cowboy4_walk without gun_0.png",
  "Cowboy4_walk without gun_1.png",
  "Cowboy4_walk without gun_2.png",
  "Cowboy4_walk without gun_3.png"
];

const framesConArma = [
  "Cowboy4_walk with gun_0.png",
  "Cowboy4_walk with gun_1.png",
  "Cowboy4_walk with gun_2.png",
  "Cowboy4_walk with gun_3.png"
];

const spriteParadoSinArma = "Cowboy4_idle without gun_3.png";
const spriteParadoConArma = "Cowboy4_shoot_3.png";
const framesDisparo = [
  "Cowboy4_shoot_1.png",
  "Cowboy4_shoot_2.png",
];

// ============================================
// SISTEMA DE CASAS Y EDIFICIOS
// ============================================
const casasConfig = [
  { ruta: "image-removebg-preview (1).png", x: 500, ancho: 350, alto: 250, bottom: 58 },
  { ruta: "image-removebg-preview (2).png", x: 900, ancho: 300, alto: 250, bottom: 40},
  { ruta: "image-removebg-preview (3).png", x: 1300, ancho: 200, alto: 250, bottom: 64},
  { ruta: "image-removebg-preview (4).png", x: 1700, ancho: 350, alto: 300, bottom: 50 },
  { ruta: "image-removebg-preview (5).png", x: 2100, ancho: 190, alto: 145, bottom: 90 },
  { ruta: "image-removebg-preview (6).png", x: 2500, ancho: 300, alto: 300, bottom: 25 },
  { ruta: "image-removebg-preview (7).png", x: 2900, ancho: 300, alto: 200, bottom: 86 },
  { ruta: "image-removebg-preview (8).png", x: 3300, ancho: 250, alto: 200, bottom: 85},
  { ruta: "casa9.png", x: 3700, ancho: 205, alto: 152, bottom: 100 },
  { ruta: "casa10.png", x: 4100, ancho: 195, alto: 148, bottom: 100 },
  { ruta: "casa11.png", x: 4500, ancho: 215, alto: 158, bottom: 100 },
  { ruta: "casa12.png", x: 4900, ancho: 200, alto: 150, bottom: 100 }
];

let casasElementos = [];

function crearCasas() {
  casasElementos.forEach(casa => casa.remove());
  casasElementos = [];
  
  casasConfig.forEach((config, index) => {
    const casa = document.createElement("img");
    casa.src = config.ruta;
    casa.classList.add("casa");
    casa.style.width = config.ancho + "px";
    casa.style.height = config.alto + "px";
    casa.style.left = config.x + "px";
    casa.style.bottom = (config.bottom || 100) + "px";
    casa.setAttribute("data-pos-original", config.x);
    
    gameArea.appendChild(casa);
    casasElementos.push(casa);
  });
  
  console.log(` ${casasConfig.length} casas cargadas en el mundo`);
}

function actualizarPosicionCasas() {
  casasElementos.forEach(casa => {
    const posOriginal = parseInt(casa.getAttribute("data-pos-original"));
    const nuevaPos = posOriginal + worldOffsetX;
    casa.style.left = nuevaPos + "px";
  });
}

// ============================================
// SISTEMA DE GUARDADO
// ============================================
let partidaGuardada = null;

function guardarPartida() {
  partidaGuardada = {
    posX: posX,
    worldOffsetX: worldOffsetX,
    direccion: direccion,
    conArma: conArma,
    balasActuales: balasActuales,
    enElSuelo: enElSuelo,
    playerBottom: parseInt(player.style.bottom) || 100
  };
  
  mostrarMensajeGuardado();
}

function cargarPartida() {
  if (partidaGuardada) {
    posX = partidaGuardada.posX;
    worldOffsetX = partidaGuardada.worldOffsetX || 0;
    direccion = partidaGuardada.direccion;
    conArma = partidaGuardada.conArma;
    balasActuales = partidaGuardada.balasActuales;
    enElSuelo = partidaGuardada.enElSuelo;
    
    keys = {a: false, d: false};
    disparando = false;
    recargando = false;
    
    document.getElementById("suelo").style.transform = `translateX(${worldOffsetX}px)`;
    player.style.bottom = partidaGuardada.playerBottom + "px";
    
    iniciarJuego();
    mostrarMensaje("¡Partida cargada exitosamente!");
  } else {
    mostrarMensaje("No hay ninguna partida guardada.\n¡Juega primero para poder guardar!");
  }
}

function mostrarMensajeGuardado() {
  mensajeGuardado.classList.add("visible");
  setTimeout(() => {
    mensajeGuardado.classList.remove("visible");
  }, 2000);
}

function mostrarMensaje(mensaje) {
  alert(mensaje);
}

// ============================================
// NAVEGACIÓN ENTRE PANTALLAS
// ============================================
btnJugar.addEventListener("click", iniciarJuego);
btnCreditos.addEventListener("click", mostrarCreditos);
btnCargar.addEventListener("click", cargarPartida);
btnDatos.addEventListener("click", mostrarDatosJuego);
btnVolverCreditos.addEventListener("click", volverAlMenu);
btnMenuDesdeJuego.addEventListener("click", volverAlMenuDesdeJuego);

function iniciarJuego() {
  console.log("🎮 Iniciando juego...");
  
  detenerMusicaMenu();
  
  menuPrincipal.classList.add("oculto");
  pantallaCreditos.classList.remove("visible");
  gameArea.classList.add("activo");
  btnMenuDesdeJuego.classList.add("visible");
  
  player.style.left = posX + "px";
  player.style.bottom = alturaSuelo + "px";
  
  crearCasas();
  
  //  CREAR NPC
  if (typeof crearNPC !== 'undefined') {
    crearNPC();
  }
  
  if (!juegoIniciado) {
    juegoIniciado = true;
    console.log("🔄 Loop de animación iniciado");
    requestAnimationFrame(animar);
  }
  
  actualizarContadorBalas();
  
  // 💚 INICIALIZAR SISTEMA DE VIDA
  console.log("💚 Intentando inicializar sistema de vida...");
  if (typeof inicializarSistemaVida !== 'undefined') {
    inicializarSistemaVida();
    console.log("✅ Sistema de vida inicializado correctamente");
  } else {
    console.error("❌ ERROR: inicializarSistemaVida no está definida");
    console.error("Verifica que 7.js esté cargado en el HTML");
  }
  
  console.log("✅ Juego listo - Presiona E para hablar con el NPC");
}

function mostrarCreditos() {
  menuPrincipal.classList.add("oculto");
  pantallaCreditos.classList.add("visible");
}

function mostrarDatosJuego() {
  alert(`THE LAST SHERIFF - DEMO\n\n• Movimiento: A/D o Flechas\n• Sacar arma: 1\n• Disparar: F\n• Recargar: R\n• Hablar con NPC: E\n• Saltar: W o Espacio\n•  Congelar enemigos: 3 (10 seg)\n\n💚 VIDA: 5 corazones\n🐴 ÚLTIMA BALA = CABALLO ÉPICO!\n\n¡Buena suerte, Sheriff!`);
}

function volverAlMenu() {
  iniciarMusicaMenu();
  
  if (typeof limpiarSistemaEnemigos !== 'undefined') {
    limpiarSistemaEnemigos();
  }
  
  if (typeof limpiarSistemaJefe !== 'undefined') {
    limpiarSistemaJefe();
  }
  
  if (typeof limpiarNPC !== 'undefined') {
    limpiarNPC();
  }
  
  // 💚 LIMPIAR SISTEMA DE VIDA
  if (typeof limpiarSistemaVida !== 'undefined') {
    limpiarSistemaVida();
  }
  
  menuPrincipal.classList.remove("oculto");
  pantallaCreditos.classList.remove("visible");
  gameArea.classList.remove("activo");
  btnMenuDesdeJuego.classList.remove("visible");
  
  juegoIniciado = false;
}

function volverAlMenuDesdeJuego() {
  guardarPartida();
  volverAlMenu();
}

// ============================================
// SISTEMA DE MUNICIÓN
// ============================================
function actualizarContadorBalas() {
  let contador = document.getElementById("contador-balas");
  if (!contador) {
    contador = document.createElement("div");
    contador.id = "contador-balas";
    contador.className = "contador-balas";
    gameArea.appendChild(contador);
  }
  
  if (conArma) {
    if (recargando) {
      contador.textContent = "🔄 RECARGANDO...";
      contador.style.color = "#FFA500";
    } else {
      if (balasActuales === 1) {
        contador.textContent = `🐴 CABALLO LISTO: ${balasActuales}/${balasMaximas}`;
        contador.style.color = "#FFD700";
      } else {
        contador.textContent = `🔫 BALAS: ${balasActuales}/${balasMaximas}`;
        contador.style.color = balasActuales === 0 ? "#FF0000" : "#FFD700";
      }
    }
    contador.style.display = "block";
  } else {
    contador.style.display = "none";
  }
}

function recargar() {
  if (recargando || balasActuales === balasMaximas) return;
  
  recargando = true;
  audioRecargar.currentTime = 0;
  audioRecargar.play();
  actualizarContadorBalas();
  
  setTimeout(() => {
    balasActuales = balasMaximas;
    recargando = false;
    actualizarContadorBalas();
  }, 1600);
}

// ============================================
// SISTEMA DE DISPARO CON CABALLO ÉPICO 
// ============================================
function disparar() {
  if (recargando) return;
  
  if (balasActuales <= 0) {
    audioSinBalas.currentTime = 0;
    audioSinBalas.play();
    console.log("¡Click! No hay balas");
    return;
  }
  
  const esUltimaBala = balasActuales === 1;
  
  balasActuales--;
  actualizarContadorBalas();
  
  if (esUltimaBala) {
    audioRelincho.currentTime = 0;
    audioRelincho.play();
    console.log("🐴 ¡RELINCHOOOO!");
  } else {
    audioDisparo.currentTime = 0;
    audioDisparo.play();
  }
  
  const proyectil = document.createElement(esUltimaBala ? "img" : "div");
  
  if (esUltimaBala) {
    proyectil.src = "pixeles ló.png";
    proyectil.style.width = "200px";
    proyectil.style.height = "200px";
    proyectil.style.position = "absolute";
    proyectil.style.zIndex = "15";
    proyectil.style.imageRendering = "pixelated";
    proyectil.classList.add("caballo-proyectil");
    console.log("🐴 Disparo de CABALLO");
  } else {
    proyectil.classList.add("bala");
  }
  
  const offsetX = direccion === "derecha" ? 45 : -10;
  const offsetY = esUltimaBala ? -50 : 51;
  
  proyectil.style.left = (posX + offsetX) + "px";
  proyectil.style.top = (player.offsetTop + offsetY) + "px";
  gameArea.appendChild(proyectil);
  
  const velocidadProyectil = esUltimaBala ? 20 : 15;
  const direccionProyectil = direccion === "derecha" ? 1 : -1;
  
  if (esUltimaBala) {
    proyectil.style.transform = direccion === "izquierda" ? "scaleX(-1)" : "scaleX(1)";
  }
  
  function moverProyectil() {
    if (!gameArea.classList.contains("activo")) {
      proyectil.remove();
      return;
    }
    
    let x = parseInt(proyectil.style.left);
    x += velocidadProyectil * direccionProyectil;
    proyectil.style.left = x + "px";
    
    if (x < -300 || x > window.innerWidth + 300) {
      proyectil.remove();
    } else {
      requestAnimationFrame(moverProyectil);
    }
  }
  moverProyectil();
}

// ============================================
// FUNCIÓN ANIMAR (LOOP PRINCIPAL)
// ============================================
function animar(timestamp) {
  if (!gameArea.classList.contains("activo")) {
    juegoIniciado = false;
    console.log("⏸ Juego pausado");
    return;
  }

  let moviendo = false;
  const centerX = window.innerWidth / 2;
  const minPosX = 50;
  const maxPosX = window.innerWidth - 100;
  
  const offsetAnterior = worldOffsetX;
  
  if (keys.d) {
    direccion = "derecha";
    moviendo = true;
    
    if (posX >= centerX && worldOffsetX > -2000) {
      worldOffsetX -= speed;
    } else if (posX < maxPosX) {
      posX += speed;
    }
  }
  
  if (keys.a) {
    direccion = "izquierda";
    moviendo = true;
    
    if (posX <= centerX && worldOffsetX < 2000) {
      worldOffsetX += speed;
    } else if (posX > minPosX) {
      posX -= speed;
    }
  }
  
  if (offsetAnterior !== worldOffsetX) {
    const suelo = document.getElementById("suelo");
    if (suelo) {
      suelo.style.transform = `translateX(${worldOffsetX}px)`;
    }
    
    actualizarPosicionCasas();
  }
  
  if (typeof actualizarNPC !== 'undefined') {
    actualizarNPC();
  }
  
  if (typeof verificarProgresoMision !== 'undefined') {
    verificarProgresoMision();
  }
  
  if (typeof actualizarEnemigos !== 'undefined') {
    actualizarEnemigos(timestamp);
    verificarColisionesBalas();
  }
  
  if (typeof actualizarJefeFinal !== 'undefined') {
    actualizarJefeFinal(timestamp);
    verificarColisionesBalasConJefe();
  }
  
  player.style.left = posX + "px";
  player.style.transform = direccion === "izquierda" ? "scaleX(-1)" : "scaleX(1)";
  
  if (!enElSuelo) {
    velocidadY += gravedad;
    let currentBottom = parseInt(player.style.bottom) || alturaSuelo;
    currentBottom -= velocidadY;
    
    if (currentBottom <= alturaSuelo) {
      currentBottom = alturaSuelo;
      velocidadY = 0;
      enElSuelo = true;
    }
    
    player.style.bottom = currentBottom + "px";
  }
  
  if (disparando) {
    if (timestamp - lastFrameTime > frameRate) {
      frame = (frame + 1) % framesDisparo.length;
      player.src = framesDisparo[frame];
      lastFrameTime = timestamp;
      if (frame === framesDisparo.length - 1) disparando = false;
    }
  } else if (moviendo) {
    if (timestamp - lastFrameTime > frameRate) {
      frame = (frame + 1) % (conArma ? framesConArma.length : framesSinArma.length);
      player.src = conArma ? framesConArma[frame] : framesSinArma[frame];
      lastFrameTime = timestamp;
    }
  } else {
    player.src = conArma ? spriteParadoConArma : spriteParadoSinArma;
  }
  
  requestAnimationFrame(animar);
}

// ============================================
// CONTROLES DEL TECLADO
// ============================================
document.addEventListener("keydown", function(e) {
  if (!gameArea.classList.contains("activo")) return;
  
  const key = e.key.toLowerCase();
  
  if (key === "d" || key === "arrowright") {
    keys.d = true;
  }
  if (key === "a" || key === "arrowleft") {
    keys.a = true;
  }
  
  if (key === "1") {
    conArma = !conArma;
    
    if (conArma) {
      audioSacarArma.currentTime = 0;
      audioSacarArma.play();
    } else {
      audioMeterArma.currentTime = 0;
      audioMeterArma.play();
    }
    
    actualizarContadorBalas();
    
    // 💚 ACTUALIZAR CORAZONES
    if (typeof actualizarCorazones !== 'undefined') {
      actualizarCorazones();
    }
  }
  
  if (key === "e") {
    if (typeof interactuarConNPC !== 'undefined') {
      interactuarConNPC();
    }
  }
  
  if (key === "3") {
    if (typeof congelarEnemigos !== 'undefined') {
      congelarEnemigos();
      console.log("❄️ ¡CONGELANDO ENEMIGOS!");
    }
  }
  
  if (key === "f" && conArma && !disparando && !recargando) {
    disparando = true;
    disparar();
  }
  
  if (key === "r" && conArma && !teclaRPresionada) {
    teclaRPresionada = true;
    recargar();
  }
  
  if ((key === "w" || key === " ") && enElSuelo) {
    velocidadY = fuerzaSalto;
    enElSuelo = false;
    e.preventDefault();
  }
});

document.addEventListener("keyup", function(e) {
  const key = e.key.toLowerCase();
  if (key === "d" || key === "arrowright") keys.d = false;
  if (key === "a" || key === "arrowleft") keys.a = false;
  if (key === "r") teclaRPresionada = false;
});

// ============================================
// SISTEMA DE MÚSICA DE FONDO
// ============================================
function iniciarMusicaMenu() {
  musicaMenu.play().catch(error => {
    console.log("🎵 La música necesita interacción del usuario para reproducirse");
  });
}

function detenerMusicaMenu() {
  musicaMenu.pause();
  musicaMenu.currentTime = 0;
}

document.addEventListener("click", function iniciarAudio() {
  if (menuPrincipal.classList.contains("oculto") === false) {
    iniciarMusicaMenu();
  }
  document.removeEventListener("click", iniciarAudio);
}, { once: true });

console.log("🎮 THE LAST SHERIFF - Juego cargado correctamente");
console.log("🎯 Controles: A/D, 1 Arma, F Disparar, R Recargar, E Hablar, W Saltar");
console.log("❄️ Presiona 3 para congelar enemigos por 10 segundos");
console.log("💬 Presiona E cerca del NPC para hablar");