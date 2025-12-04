// ============================================
// SISTEMA DEL JEFE FINAL - THE LAST SHERIFF
// ============================================

// Variables globales del jefe
if (typeof window.jefeFinal === 'undefined') {
  window.jefeFinal = null;
}
if (typeof window.jefeDerrotado === 'undefined') {
  window.jefeDerrotado = false;
}
if (typeof window.balasJefe === 'undefined') {
  window.balasJefe = [];
}

// Audio del jefe
const audioAparicionJefe = new Audio("Ghost.mp3");
const audioMuerteJefe = new Audio("WhatsApp Video 2025-11-22 at 4.27.47 PM.mp3");
const audioDisparoJefe = new Audio("disparo.MP3");
const audioVictoria = new Audio("Voicy_+respect.mp3");

audioAparicionJefe.volume = 0.6;
audioMuerteJefe.volume = 0.7;
audioDisparoJefe.volume = 0.3;
audioVictoria.volume = 0.8;

// Sprites del jefe
const jefeSprites = {
  caminar: ["1 ca.png", "2 ca.png", "3 ca.png", "4 ca.png", "5 ca.png", "6 ca.png", "7 ca.png", "8 ca.png"],
  disparo: ["1 (1).png", "2.png", "3.png", "4.png", "5.png"],
  muerte: ["muerte_1.png", "muerte_2.png", "muerte_3.png", "muerte_4.png", "muerte_5.png", "muerte_6.png"]
};

// Configuración del jefe
const JEFE_CONFIG = {
  vidaMaxima: 20,
  velocidad: 3,
  rangoDeteccion: 600,
  rangoDisparoMin: 250,
  rangoDisparoMax: 450,
  tiempoEntreDisparos: 600,
  anchoSprite: 120,
  altoSprite: 140
};

// ============================================
// CLASE JEFE FINAL
// ============================================
class JefeFinal {
  constructor(x) {
    this.x = x;
    this.y = 100;
    this.vida = JEFE_CONFIG.vidaMaxima;
    this.vidaMaxima = JEFE_CONFIG.vidaMaxima;
    this.velocidad = JEFE_CONFIG.velocidad;
    this.direccion = "izquierda";
    this.estado = "caminar";
    this.ultimoDisparo = 0;
    this.frameActual = 0;
    this.ultimoFrameTime = 0;
    this.elemento = null;
    this.barraVida = null;
    this.muerto = false;
    this.muriendo = false;
    this.congelado = false;
    
    this.patronAtaque = 0;
    this.tiempoPatron = 0;
    this.disparosRafaga = 0;
    
    this.crearElemento();
    this.crearBarraVida();
    
    audioAparicionJefe.currentTime = 0;
    audioAparicionJefe.play().catch(() => {});
    
    console.log(" ¡EL JEFE FINAL HA APARECIDO!");
  }
  
  crearElemento() {
    this.elemento = document.createElement("img");
    this.elemento.className = "jefe-final";
    this.elemento.src = jefeSprites.caminar[0];
    this.elemento.style.width = JEFE_CONFIG.anchoSprite + "px";
    this.elemento.style.height = JEFE_CONFIG.altoSprite + "px";
    this.elemento.style.left = this.x + "px";
    this.elemento.style.bottom = this.y + "px";
    this.elemento.style.position = "absolute";
    this.elemento.style.zIndex = "12";
    this.elemento.style.imageRendering = "pixelated";
    
    gameArea.appendChild(this.elemento);
  }
  
  crearBarraVida() {
    this.barraVida = document.createElement("div");
    this.barraVida.style.position = "fixed";
    this.barraVida.style.top = "20px";
    this.barraVida.style.left = "50%";
    this.barraVida.style.transform = "translateX(-50%)";
    this.barraVida.style.width = "500px";
    this.barraVida.style.height = "40px";
    this.barraVida.style.background = "rgba(0, 0, 0, 0.8)";
    this.barraVida.style.border = "3px solid #FFD700";
    this.barraVida.style.borderRadius = "10px";
    this.barraVida.style.padding = "5px";
    this.barraVida.style.zIndex = "2000";
    
    this.barraVidaInterior = document.createElement("div");
    this.barraVidaInterior.style.width = "100%";
    this.barraVidaInterior.style.height = "100%";
    this.barraVidaInterior.style.background = "linear-gradient(to right, #ff0000, #ff6600)";
    this.barraVidaInterior.style.borderRadius = "5px";
    this.barraVidaInterior.style.transition = "width 0.3s";
    this.barraVidaInterior.style.boxShadow = "0 0 20px rgba(255, 0, 0, 0.8)";
    
    this.nombreJefe = document.createElement("div");
    this.nombreJefe.textContent = " JEFE FINAL ";
    this.nombreJefe.style.position = "absolute";
    this.nombreJefe.style.top = "-25px";
    this.nombreJefe.style.left = "50%";
    this.nombreJefe.style.transform = "translateX(-50%)";
    this.nombreJefe.style.color = "#FFD700";
    this.nombreJefe.style.fontFamily = "'Press Start 2P', cursive";
    this.nombreJefe.style.fontSize = "14px";
    this.nombreJefe.style.textShadow = "2px 2px 4px rgba(0,0,0,0.8)";
    this.nombreJefe.style.whiteSpace = "nowrap";
    
    this.barraVida.appendChild(this.barraVidaInterior);
    this.barraVida.appendChild(this.nombreJefe);
    gameArea.appendChild(this.barraVida);
  }
  
