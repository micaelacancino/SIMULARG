import { IniciarGenerador, lehmer } from "./Generadores.js";
import { Poisson, Uniforme } from "./Distribucion.js";
IniciarGenerador(4122, 76);

export async function Simulador(resultado, dias) {
  let dia = 1;

  while (dia < 32) {
    let n = 0;
    let N = 0;
    let CNRA = 0;
    let ERA = 0;
    let TRA = 0;
    let CNR = 0;
    let ER = 0;
    let TR = 0;
    let PC = 0;
    let CPCR = 0;
    let CPCRA = 0;
    let F = 0;
    let CFRA = 0;
    let CFR = 0;
    let M = 0;
    let CMRA = 0;
    let CMR = 0;
    let R = 0;
    let CRR = 0;
    let CRRA = 0;
    let CPU = 0;
    let CCPURA = 0;
    let CCPUR = 0;
    let GPU = 0;
    let CGPURA = 0;
    let CGPUR = 0;
    let KMZ1, KMZ2; //km recorridos
    let DVZ1, DVZ2; //duración del viaje
    let i = 1;

    const u = lehmer(); // genera un número entre 0 y 1 usando el método Lehmer

    if (u <= 0.19) {
      //ruta adversa

      const u2 = lehmer(); // genera otro número entre 0 y 1 para determinar la ruta adversa específica
      KMZ1 = 25.2 + 3.4 * u2;

      const u3 = lehmer();
      KMZ2 = 45.8 + 7.5 * u3;

      DVZ1 = (KMZ1 * 50) / 25.5;
      DVZ2 = (KMZ2 * 2.77) / 45.8;
      //S= "Adversa"
    } else {
      // ruta normal
      KMZ1 = 25.2;
      KMZ2 = 45.8;
      DVZ1 = 50;
      DVZ2 = 77;
      //S= "Normal"
    }

    //combustible (variable)
    const u4 = lehmer();
    const LCZ1 = 24 + 11 * u4;

    const u5 = lehmer();
    const LCZ2 = 24 + 11 * u5;

    //precio combustible
    const PCZ1 = ((KMZ1 * LCZ1) / 100) * 2248;
    const PCZ2 = ((KMZ2 * LCZ2) / 100) * 2248;

    // Peso del día
    const P = Poisson(300); // α = 6000kg / 20 días

    // peso de una notebook (entre 2 y 3 kg)
    const uPN = lehmer();
    const PN = 2 + 1 * uPN;

    // peso de una PC (entre 6 y 10 kg)
    const uPPC = lehmer();
    const PPC = 6 + 4 * uPPC;

    // peso promedio por equipo
    const PP = (PN + PPC) / 2;

    // cantidad de equipos RECIBIDOS POR DIA
   //const CE = (P / PP) / 20;
   const CE = Math.round(P / PP); // cantidad de equipos del día


    while (i <= CE) {
      // acá va el "Proceso" → clasificar cada equipo
      // ¿es notebook, PC o componente?
      // ¿se recicla o reacondiciona?
      // calcular tiempos

      i = i + 1;
    } // cuando termina el while → reporte del día
    const TT = TR + TRA; // tiempo total (minutos)
    const HH = TT / 60; // convertir a horas
    const CEMP = HH / 8; // empleados necesarios (jornada 8hs)

    resultado.push({
      dia,
      KMZ1,
      KMZ2,
      DVZ1,
      DVZ2,
      LCZ1,
      LCZ2,
      PCZ1,
      PCZ2,
      P,
      CE,
      TR,
      TRA,
      TT,
      HH,
      CEMP,
    });

    dia = dia + 1; // avanzar al siguiente día
  }
}
