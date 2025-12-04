

// ============================================
// AUDIO DE ENEMIGOS
// ============================================
const audioMuerteEnemigo = new Audio("WhatsApp Video 2025-11-22 at 4.27.47 PM.mp3");
audioMuerteEnemigo.volume = 0.5;

//  AUDIO DE CONGELAMIENTO
const audioCongelar = new Audio("the world.mp3");
audioCongelar.volume = 0.7;

//  VARIABLES DE CONGELAMIENTO
let enemigosCongelados = false;
let tiempoCongelamiento = 0;

// Configuración de sprites del enemigo (frames individuales)
const enemigoSprites = {
  idle: [
    "IMG-20251124-WA0159.png",
    "IMG-20251124-WA0163.png"
  ],
  ataque: [
    "IMG-20251124-WA0161.png",
    "IMG-20251124-WA0158.png",
    "IMG-20251124-WA0162.png",
    "IMG-20251124-WA0162-1.png"
  ],
  muerte: [
    "IMG-20251124-WA0164.png",
    "IMG-20251124-WA0165.png",
    "IMG-20251124-WA0166.png",
    "IMG-20251124-WA0167.png",
    "IMG-20251124-WA0168.png",
    "IMG-20251124-WA0169.png",
  ]
};

// Arrays de enemigos
let enemigos = [];
let balasEnemigos = [];
let enemigosEliminados = 0;
let oleadaActual = 0;
const maxOleadas = 4;
const enemigosPorOleada = 5;

// Configuración de enemigos
const ENEMIGO_CONFIG = {
  vidaMaxima: 3,
  velocidad: 2,
  rangoDeteccion: 500,
  rangoDisparoMin: 200,
  rangoDisparoMax: 400,
  tiempoEntreDisparosMin: 1500,
  tiempoEntreDisparosMax: 3000,
  anchoSprite: 70,
  altoSprite: 85
};

// ============================================
//  LÍMITES DEL MAPA PARA ENEMIGOS
// ============================================
const LIMITES_MAPA = {
  izquierdo: -500,    // Límite izquierdo relativo al worldOffset
  derecho: 500       // Límite derecho relativo al worldOffset
};

// ============================================
//  FUNCIÓN PARA CONGELAR ENEMIGOS
// ============================================
function congelarEnemigos() {
  if (enemigosCongelados) {
    console.log(" Los enemigos ya están congelados");
    return;
  }
  
  enemigosCongelados = true;
  console.log(" ¡ENEMIGOS CONGELADOS!");
  
  audioCongelar.currentTime = 0;
  audioCongelar.play().catch(err => console.log("No se pudo reproducir audio de congelamiento"));
  
  enemigos.forEach(enemigo => {
    if (!enemigo.muerto && enemigo.elemento) {
      enemigo.elemento.style.filter = "brightness(0.7) sepia(1) hue-rotate(180deg) saturate(3)";
      enemigo.congelado = true;
    }
  });
  
  balasEnemigos.forEach(bala => {
    if (bala.elemento) {
      bala.elemento.style.filter = "brightness(0.7) sepia(1) hue-rotate(180deg) saturate(3)";
      bala.congelada = true;
      bala.worldOffsetInicial = worldOffsetX;
    }
  });
  
  setTimeout(() => {
    descongelarEnemigos();
  }, 10000);
}

// ============================================
//  FUNCIÓN PARA DESCONGELAR ENEMIGOS
// ============================================
function descongelarEnemigos() {
  enemigosCongelados = false;
  console.log(" Enemigos descongelados");
  
  enemigos.forEach(enemigo => {
    if (enemigo.elemento) {
      enemigo.elemento.style.filter = "brightness(1)";
      enemigo.congelado = false;
    }
  });
  
  balasEnemigos.forEach(bala => {
    if (bala.elemento) {
      bala.elemento.style.filter = "brightness(1)";
      bala.congelada = false;
    }
  });
}

// ============================================
// CLASE ENEMIGO
// ============================================
class Enemigo {
  constructor(x) {
    this.x = x;
    this.y = 100;
    this.vida = ENEMIGO_CONFIG.vidaMaxima;
    this.velocidad = ENEMIGO_CONFIG.velocidad;
    this.direccion = "izquierda";
    this.estado = "idle";
    this.conArma = true;
    this.ultimoDisparo = 0;
    this.frameActual = 0;
    this.ultimoFrameTime = 0;
    this.elemento = null;
    this.muerto = false;
    this.muriendo = false;
    this.congelado = false;
    
    this.tiempoEntreDisparos = Math.random() * 
      (ENEMIGO_CONFIG.tiempoEntreDisparosMax - ENEMIGO_CONFIG.tiempoEntreDisparosMin) + 
      ENEMIGO_CONFIG.tiempoEntreDisparosMin;
    this.precision = Math.random() * 0.3 + 0.7;
    this.agresividad = Math.random();
    
    this.crearElemento();
  }
  