  actualizarBarraVida() {
    const porcentajeVida = (this.vida / this.vidaMaxima) * 100;
    this.barraVidaInterior.style.width = porcentajeVida + "%";
    
    if (porcentajeVida > 50) {
      this.barraVidaInterior.style.background = "linear-gradient(to right, #ff0000, #ff6600)";
    } else if (porcentajeVida > 25) {
      this.barraVidaInterior.style.background = "linear-gradient(to right, #ff6600, #ffaa00)";
    } else {
      this.barraVidaInterior.style.background = "linear-gradient(to right, #ff0000, #ff0000)";
    }
  }
  
  recibeDaño(cantidad = 1) {
    this.vida -= cantidad;
    this.actualizarBarraVida();
    
    this.elemento.style.filter = "brightness(3)";
    setTimeout(() => {
      if (this.elemento) this.elemento.style.filter = "brightness(1)";
    }, 100);
    
    if (this.vida <= 0) this.morir();
  }
  
  morir() {
    if (this.muriendo) return;
    this.muriendo = true;
    this.estado = "muerte";
    this.frameActual = 0;
    window.jefeDerrotado = true;
    
    audioAparicionJefe.pause();
    audioAparicionJefe.currentTime = 0;
    audioMuerteJefe.currentTime = 0;
    audioMuerteJefe.play().catch(() => {});
    
    console.log(" ¡JEFE FINAL DERROTADO!");
    
    if (this.barraVida) {
      this.barraVida.style.transition = "opacity 1s";
      this.barraVida.style.opacity = "0";
      setTimeout(() => {
        if (this.barraVida && this.barraVida.parentNode) this.barraVida.remove();
      }, 1000);
    }
    
    setTimeout(() => {
      this.muerto = true;
      if (this.elemento && this.elemento.parentNode) {
        this.elemento.style.transition = "opacity 2s";
        this.elemento.style.opacity = "0";
        setTimeout(() => {
          if (this.elemento && this.elemento.parentNode) this.elemento.remove();
          mostrarPantallaVictoria();
        }, 2000);
      }
    }, 900);
  }
  
  actualizar(timestamp) {
    if (this.muerto) return;
    if (this.muriendo) {
      this.actualizarSprite(timestamp);
      this.actualizarPosicion();
      return;
    }
    
    const distanciaX = (posX - worldOffsetX) - (this.x + worldOffsetX);
    const ahora = Date.now();
    
    //  MOVIMIENTO "ESPEJO"
    this.estado = "caminar";
    this.direccion = distanciaX > 0 ? "derecha" : "izquierda";
    if (distanciaX !== 0) this.x += distanciaX > 0 ? this.velocidad : -this.velocidad;
    
    //  LÍMITES DEL MAPA
    const limiteIzquierdo = -worldOffsetX - 300;
    const limiteDerecho = -worldOffsetX + 300;
    if (this.x < limiteIzquierdo) this.x = limiteIzquierdo;
    if (this.x > limiteDerecho) this.x = limiteDerecho;
    
    // Patrón de ataque
    if (ahora - this.tiempoPatron > 3000) {
      this.patronAtaque = Math.floor(Math.random() * 3);
      this.tiempoPatron = ahora;
      this.disparosRafaga = 0;
    }
    
    if (this.patronAtaque === 1 && this.disparosRafaga < 4) {
      this.estado = "disparo";
      if (ahora - this.ultimoDisparo > 300) {
        this.disparar();
        this.ultimoDisparo = ahora;
        this.disparosRafaga++;
      }
    } else if (this.patronAtaque === 2) {
      this.estado = "caminar";
      if (posX > this.x + worldOffsetX) {
        if (this.x > limiteIzquierdo + 100) this.x -= this.velocidad * 1.5;
      } else {
        if (this.x < limiteDerecho - 100) this.x += this.velocidad * 1.5;
      }
      if (ahora - this.ultimoDisparo > JEFE_CONFIG.tiempoEntreDisparos) {
        this.disparar();
        this.ultimoDisparo = ahora;
      }
    } else {
      // PATRÓN 0 → movimiento espejo ya aplicado arriba
      if (Math.abs(distanciaX) >= JEFE_CONFIG.rangoDisparoMin && 
          Math.abs(distanciaX) <= JEFE_CONFIG.rangoDisparoMax) {
        if (ahora - this.ultimoDisparo > JEFE_CONFIG.tiempoEntreDisparos) {
          this.disparar();
          this.ultimoDisparo = ahora;
        }
        this.estado = "disparo";
      }
    }
    
    this.actualizarSprite(timestamp);
    this.actualizarPosicion();
  }
  
