// ─────────────────────────────────────────────
//  Distribuciones.js
//  Funciones de distribuciones estadísticas

import { congruencialMixto } from "../simulador/Generadores.js";

// ─────────────────────────────────────────────
//  DISTRIBUCIÓN UNIFORME
//  Retorna un número entre min y max
//  Usada para: distancias, combustible, tiempos
//  Fórmula: min + u * (max - min)
// ─────────────────────────────────────────────
export function Uniforme(min, max) {
  const u = congruencialMixto();
  return min + u * (max - min);
}

// ─────────────────────────────────────────────
//  POISSON
//  Retorna una cantidad estimada de eventos.
//  Usada para: kg de material que llegan por día.
//  Para lambda grande, Poisson(lambda) se aproxima con:
//  Normal(media = lambda, desvío = sqrt(lambda)).
export function Poisson(lambda) {
  const media = lambda;
  const desvio = Math.sqrt(lambda);

  let u1 = congruencialMixto();
  let u2 = congruencialMixto();

  // protección: u1 no puede ser 0 porque log(0) = -Infinity
  if (u1 <= 0) u1 = 0.0001;

  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

  const resultado = Math.round(media + desvio * z);

  // protección: el peso no puede ser negativo
  return resultado > 0 ? resultado : media;
}

export function Exponencial(val) {
  const u = congruencialMixto();
  return -val * Math.log(u);
}

export function Normal(m, d) {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const u = congruencialMixto(); // número uniforme en [0,1]
    sum += u;
  }
  const x = d * (sum - 6) + m;
  return x;
}