  crearElemento() {
    this.elemento = document.createElement("img");
    this.elemento.className = "enemigo";
    this.elemento.src = enemigoSprites.idle[0];
    this.elemento.style.width = ENEMIGO_CONFIG.anchoSprite + "px";
    this.elemento.style.height = ENEMIGO_CONFIG.altoSprite + "px";
    this.elemento.style.left = this.x + "px";
    this.elemento.style.bottom = this.y + "px";
    this.elemento.setAttribute("data-pos-original", this.x);
    
    gameArea.appendChild(this.elemento);
  }
  
  recibeDaño() {
    this.vida--;
    
    this.elemento.style.filter = "brightness(2)";
    setTimeout(() => {
      if (this.elemento) {
        if (this.congelado) {
          this.elemento.style.filter = "brightness(0.7) sepia(1) hue-rotate(180deg) saturate(3)";
        } else {
          this.elemento.style.filter = "brightness(1)";
        }
      }
    }, 100);
    
    if (this.vida <= 0) {
      this.morir();
    }
  }
  
  morir() {
    if (this.muriendo) return;
    
    this.muriendo = true;
    this.estado = "muerte";
    this.frameActual = 0;
    enemigosEliminados++;
    
    //  REGISTRAR MUERTE PARA LA MISIÓN
    if (typeof registrarMuerteEnemigo !== 'undefined') {
      registrarMuerteEnemigo();
    }
    
    const sonidoMuerte = audioMuerteEnemigo.cloneNode();
    sonidoMuerte.volume = 0.5;
    sonidoMuerte.play();
    console.log(" Enemigo eliminado");
    
    setTimeout(() => {
      this.muerto = true;
      if (this.elemento && this.elemento.parentNode) {
        this.elemento.style.transition = "opacity 0.5s";
        this.elemento.style.opacity = "0";
        
        setTimeout(() => {
          if (this.elemento && this.elemento.parentNode) {
            this.elemento.remove();
          }
        }, 500);
      }
    }, enemigoSprites.muerte.length * 100);
  }
  
  actualizar(timestamp) {
    if (this.muerto) return;
    
    if (enemigosCongelados || this.congelado) {
      this.actualizarPosicion();
      return;
    }
    
    if (this.muriendo) {
      this.actualizarSprite(timestamp);
      this.actualizarPosicion();
      return;
    }
    
    const distanciaAlJugador = Math.abs((posX - worldOffsetX) - (this.x + worldOffsetX));
    const ahora = Date.now();
    
    if (distanciaAlJugador >= ENEMIGO_CONFIG.rangoDisparoMin && 
        distanciaAlJugador <= ENEMIGO_CONFIG.rangoDisparoMax) {
      
      this.estado = "ataque";
      
      if (ahora - this.ultimoDisparo > this.tiempoEntreDisparos) {
        if (Math.random() < this.agresividad + 0.3) {
          this.disparar();
          this.ultimoDisparo = ahora;
          this.tiempoEntreDisparos = Math.random() * 
            (ENEMIGO_CONFIG.tiempoEntreDisparosMax - ENEMIGO_CONFIG.tiempoEntreDisparosMin) + 
            ENEMIGO_CONFIG.tiempoEntreDisparosMin;
        }
      }
      
      if (distanciaAlJugador < ENEMIGO_CONFIG.rangoDisparoMin + 50) {
        // Retroceder del jugador
        if (posX > this.x + worldOffsetX) {
          this.direccion = "izquierda";
          this.x -= this.velocidad * 0.5;
        } else {
          this.direccion = "derecha";
          this.x += this.velocidad * 0.5;
        }
      } else if (distanciaAlJugador > ENEMIGO_CONFIG.rangoDisparoMax - 50) {
        // Acercarse al jugador
        if (posX > this.x + worldOffsetX) {
          this.direccion = "derecha";
          this.x += this.velocidad * 0.7;
        } else {
          this.direccion = "izquierda";
          this.x -= this.velocidad * 0.7;
        }
      } else if (Math.random() > 0.5) {
        this.direccion = posX > this.x + worldOffsetX ? "derecha" : "izquierda";
      }
      
    } else if (distanciaAlJugador < ENEMIGO_CONFIG.rangoDisparoMin) {
      this.estado = "idle";
      
      // Alejarse del jugador
      if (posX > this.x + worldOffsetX) {
        this.direccion = "izquierda";
        this.x -= this.velocidad;
      } else {
        this.direccion = "derecha";
        this.x += this.velocidad;
      }
    } else if (distanciaAlJugador < ENEMIGO_CONFIG.rangoDeteccion) {
      this.estado = "idle";
      
      // Perseguir al jugador
      if (posX > this.x + worldOffsetX) {
        this.direccion = "derecha";
        this.x += this.velocidad;
      } else {
        this.direccion = "izquierda";
        this.x -= this.velocidad;
      }
    } else {
      this.estado = "idle";
      // Movimiento por defecto
      this.x -= this.velocidad * 0.3;
    }
    
    //  APLICAR LÍMITES DEL MAPA - Sistema simplificado
    const limiteIzq = -500;
    const limiteDer = 5500;
    
    if (this.x < limiteIzq) {
      this.x = limiteIzq;
    }
    if (this.x > limiteDer) {
      this.x = limiteDer;
    }
    
    //  EMERGENCIA
    const posicionReal = this.x + worldOffsetX;
    if (posicionReal < -2000 || posicionReal > 8000) {
      this.x = 1000 - worldOffsetX;
      console.error(" Enemigo se salió, teletransportado");
    }
    
    this.actualizarSprite(timestamp);
    this.actualizarPosicion();
  }
  
