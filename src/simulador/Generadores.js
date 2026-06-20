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

const VENTANA_KS = 30; // tamaño de muestra para K-S
const MAX_INTENTOS = 100; // límite para evitar bucle infinito

export function IniciarGenerador(semillaInicial, modulo) {
  semillas = [semillaInicial];
  m = modulo;
  ventanaKS = []; // reiniciar ventana al iniciar
}

// Ventana interna para la prueba K-S
let ventanaKS = [];

// Genera un candidato crudo (sin validar)
function generarCandidato() {
  const ultima = semillas[semillas.length - 1]; //toma la ult semilla generada
  const nueva = (a * ultima + c) % m; //formula met congruencial mixto
  semillas.push(nueva); //guarda la semilla
  return nueva / m; //convierte el nro entre valor 0 y 1
}

// Prueba K-S sobre una muestra dada //funcion para verficar si la muestra pasa la prueba de KS Kolmogorov-Smirnov
function pasaKS(muestra) {
  const n = muestra.length; //guarda el tamaño de la muestra
  if (n < 2) return true; // con menos de 2 no se puede evaluar

  const ordenados = [...muestra].sort((a, b) => a - b); //copia la muestra y la ordena de menor a mayor
  let Dmax = 0; //Inicializa la mayor diferencia encontrada.

  // Recorre cada valor ordenado y calcula las diferencias con la distribución uniforme
  for (let i = 0; i < n; i++) {
    const Fo = (i + 1) / n;
    const Fe = ordenados[i];
    const D1 = Math.abs(Fo - Fe);
    const D2 = Math.abs(i / n - Fe);
    Dmax = Math.max(Dmax, D1, D2);
  }

  const DCritico = 1.36 / Math.sqrt(n); //calcula el valor crítico para un nivel de significancia del 5% (puede ajustarse según necesidad)
  return Dmax <= DCritico; //Si la diferencia máxima es menor o igual al valor crítico, la muestra pasa.
}

//Función principal que genera un número pseudoaleatorio validado.
// Método congruencial mixto con validación K-S
export function congruencialMixto() {
  let candidato;
  let intentos = 0;

  while (intentos < MAX_INTENTOS) {
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
      console.warn(
        `K-S: se aceptó candidato tras ${MAX_INTENTOS} intentos sin pasar la prueba.`,
      );
      ventanaKS = [...ventanaKS.slice(1), candidato];
      return candidato;
    }
  }
}
