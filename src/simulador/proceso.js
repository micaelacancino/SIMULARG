
import { congruencialMixto } from "./Generadores.js";
import { Uniforme } from "./Distribucion.js";

const PROB_REACONDICIONAMIENTO = 0.02;

export function proceso(contadores) {
 
  const u = congruencialMixto();
 
  if (u <= 0.93) { // 93% de los materiales son aptos para tratamiento
 
    const u1 = congruencialMixto();
 
    if (u1 <= 0.45) {
      // ── NOTEBOOK (45%) ──────────────────────────
      contadores.N++;
      const u9 = congruencialMixto();
      if (u9 <= PROB_REACONDICIONAMIENTO) {
        // reacondicionamiento
        contadores.CNRA++;
        contadores.ERA++;
        const T = Uniforme(60, 120); // tiempo de reacondicionamiento
        contadores.TRA += T;
      } else {
        // reciclaje
        contadores.CNR++;
        contadores.ER++;
        const T = Uniforme(30, 60); // tiempo de reciclaje
        contadores.TR += T;
      }
 
    } else if (u1 <= 0.80) {
      // ── PC COMPLETA (35%) ───────────────────────
      contadores.PC++;
      const u6 = congruencialMixto();
      if (u6 <= PROB_REACONDICIONAMIENTO) {
        // reacondicionamiento
        contadores.CPCRA++;
        contadores.ERA++;
        const T = Uniforme(60, 90); // tiempo de reacondicionamiento
        contadores.TRA += T;
      } else {
        // reciclaje
        contadores.CPCR++;
        contadores.ER++;
        const T = Uniforme(30, 60); // tiempo de reciclaje
        contadores.TR += T;
      }
 
    } else {
      // ── COMPONENTE (20%) ────────────────────────
      const u2 = congruencialMixto();
 
      if (u2 <= 0.35) {
        // FUENTE
        contadores.F++;
        const u3 = congruencialMixto();
        if (u3 <= PROB_REACONDICIONAMIENTO) {
          contadores.CFRA++;
          contadores.ERA++;
          const T = Uniforme(15, 25);
          contadores.TRA += T;
        } else {
          contadores.CFR++;
          contadores.ER++;
          const T = Uniforme(10, 20);
          contadores.TR += T;
        }
 
      } else if (u2 <= 0.60) {
        // MOTHERBOARD
        contadores.M++;
        const u3 = congruencialMixto();
        if (u3 <= PROB_REACONDICIONAMIENTO) {
          contadores.CMRA++;
          contadores.ERA++;
          const T = Uniforme(15, 30);
          contadores.TRA += T;
        } else {
          contadores.CMR++;
          contadores.ER++;
          const T = Uniforme(15, 25);
          contadores.TR += T;
        }
 
      } else if (u2 <= 0.80) {
        // RAM
        contadores.R++;
        const u3 = congruencialMixto();
        if (u3 <= PROB_REACONDICIONAMIENTO) {
          contadores.CRRA++;
          contadores.ERA++;
          const T = Uniforme(6, 10);
          contadores.TRA += T;
        } else {
          contadores.CRR++;
          contadores.ER++;
          const T = Uniforme(5, 12);
          contadores.TR += T;
        }
 
      } else if (u2 <= 0.95) {
        // PROCESADOR
        contadores.CPU++;
        const u3 = congruencialMixto();
        if (u3 <= PROB_REACONDICIONAMIENTO) {
          contadores.CCPURA++;
          contadores.ERA++;
          const T = Uniforme(10, 20);
          contadores.TRA += T;
        } else {
          contadores.CCPUR++;
          contadores.ER++;
          const T = Uniforme(5, 10);
          contadores.TR += T;
        }
 
      } else {
        // GPU
        contadores.GPU++;
        const u3 = congruencialMixto();
        if (u3 <= PROB_REACONDICIONAMIENTO) {
          contadores.CGPURA++;
          contadores.ERA++;
          const T = Uniforme(20, 40);
          contadores.TRA += T;
        } else {
          contadores.CGPUR++;
          contadores.ER++;
          const T = Uniforme(10, 20);
          contadores.TR += T;
        }
      }
    }
  }

}
