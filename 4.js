// ============================================
// SISTEMA SIMPLE DE NPC Y MISIÓN (CORREGIDO)
// ============================================

// Variables del NPC y flujo al jefe
let npcElemento = null;
let npcIndicador = null;
let misionActiva = false;
let enemigosMatados = 0;
let misionCompletada = false;
let dialogoActivo = false;
let generandoOleada = false;

// Audio del diálogo
const audioNPC = new Audio("undertale - sans talking - QuickSounds.com.mp3");
audioNPC.volume = 0.5;

// Configuración del NPC
const NPC_CONFIG = {
  x: 550,
  y: 100,
  sprite: "NPCxD1.png",
  ancho: 60,
  alto: 70
};

// ============================================
// CREAR NPC
// ============================================
function crearNPC() {
  console.log(" Intentando crear NPC...");
  
  if (!gameArea) {
    console.error("gameArea no encontrado");
    return;
  }

  if (npcElemento) {
    console.log(" NPC ya existe, no se creará de nuevo");
    return;
  }

  npcElemento = document.createElement("img");
  npcElemento.src = NPC_CONFIG.sprite;
  npcElemento.style.width = NPC_CONFIG.ancho + "px";
  npcElemento.style.height = NPC_CONFIG.alto + "px";
  npcElemento.style.position = "absolute";
  npcElemento.style.left = NPC_CONFIG.x + "px";
  npcElemento.style.bottom = NPC_CONFIG.y + "px";
  npcElemento.style.zIndex = "8";
  npcElemento.style.imageRendering = "pixelated";

  npcIndicador = document.createElement("div");
  npcIndicador.textContent = "!";
  npcIndicador.style.position = "absolute";
  npcIndicador.style.left = (NPC_CONFIG.x + 20) + "px";
  npcIndicador.style.bottom = (NPC_CONFIG.y + 75) + "px";
  npcIndicador.style.fontSize = "30px";
  npcIndicador.style.color = "#FFD700";
  npcIndicador.style.fontWeight = "bold";
  npcIndicador.style.zIndex = "9";
  npcIndicador.style.textShadow = "2px 2px 4px rgba(0,0,0,0.8)";
  npcIndicador.style.animation = "bounce 0.5s infinite";
  npcIndicador.style.display = "none";

  gameArea.appendChild(npcElemento);
  gameArea.appendChild(npcIndicador);

  console.log("NPC creado en x:", NPC_CONFIG.x);
}

// ============================================
// ACTUALIZAR NPC
// ============================================
function actualizarNPC() {
  if (!npcElemento) return;

  const nuevaPos = NPC_CONFIG.x + (typeof worldOffsetX !== 'undefined' ? worldOffsetX : 0);
  npcElemento.style.left = nuevaPos + "px";
  npcIndicador.style.left = (nuevaPos + 20) + "px";

  const playerPos = (typeof posX !== 'undefined' ? posX : 0);
  const offset = (typeof worldOffsetX !== 'undefined' ? worldOffsetX : 0);
  const distancia = Math.abs((playerPos - offset) - (NPC_CONFIG.x + offset));
  if (distancia < 100) {
    npcIndicador.style.display = "block";
  } else {
    npcIndicador.style.display = "none";
  }
}

// ============================================
// CREAR DIÁLOGO
// ============================================
function mostrarDialogo(nombre, mensaje, puedeAceptar = false, onAccept = null) {
  if (dialogoActivo) return;

  audioNPC.currentTime = 0;
  audioNPC.play().catch(() => {});

  const dialogo = document.createElement("div");
  dialogo.style.position = "fixed";
  dialogo.style.bottom = "50px";
  dialogo.style.left = "50%";
  dialogo.style.transform = "translateX(-50%)";
  dialogo.style.width = "600px";
  dialogo.style.background = "rgba(0, 0, 0, 0.9)";
  dialogo.style.border = "3px solid #FFD700";
  dialogo.style.borderRadius = "10px";
  dialogo.style.padding = "20px";
  dialogo.style.zIndex = "2500";
  dialogo.style.fontFamily = "'Press Start 2P', cursive";
  dialogo.style.color = "#FFFFFF";
  dialogo.style.fontSize = "12px";
  dialogo.style.lineHeight = "1.8";

  const nombreElemento = document.createElement("div");
  nombreElemento.textContent = nombre;
  nombreElemento.style.color = "#ff0000ff";
  nombreElemento.style.marginBottom = "10px";
  nombreElemento.style.fontSize = "14px";

  const mensajeElemento = document.createElement("div");
  mensajeElemento.textContent = mensaje;
  mensajeElemento.style.whiteSpace = "pre-line";

  const instruccion = document.createElement("div");
  if (puedeAceptar) {
    instruccion.textContent = "Presiona ENTER para aceptar | ESC para cancelar";
  } else {
    instruccion.textContent = "Presiona ESC para cerrar";
  }
  instruccion.style.marginTop = "15px";
  instruccion.style.fontSize = "10px";
  instruccion.style.color = "#888";
  instruccion.style.textAlign = "center";

  dialogo.appendChild(nombreElemento);
  dialogo.appendChild(mensajeElemento);
  dialogo.appendChild(instruccion);

  document.body.appendChild(dialogo);
  dialogoActivo = true;

  const handler = (e) => {
    if (e.key === "Escape") {
      dialogo.remove();
      dialogoActivo = false;
      document.removeEventListener("keydown", handler);
    } else if (e.key === "Enter" && puedeAceptar) {
      dialogo.remove();
      dialogoActivo = false;
      document.removeEventListener("keydown", handler);
      if (typeof onAccept === "function") {
        onAccept();
      }
    }
  };

  document.addEventListener("keydown", handler);
}