  actualizarSprite(timestamp) {
    if (timestamp - this.ultimoFrameTime > 80) {
      let frames;
      if (this.estado === "muerte") {
        frames = jefeSprites.muerte;
        if (this.frameActual < frames.length - 1) this.frameActual++;
      } else if (this.estado === "disparo") {
        frames = jefeSprites.disparo;
        this.frameActual = (this.frameActual + 1) % frames.length;
      } else {
        frames = jefeSprites.caminar;
        this.frameActual = (this.frameActual + 1) % frames.length;
      }
      this.elemento.src = frames[this.frameActual];
      this.ultimoFrameTime = timestamp;
    }
  }
  
  actualizarPosicion() {
    const nuevaPos = this.x + worldOffsetX;
    this.elemento.style.left = nuevaPos + "px";
    this.elemento.style.transform = this.direccion === "derecha" ? "scaleX(1)" : "scaleX(-1)";
  }
  
  disparar() {
    const offsetX = this.direccion === "derecha" ? 60 : -10;
    
    const distanciaAlJugador = Math.abs((posX - worldOffsetX) - this.x);
    // Ajustamos velocidad de bala según distancia
    let velocidadBala = 12; // velocidad base
    if (distanciaAlJugador > JEFE_CONFIG.rangoDisparoMax) {
        velocidadBala = 18; // muy lejos → rápido
    } else if (distanciaAlJugador < JEFE_CONFIG.rangoDisparoMin) {
        velocidadBala = 6;  // muy cerca → lento
    }

    const bala = {
      x: this.x + worldOffsetX + offsetX,
      y: this.y + 60,
      direccion: this.direccion,
      velocidad: velocidadBala,
      worldOffsetInicial: worldOffsetX,
      elemento: document.createElement("div")
    };
    
    bala.elemento.className = "bala-jefe";
    bala.elemento.style.width = "25px";
    bala.elemento.style.height = "10px";
    bala.elemento.style.background = "rgb(255, 0, 0)";
    bala.elemento.style.position = "absolute";
    bala.elemento.style.borderRadius = "50%";
    bala.elemento.style.zIndex = "11";
    bala.elemento.style.boxShadow = "0 0 15px rgba(255, 0, 0, 1)";
    bala.elemento.style.left = bala.x + "px";
    bala.elemento.style.bottom = bala.y + "px";
    
    gameArea.appendChild(bala.elemento);
    window.balasJefe.push(bala);
    
    const sonido = audioDisparoJefe.cloneNode();
    sonido.volume = 0.3;
    sonido.play().catch(() => {});
}

  
  getBounds() {
    return {
      x: this.x + worldOffsetX,
      y: this.y,
      width: JEFE_CONFIG.anchoSprite,
      height: JEFE_CONFIG.altoSprite
    };
  }
}

// ============================================
// ACTUALIZAR SISTEMA DEL JEFE
// ============================================
function actualizarJefeFinal(timestamp) {
  if (window.jefeFinal && !window.jefeFinal.muerto) {
    window.jefeFinal.actualizar(timestamp);
  }
  
  window.balasJefe = window.balasJefe.filter(bala => {
    const direccionMov = bala.direccion === "derecha" ? 1 : -1;
    bala.x += bala.velocidad * direccionMov;
    bala.elemento.style.left = bala.x + "px";
    
    if (bala.x < -50 || bala.x > window.innerWidth + 50) {
      bala.elemento.remove();
      return false;
    }
    
    if (typeof detectarColisionConJugador !== 'undefined' && detectarColisionConJugador(bala)) {
      bala.elemento.remove();
      if (typeof recibirDañoJugador !== 'undefined') recibirDañoJugador();
      return false;
    }
    
    return true;
  });
}

// ============================================
// COLISIONES CON EL JEFE
// ============================================
function verificarColisionesBalasConJefe() {
  if (!window.jefeFinal || window.jefeFinal.muerto || window.jefeFinal.muriendo) return;
  
  const balasJugador = document.querySelectorAll(".bala, .caballo-proyectil");
  
  balasJugador.forEach(bala => {
    const balaRect = {
      x: parseInt(bala.style.left),
      y: window.innerHeight - parseInt(bala.style.top || bala.style.bottom || 0),
      width: 20,
      height: 7
    };
    
    const jefeRect = window.jefeFinal.getBounds();
    
    if (typeof hayColision !== 'undefined' && hayColision(balaRect, jefeRect)) {
      const daño = bala.classList.contains('caballo-proyectil') ? 3 : 1;
      window.jefeFinal.recibeDaño(daño);
      bala.remove();
    }
  });
}

