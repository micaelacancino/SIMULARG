//Generador

// generador.js
/*let semillas = [];
let a = 1103515245;
let c = 12345;
let m = 0;

// Inicializa el generador con parámetros del LCG
export function IniciarGenerador(semillaInicial, modulo) {
  semillas = [semillaInicial];
  m = modulo;
}


// Método congruencial mixto
export function congruencialMixto() {
  const ultima = semillas[semillas.length - 1];
  const nueva = (a * ultima + c) % m;
  semillas.push(nueva);
  return nueva / m; // número entre 0 y 1
}
*/
let semillas = [];
let a = 1103515245;
let c = 12345;
let m = 0;

const VENTANA_KS = 30;      // tamaño de muestra para K-S
const MAX_INTENTOS = 100;   // límite para evitar bucle infinito

export function IniciarGenerador(semillaInicial, modulo) {
  semillas = [semillaInicial];
  m = modulo;
  ventanaKS = [];           // reiniciar ventana al iniciar
}

// Ventana interna para la prueba K-S
let ventanaKS = [];

// Genera un candidato crudo (sin validar)
function generarCandidato() {
  const ultima = semillas[semillas.length - 1];
  const nueva = (a * ultima + c) % m;
  semillas.push(nueva);
  return nueva / m;
}

// Prueba K-S sobre una muestra dada
function pasaKS(muestra, alpha = 0.05) {
  const n = muestra.length;
  if (n < 2) return true; // con menos de 2 no se puede evaluar

  const ordenados = [...muestra].sort((a, b) => a - b);
  let Dmax = 0;

  for (let i = 0; i < n; i++) {
    const Fo = (i + 1) / n;
    const Fe = ordenados[i];
    const D1 = Math.abs(Fo - Fe);
    const D2 = Math.abs((i / n) - Fe);
    Dmax = Math.max(Dmax, D1, D2);
  }

  const DCritico = 1.36 / Math.sqrt(n);
  return Dmax <= DCritico;
}

// Método congruencial mixto con validación K-S
export function congruencialMixto() {
  let candidato;
  let intentos = 0;

  do {
    candidato = generarCandidato();
    intentos++;

    // Mientras la ventana no esté llena, aceptar directamente
    if (ventanaKS.length < VENTANA_KS) {
      ventanaKS.push(candidato);
      return candidato;
    }

    // Ventana llena: probar si el candidato pasa K-S
    const ventanaPrueba = [...ventanaKS.slice(1), candidato]; // deslizar ventana

    if (pasaKS(ventanaPrueba)) {
      ventanaKS = ventanaPrueba; // actualizar ventana
      return candidato;
    }

    // Si no pasa y se exceden los intentos, aceptar de todas formas
    if (intentos >= MAX_INTENTOS) {
      console.warn(`K-S: se aceptó candidato tras ${MAX_INTENTOS} intentos sin pasar la prueba.`);
      ventanaKS = [...ventanaKS.slice(1), candidato];
      return candidato;
    }

  } while (true);
}