  actualizarSprite(timestamp) {
    if (timestamp - this.ultimoFrameTime > 150) {
      let frames;
      
      if (this.estado === "muerte") {
        frames = enemigoSprites.muerte;
        if (this.frameActual < frames.length - 1) {
          this.frameActual++;
        }
      } else if (this.estado === "ataque") {
        frames = enemigoSprites.ataque;
        this.frameActual = (this.frameActual + 1) % frames.length;
      } else {
        frames = enemigoSprites.idle;
        this.frameActual = (this.frameActual + 1) % frames.length;
      }
      
      this.elemento.src = frames[this.frameActual];
      this.ultimoFrameTime = timestamp;
    }
  }
  
  actualizarPosicion() {
    const nuevaPos = this.x + worldOffsetX;
    this.elemento.style.left = nuevaPos + "px";
    
    if (this.direccion === "izquierda") {
      this.elemento.style.transform = "scaleX(1)";
    } else {
      this.elemento.style.transform = "scaleX(-1)";
    }
  }
  
  disparar() {
    const bala = {
      x: this.x + worldOffsetX + (this.direccion === "derecha" ? 30 : -10),
      y: this.y + 30,
      direccion: this.direccion,
      velocidad: 10,
      congelada: false,
      worldOffsetInicial: worldOffsetX,
      elemento: document.createElement("div")
    };
    
    bala.elemento.className = "bala-enemigo";
    bala.elemento.style.left = bala.x + "px";
    bala.elemento.style.bottom = bala.y + "px";
    gameArea.appendChild(bala.elemento);
    
    balasEnemigos.push(bala);
    
    if (typeof audioDisparo !== 'undefined') {
      const sonido = audioDisparo.cloneNode();
      sonido.volume = 0.1;
      sonido.play();
    }
  }
  
  getBounds() {
    return {
      x: this.x + worldOffsetX,
      y: this.y,
      width: ENEMIGO_CONFIG.anchoSprite,
      height: ENEMIGO_CONFIG.altoSprite
    };
  }
}

// ============================================
// SISTEMA DE OLEADAS
// ============================================
function generarOleada() {
  if (oleadaActual >= maxOleadas) {
    console.log("¡Todas las oleadas completadas!");
    return;
  }
  
  oleadaActual++;
  console.log(` OLEADA ${oleadaActual}/${maxOleadas} - Spawneando ${enemigosPorOleada} enemigos`);
  
  for (let i = 0; i < enemigosPorOleada; i++) {
    const posX = 1000 + (i * 1000);
    const enemigo = new Enemigo(posX);
    enemigos.push(enemigo);
  }
}

let intervaloOleadas = null;

function iniciarSistemaOleadas() {
  enemigos.forEach(e => e.elemento && e.elemento.remove());
  enemigos = [];
  balasEnemigos.forEach(b => b.elemento && b.elemento.remove());
  balasEnemigos = [];
  oleadaActual = 0;
  enemigosEliminados = 0;
  enemigosCongelados = false;
  
  if (intervaloOleadas) {
    clearInterval(intervaloOleadas);
  }
  
  generarOleada();
  
  intervaloOleadas = setInterval(() => {
    if (!enemigosCongelados && oleadaActual < maxOleadas) {
      generarOleada();
    } else if (oleadaActual >= maxOleadas) {
      clearInterval(intervaloOleadas);
    }
  }, 15000);
}

