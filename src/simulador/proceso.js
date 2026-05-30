
import { congruencialMixto } from "./Generadores.js";
import { Uniforme } from "./Distribucion.js";

export function proceso(contadores) {
 
  const u = congruencialMixto();
 
  if (u <= 0.93) { // 93% de los materiales son aptos para tratamiento
 
    const u1 = congruencialMixto();
 
    if (u1 <= 0.45) {
      // ── NOTEBOOK (45%) ──────────────────────────
      contadores.N++;
      const u9 = congruencialMixto();
      if (u9 <= 0.01) {
        // reacondicionamiento
        contadores.CNRA++;
        contadores.ERA++;
        const T = Uniforme(60, 120); // tiempo de reacondicionamiento
        contadores.TRA += T;
      } else {
        // reciclaje
        contadores.CNR++;
        contadores.ER++;
        const T = Uniforme(20, 30); // tiempo de reciclaje
        contadores.TR += T;
      }
 
    } else if (u1 <= 0.80) {
      // ── PC COMPLETA (35%) ───────────────────────
      contadores.PC++;
      const u6 = congruencialMixto();
      if (u6 <= 0.01) {
        // reacondicionamiento
        contadores.CPCRA++;
        contadores.ERA++;
        const T = Uniforme(45, 90); // tiempo de reacondicionamiento
        contadores.TRA += T;
      } else {
        // reciclaje
        contadores.CPCR++;
        contadores.ER++;
        const T = Uniforme(20, 40); // tiempo de reciclaje
        contadores.TR += T;
      }
 
    } else {
      // ── COMPONENTE (20%) ────────────────────────
      const u2 = congruencialMixto();
 
      if (u2 <= 0.35) {
        // FUENTE
        contadores.F++;
        const u3 = congruencialMixto();
        if (u3 <= 0.01) {
          contadores.CFRA++;
          contadores.ERA++;
          const T = Uniforme(10, 20);
          contadores.TRA += T;
        } else {
          contadores.CFR++;
          contadores.ER++;
          const T = Uniforme(7, 11);
          contadores.TR += T;
        }
 
      } else if (u2 <= 0.60) {
        // MOTHERBOARD
        contadores.M++;
        const u3 = congruencialMixto();
        if (u3 <= 0.01) {
          contadores.CMRA++;
          contadores.ERA++;
          const T = Uniforme(15, 30);
          contadores.TRA += T;
        } else {
          contadores.CMR++;
          contadores.ER++;
          const T = Uniforme(5, 10);
          contadores.TR += T;
        }
 
      } else if (u2 <= 0.80) {
        // RAM
        contadores.R++;
        const u3 = congruencialMixto();
        if (u3 <= 0.01) {
          contadores.CRRA++;
          contadores.ERA++;
          const T = Uniforme(5, 10);
          contadores.TRA += T;
        } else {
          contadores.CRR++;
          contadores.ER++;
          const T = Uniforme(1, 3);
          contadores.TR += T;
        }
 
      } else if (u2 <= 0.95) {
        // PROCESADOR
        contadores.CPU++;
        const u3 = congruencialMixto();
        if (u3 <= 0.01) {
          contadores.CCPURA++;
          contadores.ERA++;
          const T = Uniforme(10, 20);
          contadores.TRA += T;
        } else {
          contadores.CCPUR++;
          contadores.ER++;
          const T = Uniforme(3, 6);
          contadores.TR += T;
        }
 
      } else {
        // GPU
        contadores.GPU++;
        const u3 = congruencialMixto();
        if (u3 <= 0.01) {
          contadores.CGPURA++;
          contadores.ERA++;
          const T = Uniforme(15, 30);
          contadores.TRA += T;
        } else {
          contadores.CGPUR++;
          contadores.ER++;
          const T = Uniforme(3, 8);
          contadores.TR += T;
        }
      }
    }
  }

}