// ============================================
// INTERACTUAR CON NPC El Ultimo sobreviviente
// ============================================
function interactuarConNPC() {
  if (dialogoActivo) return;

  const playerPos = (typeof posX !== 'undefined' ? posX : 0);
  const offset = (typeof worldOffsetX !== 'undefined' ? worldOffsetX : 0);
  const distancia = Math.abs((playerPos - offset) - (NPC_CONFIG.x + offset));

  if (distancia < 100) {
    if (!misionActiva && !misionCompletada) {
      // Primera misión  15 enemigos
      mostrarDialogo(
        "El Ultimo sobreviviente ",
        "Con 1 sacas el arma ,  Con F disparas ,  Con Espacio o con W saltas para esquivar las balas  \n\n ¡HEY viajero No hay nada que hacer Aqui! Los bandidos Mataron a todos atacando el pueblo hace dias atras soy el que sobrevivio  pedimos ayuda al gobierno y nos dejaron a nuestra suerte \n\n MISIÓN: Elimina a los  15  bandidos que mataron a todos \n\n IMPORTANTE Los  bandidos estan en grupos de 5 escondidos en las casas",
        true,
        iniciarMision
      );
    } else if (misionCompletada) {
      // Después de completar la misión  Invocar Jefe
      mostrarDialogo(
        "El Ultimo sobreviviente",
        "¡Excelente trabajo, viajero!\n\n MATA al jefe de los bandidos el ejecuto a los todos ",
        true,
        invocarJefeManual
      );
    } else if (misionActiva) {
      // Misión en progreso
      mostrarDialogo(
        "El Ultimo sobreviviente",
        `Misión en progreso...\n\nEnemigos eliminados: ${enemigosMatados}/15\n\n¡Sigue luchando!`,
        false
      );
    }
  }
}

// ============================================
//  INVOCAR JEFE MANUALMENTE
// ============================================
function invocarJefeManual() {
  console.log(" Invocando al Jefe Final...");
  
  // Verificar si la clase existe
  if (typeof JefeFinal === 'undefined') {
    console.error(" La clase JefeFinal no existe. Verifica que 6.js esté cargado.");
    alert("Error: No se pudo cargar el Jefe Final. Verifica la consola.");
    return;
  }
  
  // Verificar si ya existe
  if (typeof jefeFinal !== 'undefined' && jefeFinal !== null) {
    console.log(" El jefe ya existe");
    return;
  }
  
  // Crear el jefe
  const posicionJefe = 1500;
  window.jefeFinal = new JefeFinal(posicionJefe);
  
  console.log("Jefe Final creado exitosamente");
}

// ============================================
// INICIAR MISIÓN
// ============================================
function iniciarMision() {
  if (misionActiva) return;
  misionActiva = true;
  enemigosMatados = 0;
  generandoOleada = false;
  console.log(" MISIÓN INICIADA: Eliminar 15 enemigos");

  generarOleadaMision();
}

// ============================================
// GENERAR OLEADA DE ENEMIGOS
// ============================================
function generarOleadaMision() {
  console.log(` Generando 5 enemigos... (${enemigosMatados}/15 eliminados)`);
  for (let i = 0; i < 5; i++) {
    const posX = 1000 + (i * 300);
    const enemigo = new Enemigo(posX);
    enemigos.push(enemigo);
  }
  console.log(" 5 enemigos generados");
}

// ============================================
// VERIFICAR PROGRESO DE MISIÓN
// ============================================
function verificarProgresoMision() {
  if (!misionActiva || generandoOleada) return;

  const enemigosVivos = enemigos.filter(e => !e.muerto && !e.muriendo).length;

  if (enemigosVivos === 0 && enemigosMatados < 15) {
    const enemigosRestantes = 15 - enemigosMatados;
    console.log(` Oleada eliminada. Faltan ${enemigosRestantes} enemigos.`);

    generandoOleada = true;
    setTimeout(() => {
      generarOleadaMision();
      generandoOleada = false;
    }, 2000);
  }

  if (enemigosMatados >= 15 && !misionCompletada) {
    completarMision();
  }
}

// ============================================
// COMPLETAR MISIÓN
// ============================================
function completarMision() {
  misionCompletada = true;
  misionActiva = false;
  console.log(" MISIÓN COMPLETADA (Los 15 bandidos fueron derrotados)");

  mostrarDialogo(
    "MISIÓN COMPLETADA",
    " Has eliminado a todos los bandidos\n\nVuelve con el Ultimo sobreviviente  para aceptar la misión final contra el JEFE de los bandidos ",
    false
  );
}

// ============================================
// REGISTRAR MUERTE DE ENEMIGO
// ============================================
function registrarMuerteEnemigo() {
  if (misionActiva && enemigosMatados < 15) {
    enemigosMatados++;
    console.log(` Enemigo eliminado (${enemigosMatados}/15)`);
  }
}

// ============================================
// LIMPIAR NPC
// ============================================
function limpiarNPC() {
  if (npcElemento) npcElemento.remove();
  if (npcIndicador) npcIndicador.remove();
  npcElemento = null;
  npcIndicador = null;
  misionActiva = false;
  enemigosMatados = 0;
  misionCompletada = false;
  dialogoActivo = false;
  generandoOleada = false;
}

// Animación del indicador
const styleNPC = document.createElement('style');
styleNPC.textContent = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`;
document.head.appendChild(styleNPC);

console.log(" Sistema de NPC simple cargado");
console.log(" Presiona E para hablar con el NPC");

console.log(" Sistema de invocación del jefe integrado");
