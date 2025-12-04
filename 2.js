// ============================================
// ELEMENTOS DEL DOM
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
    
    // Resetear estado de teclas
    keys = {a: false, d: false};
    disparando = false;
    recargando = false;
    
    // Restaurar posición del suelo y jugador
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
  menuPrincipal.classList.add("oculto");
  pantallaCreditos.classList.remove("visible");
  gameArea.classList.add("activo");
  btnMenuDesdeJuego.classList.add("visible");
  
  // Iniciar loop de animación si no está corriendo
  if (!juegoIniciado) {
    juegoIniciado = true;
    requestAnimationFrame(animar);
  }
  
  actualizarContadorBalas();
}

function mostrarCreditos() {
  menuPrincipal.classList.add("oculto");
  pantallaCreditos.classList.add("visible");
}

function mostrarDatosJuego() {
  alert(`THE LAST SHERIFF - DEMO\n\n• Movimiento: A/D o Flechas\n• Sacar arma: 1\n• Disparar: F\n• Recargar: R\n• Saltar: Espacio\n\n¡Buena suerte, Sheriff!`);
}

function volverAlMenu() {
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
// CONFIGURACIÓN DEL JUEGO
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

// Variables del juego
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
const balasMaximas = 60;
let balasActuales = balasMaximas;
let recargando = false;
// ============================================
// SISTEMA DE MUNICIÓN 🔫
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
      contador.textContent = " RECARGANDO...";
      contador.style.color = "#FFA500";
    } else {
      contador.textContent = ` BALAS: ${balasActuales}/${balasMaximas}`;
      contador.style.color = balasActuales === 0 ? "#FF0000" : "#FFD700";
    }
    contador.style.display = "block";
  } else {
    contador.style.display = "none";
  }
}

function recargar() {
  if (recargando || balasActuales === balasMaximas) return;
  
  recargando = true;
  actualizarContadorBalas();
  
  setTimeout(() => {
    balasActuales = balasMaximas;
    recargando = false;
    actualizarContadorBalas();
  }, 2000);
}

// ============================================
// 🎯 SISTEMA DE DISPARO
// ============================================
function disparar() {
  if (balasActuales <= 0 || recargando) return;
  
  balasActuales--;
  actualizarContadorBalas();
  
  const bala = document.createElement("div");
  bala.classList.add("bala");
  
  const offsetX = direccion === "derecha" ? 45 : -10;
  const offsetY = 20; // Ajuste para que salga del arma
  
  bala.style.left = (posX + offsetX) + "px";
  bala.style.top = (player.offsetTop + offsetY) + "px";
  gameArea.appendChild(bala);
  
  const velocidadBala = 15;
  const direccionBala = direccion === "derecha" ? 1 : -1;
  
  function moverBala() {
    if (!gameArea.classList.contains("activo")) {
      bala.remove();
      return;
    }
    
    let x = parseInt(bala.style.left);
    x += velocidadBala * direccionBala;
    bala.style.left = x + "px";
    
    // Eliminar bala si sale de la pantalla
    if (x < -50 || x > window.innerWidth + 50) {
      bala.remove();
    } else {
      requestAnimationFrame(moverBala);
    }
  }
  moverBala();
}

// ============================================
// FUNCIÓN ANIMAR (LOOP PRINCIPAL DEL JUEGO)
// ============================================
function animar(timestamp) {
  if (!gameArea.classList.contains("activo")) {
    return;
  }

  let moviendo = false;
  const centerX = window.innerWidth / 2;
  
  // Límites para el movimiento del personaje
  const minPosX = 50;
  const maxPosX = window.innerWidth - 100;
  
  // Movimiento horizontal
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
  
  // Aplicar transformación al suelo
  document.getElementById("suelo").style.transform = `translateX(${worldOffsetX}px)`;
  player.style.left = posX + "px";
  player.style.transform = direccion === "izquierda" ? "scaleX(-1)" : "scaleX(1)";
  
  // Sistema de física y salto
  if (!enElSuelo) {
    velocidadY += gravedad;
    let currentBottom = parseInt(player.style.bottom) || alturaSuelo;
    currentBottom += velocidadY;
    player.style.bottom = currentBottom + "px";
    
    // Verificar si tocó el suelo
    if (currentBottom <= alturaSuelo) {
      player.style.bottom = alturaSuelo + "px";
      velocidadY = 0;
      enElSuelo = true;
    }
  }
  
  // Animaciones del personaje
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
let teclaRPresionada = false;

document.addEventListener("keydown", function(e) {
  if (!gameArea.classList.contains("activo")) return;
  
  const key = e.key.toLowerCase();
  
  // Movimiento
  if (key === "d" || key === "arrowright") keys.d = true;
  if (key === "a" || key === "arrowleft") keys.a = true;
  
  // Acciones
  if (key === "1") {
    conArma = !conArma;
    actualizarContadorBalas();
  }
  
  if (key === "f" && conArma && !disparando && !recargando) {
    disparando = true;
    disparar();
  }
  
  if (key === "r" && conArma && !teclaRPresionada) {
    teclaRPresionada = true;
    recargar();
  }
  
  // Salto
  if (key === " " && enElSuelo) {
    velocidadY = fuerzaSalto;
    enElSuelo = false;
  }
});

document.addEventListener("keyup", function(e) {
  const key = e.key.toLowerCase();
  if (key === "d" || key === "arrowright") keys.d = false;
  if (key === "a" || key === "arrowleft") keys.a = false;
  if (key === "r") teclaRPresionada = false;
});

// ============================================
// INICIALIZACIÓN
// ============================================
console.log("THE LAST SHERIFF - Juego cargado correctamente");
console.log("Controles: A/D Movimiento, 1 Arma, F Disparar, R Recargar, Espacio Saltar");