// ============================================
// PANTALLA DE VICTORIA
// ============================================
function mostrarPantallaVictoria() {
  audioVictoria.currentTime = 0;
  audioVictoria.play().catch(() => {});
  
  const pantallaVictoria = document.createElement("div");
  pantallaVictoria.style.position = "fixed";
  pantallaVictoria.style.top = "0";
  pantallaVictoria.style.left = "0";
  pantallaVictoria.style.width = "100vw";
  pantallaVictoria.style.height = "100vh";
  pantallaVictoria.style.background = "rgba(0, 0, 0, 0.9)";
  pantallaVictoria.style.display = "flex";
  pantallaVictoria.style.flexDirection = "column";
  pantallaVictoria.style.justifyContent = "center";
  pantallaVictoria.style.alignItems = "center";
  pantallaVictoria.style.zIndex = "3000";
  
  const titulo = document.createElement("h1");
  titulo.textContent = "¿VICTORIA?";
  titulo.style.fontFamily = "'UnifrakturMaguntia', cursive";
  titulo.style.fontSize = "5rem";
  titulo.style.color = "#FFD700";
  titulo.style.textShadow = "0 0 30px rgba(255, 215, 0, 1)";
  titulo.style.marginBottom = "2rem";
  
  const mensaje = document.createElement("p");
  mensaje.textContent = "PROXIMAMENTE CAP 2 EN EL AÑO 2027";
  mensaje.style.fontFamily = "'Press Start 2P', cursive";
  mensaje.style.fontSize = "1.2rem";
  mensaje.style.color = "#FFFFFF";
  mensaje.style.textAlign = "center";
  mensaje.style.maxWidth = "600px";
  mensaje.style.lineHeight = "2";
  mensaje.style.marginBottom = "2rem";
  
  const videoContainer = document.createElement("div");
  videoContainer.style.width = "640px";
  videoContainer.style.height = "360px";
  videoContainer.style.border = "5px solid #FFD700";
  videoContainer.style.borderRadius = "10px";
  videoContainer.style.overflow = "hidden";
  videoContainer.style.boxShadow = "0 0 30px rgba(255, 215, 0, 0.8)";
  videoContainer.style.display = "none";
  
  const video = document.createElement("video");
  video.style.width = "100%";
  video.style.height = "100%";
  video.style.objectFit = "cover";
  video.controls = true;
  
  const source = document.createElement("source");
  source.src = "Meme de Neco arc ya me voy señores se acabo este baile.mp4";
  source.type = "video/mp4";
  
  video.appendChild(source);
  videoContainer.appendChild(video);
  
  const countdown = document.createElement("div");
  countdown.textContent = "El video se reproducirá en: 5s";
  countdown.style.fontFamily = "'Press Start 2P', cursive";
  countdown.style.color = "#FFD700";
  countdown.style.marginTop = "1rem";
  
  pantallaVictoria.appendChild(titulo);
  pantallaVictoria.appendChild(mensaje);
  pantallaVictoria.appendChild(videoContainer);
  pantallaVictoria.appendChild(countdown);
  
  document.body.appendChild(pantallaVictoria);
  
  let segundos = 10;
  const interval = setInterval(() => {
    segundos--;
    countdown.textContent = `El video se reproducirá en: ${segundos}s`;
    if (segundos <= 0) {
      clearInterval(interval);
      countdown.style.display = "none";
      videoContainer.style.display = "block";
      video.play().catch(() => {});
    }
  }, 1000);
}


// ============================================
// LIMPIAR SISTEMA DEL JEFE
// ============================================
function limpiarSistemaJefe() {
  if (window.jefeFinal) {
    if (window.jefeFinal.elemento && window.jefeFinal.elemento.parentNode) {
      window.jefeFinal.elemento.remove();
    }
    if (window.jefeFinal.barraVida && window.jefeFinal.barraVida.parentNode) {
      window.jefeFinal.barraVida.remove();
    }
    window.jefeFinal = null;
  }
  
  window.balasJefe.forEach(b => b.elemento && b.elemento.remove());
  window.balasJefe = [];
  window.jefeDerrotado = false;
}

console.log(" Sistema del Jefe Final cargado");
console.log(" Límites del mapa: Dinámicos con prevención de salida");
console.log(" Vida del jefe: 20 HP | Tamaño: 120x140px");
console.log(" 3 patrones de ataque + límites inteligentes");