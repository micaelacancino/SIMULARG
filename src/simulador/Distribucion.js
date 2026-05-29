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
export function PoissonGrande(lambda) {
  const media = lambda;
  const desvio = Math.sqrt(lambda);

  let u1 = lehmer();
  let u2 = lehmer();

  // protección: u1 no puede ser 0 porque log(0) = -Infinity
  if (u1 <= 0) u1 = 0.0001;

  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

  const resultado = Math.round(media + desvio * z);

  // protección: el peso no puede ser negativo
  return resultado > 0 ? resultado : media;
}