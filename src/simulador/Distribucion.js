// ─────────────────────────────────────────────
//  Distribuciones.js
//  Funciones de distribuciones estadísticas
//  Usan lehmer() como fuente de aleatoriedad
// ─────────────────────────────────────────────
 
import { lehmer } from "../simulador/Generadores.js";
 
// ─────────────────────────────────────────────
//  DISTRIBUCIÓN UNIFORME
//  Retorna un número entre min y max
//  Usada para: distancias, combustible, tiempos
//  Fórmula: min + u * (max - min)
// ─────────────────────────────────────────────
export function Uniforme(min, max) {
  const u = lehmer();
  return min + u * (max - min);
}
 
// ─────────────────────────────────────────────
//  DISTRIBUCIÓN POISSON
//  Retorna la cantidad de eventos en un continuo
//  Usada para: kg de material que llegan por día
//  a = cantidad del evento / continuo (ej: 6000/20 = 300)
//
//  Procedimiento (del libro):
//  b = e^(-a)
//  x = 0, p = 1
//  Mientras p > b → u = GU(), p = p * u, x = x + 1
//  Retorna x
// ─────────────────────────────────────────────
export function Poisson(a) {
  const b = Math.exp(-a); // b = e^(-a)
  let x = 0;
  let p = 1;
 
  while (p > b) {
    const u = lehmer(); // Call GU(u) del libro
    p = p * u;          // p = p * u
    x = x + 1;          // x = x + 1
  }
 
  return x; // cantidad de eventos (kg del día)
}