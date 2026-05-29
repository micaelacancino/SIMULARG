import { IniciarGenerador, lehmer } from "./Generadores.js";
import { PoissonGrande } from "./Distribucion.js";
import { proceso } from "./proceso.js";

IniciarGenerador(4122, 76);

export async function Simulador(resultado, dias) {
  let dia = 1;

  while (dia < 32) {

    let KMZ1, KMZ2, DVZ1, DVZ2, S;

    // ── RECOLECCIÓN ──────────────────────────
    const uRuta = lehmer();

    if (uRuta <= 0.19) {
      // ruta adversa
      const uKMZ1 = lehmer();
      KMZ1 = 25.2 + 3.4 * uKMZ1;

      const uKMZ2 = lehmer();
      KMZ2 = 45.8 + 7.5 * uKMZ2;

      DVZ1 = (KMZ1 * 50) / 25.5;
      DVZ2 = (KMZ2 * 2.77) / 45.8;
      S = "Adversa";
    } else {
      // ruta normal
      KMZ1 = 25.2;
      KMZ2 = 45.8;
      DVZ1 = 50;
      DVZ2 = 77;
      S = "Normal";
    }

    // ── COMBUSTIBLE ──────────────────────────
    const uLCZ1 = lehmer();
    const LCZ1 = 24 + 11 * uLCZ1;

    const uLCZ2 = lehmer();
    const LCZ2 = 24 + 11 * uLCZ2;

    // ── PRECIO COMBUSTIBLE ───────────────────
    const PCZ1 = ((KMZ1 * LCZ1) / 100) * 2248;
    const PCZ2 = ((KMZ2 * LCZ2) / 100) * 2248;

    // ── PESO Y EQUIPOS DEL DÍA ───────────────
    const P = PoissonGrande(300);

    const uPN = lehmer();
    const PN = 2 + 1 * uPN;

    const uPPC = lehmer();
    const PPC = 6 + 4 * uPPC;

    const PP = (PN + PPC) / 2;
    const CE = Math.round(P / PP);

    // ── CONTADORES DEL DÍA ───────────────────
    const contadores = {
      N: 0, CNR: 0, CNRA: 0,
      PC: 0, CPCR: 0, CPCRA: 0,
      F: 0, CFR: 0, CFRA: 0,
      M: 0, CMR: 0, CMRA: 0,
      R: 0, CRR: 0, CRRA: 0,
      CPU: 0, CCPUR: 0, CCPURA: 0,
      GPU: 0, CGPUR: 0, CGPURA: 0,
      ER: 0, ERA: 0, TR: 0, TRA: 0
    };

    // ── PROCESAR CADA EQUIPO ─────────────────
    let i = 1;
    while (i <= CE) {
      proceso(contadores);
      i++;
    }

    // ── TIEMPOS Y EMPLEADOS ──────────────────
    const TT = contadores.TR + contadores.TRA;
    const HH = TT / 60;
    const CEMP = Math.ceil(HH / 8);

    // ── REPORTE DEL DÍA ──────────────────────
    resultado.push({
      dia, S,
      KMZ1, KMZ2, DVZ1, DVZ2,
      LCZ1, LCZ2, PCZ1, PCZ2,
      P, CE,
      N: contadores.N, CNR: contadores.CNR, CNRA: contadores.CNRA,
      PC: contadores.PC, CPCR: contadores.CPCR, CPCRA: contadores.CPCRA,
      F: contadores.F, CFR: contadores.CFR, CFRA: contadores.CFRA,
      M: contadores.M, CMR: contadores.CMR, CMRA: contadores.CMRA,
      R: contadores.R, CRR: contadores.CRR, CRRA: contadores.CRRA,
      CPU: contadores.CPU, CCPUR: contadores.CCPUR, CCPURA: contadores.CCPURA,
      GPU: contadores.GPU, CGPUR: contadores.CGPUR, CGPURA: contadores.CGPURA,
      ER: contadores.ER, ERA: contadores.ERA,
      TR: contadores.TR, TRA: contadores.TRA,
      TT, HH, CEMP,
    });

    dia++;
  }
}