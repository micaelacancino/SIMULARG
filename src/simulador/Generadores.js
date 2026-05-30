//Generador

// generador.js
let semillas = [];
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