// ============================================
// ACTUALIZACIÓN DE ENEMIGOS
// ============================================
function actualizarEnemigos(timestamp) {
  enemigos = enemigos.filter(enemigo => {
    if (!enemigo.muerto) {
      enemigo.actualizar(timestamp);
      return true;
    }
    return false;
  });
  
  balasEnemigos = balasEnemigos.filter(bala => {
    if (!bala.congelada && !enemigosCongelados) {
      const direccionMov = bala.direccion === "derecha" ? 1 : -1;
      bala.x += bala.velocidad * direccionMov;
    } else {
      const deltaOffset = worldOffsetX - bala.worldOffsetInicial;
      bala.elemento.style.left = (bala.x + deltaOffset) + "px";
    }
    
    if (!bala.congelada && !enemigosCongelados) {
      bala.elemento.style.left = bala.x + "px";
    }
    
    if (bala.x < -50 || bala.x > window.innerWidth + 50) {
      bala.elemento.remove();
      return false;
    }
    
    if (detectarColisionConJugador(bala)) {
      bala.elemento.remove();
      recibirDañoJugador();
      return false;
    }
    
    return true;
  });
}

// ============================================
// SISTEMA DE COLISIONES
// ============================================
function verificarColisionesBalas() {
  const balasJugador = document.querySelectorAll(".bala, .caballo-proyectil");
  
  balasJugador.forEach(bala => {
    const balaRect = {
      x: parseInt(bala.style.left),
      y: window.innerHeight - parseInt(bala.style.top || bala.style.bottom || 0),
      width: 20,
      height: 7
    };
    
    enemigos.forEach(enemigo => {
      if (!enemigo.muerto && !enemigo.muriendo) {
        const enemigoRect = enemigo.getBounds();
        
        if (hayColision(balaRect, enemigoRect)) {
          enemigo.recibeDaño();
          bala.remove();
        }
      }
    });
  });
}

function hayColision(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}

function detectarColisionConJugador(bala) {
  const jugadorRect = {
    x: posX,
    y: parseInt(player.style.bottom) || 100,
    width: 85,
    height: 80
  };
  
  const balaRect = {
    x: bala.x,
    y: bala.y,
    width: 20,
    height: 7
  };
  
  return hayColision(balaRect, jugadorRect);
}

function recibirDañoJugador() {
  // Verificar si el sistema de vida está cargado
  if (typeof vidaActual !== 'undefined' && typeof invulnerable !== 'undefined') {
    // Usar el sistema de vida si está disponible
    if (invulnerable || vidaActual <= 0) return;

    vidaActual--;
    console.log(` El jugador recibió daño! Vida: ${vidaActual}/${vidaMaxima}`);

    // Audio de daño
    if (typeof audioDañoJugador !== 'undefined') {
      audioDañoJugador.currentTime = 0;
      audioDañoJugador.play().catch(() => {});
    }

    // Efecto visual de daño
    player.style.animation = "dañoFlash 0.2s 3";
    setTimeout(() => {
      player.style.animation = "";
    }, 600);

    actualizarCorazones();

    // Invulnerabilidad temporal (2 segundos)
    invulnerable = true;
    let parpadeo = setInterval(() => {
      player.style.opacity = player.style.opacity === "0.3" ? "1" : "0.3";
    }, 100);

    setTimeout(() => {
      invulnerable = false;
      clearInterval(parpadeo);
      player.style.opacity = "1";
    }, 2000);

    // Verificar si murió
    if (vidaActual <= 0) {
      morirJugador();
    }
  } else {
    // Fallback si no hay sistema de vida
    console.log("⚠ ¡El jugador recibió daño!");
    player.style.filter = "brightness(2) sepia(1) hue-rotate(-50deg)";
    setTimeout(() => {
      player.style.filter = "brightness(1)";
    }, 200);
  }
}

// ============================================
// LIMPIAR SISTEMA AL SALIR DEL JUEGO
// ============================================
function limpiarSistemaEnemigos() {
  if (intervaloOleadas) {
    clearInterval(intervaloOleadas);
  }
  
  enemigos.forEach(e => e.elemento && e.elemento.remove());
  enemigos = [];
  
  balasEnemigos.forEach(b => b.elemento && b.elemento.remove());
  balasEnemigos = [];
  
  oleadaActual = 0;
  enemigosEliminados = 0;
  enemigosCongelados = false;
}

console.log(" Sistema de enemigos cargado correctamente");
console.log(" Límites del mapa configurados: -500 a 5500");
console.log(" Configuración: 20 enemigos totales, 5 cada 15 segundos");

console.log(" Sistema de congelamiento activado - Presiona 3 para congelar enemigos por 10 segundos");

