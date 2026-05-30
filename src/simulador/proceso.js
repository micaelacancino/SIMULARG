//  import { lehmer } from "./Generadores";

//  let N = 0; //notebooks
//  let PC = 0; pcs
//  let F= 0; fuentes
//  let CFRA= 0; //CANTIDAD DE FUENTES REACONDICIONADAS
//  let ERA= 0; //CANTIDAD DE EQUIPOS REACONDICIONADOS
//  let CFR= 0; //CANTIDAD DE FUENTES RECICLADAS
//  let ER= 0; //CANTIDAD DE EQUIPOS RECICLADOS
//  let TRA = 0; //TIEMPO DE REACONDICIONAMIENTO ACUMULADO
//  let TR = 0; //TIEMPO DE RECICLAJE ACUMULADO

//  export async function proceso() {
//     const u = lehmer();
//      if (u <= 0.93) //93% //de los materiales son aptos para tratamiento
//       {

//      const u1 = lehmer();
//      if (u1 <= 0.45) //45% netbooks,  pc completas %35, componentes separados 20%
//          {
//     N= N+1;
//     const u9 = lehmer();
//     if(u9 <= 0.01){
//         CNRA= CNRA+1; // cantidad de notebooks reacondicionadas
//         ERA= ERA+1; // cantidad de equipos reacondicionados
//         T= 60 + 60U9; // tiempo de reacondicionamiento
//         TRA = TRA + T; // cantidad de tiempo de reacondicionados
//     }else{
//        CNR= CNR +1; // cantidad de notebooks recicladas
//        ER= ER +1; // cantidad de equipos reciclados
//        T= 20 + 10U9; // tiempo de reciclaje
//        TR = TR + T; // cantidad de tiempo de reciclados
//     }

//      }else{
//         if(u1 <=0.8)
//          {
//          PC = PC +1;
//         const u6 = lehmer();
//            if(u6 <= 0.01){
//                  CPCRA= CPCRA+1; // cantidad de pc reacondicionadas
//                  ERA= ERA+1; // cantidad de equipos reacondicionados
//                 const u7 = lehmer();
//                  T= 45 + 45U7; // tiempo de reacondicionamiento
//                  TRA = TRA + T; // cantidad de tiempo de reacondicionados
//              }else{
//                  CPCR= CPCR +1; // cantidad de pc recicladas
//                  ER= ER +1; // cantidad de equipos reciclados
//                const u8 = lehmer();
//                  T= 20 + 10U8; // tiempo de reciclaje
//                  TR = TR + T; // cantidad de tiempo de reciclados
//              }
//         }else{
//          const u2 = lehmer();
//          if(u2 <= 0.35) //si es menor a 0.35 es FUENTES
//              {
//                  F= F +1 ; // incremennto cant de fuentes
//              const u3 = lehmer();
//              if(u3 <= 0.01){
//                  CFRA= CFRA+1; // incremento cantidad de fuentes reacondicionadas
//                  ERA= ERA+1; // incremento cantidad de equipos reacondicionados
//                  const u4 = lehmer();
//                  T= 10 +10U4; // tiempo de reacondicionamiento
//                  TRA = TRA + T; // cantidad de tiempo de reacondicionados
//              }else{
//                  CFR= CFR +1; // cantidad de fuentes recicladas
//                  ER= ER +1; // cantidad de equipos reciclados
//                const u5 = lehmer();
//                  T= 7 + 4U5; // tiempo de reciclaje
//                  TR = TR + T; // cantidad de tiempo de reciclados}

//         }else{
//              // PROCESO 2 -----------------------
//         }
//      }

//  } //3


import { lehmer } from "./Generadores.js";
 
export function proceso(contadores) {
 
  const u = lehmer();
 
  if (u <= 0.93) { // 93% de los materiales son aptos para tratamiento
 
    const u1 = lehmer();
 
    if (u1 <= 0.45) {
      // ── NOTEBOOK (45%) ──────────────────────────
      contadores.N++;
      const u9 = lehmer();
      if (u9 <= 0.01) {
        // reacondicionamiento
        contadores.CNRA++;
        contadores.ERA++;
        const T = 60 + 60 * u9;
        contadores.TRA += T;
      } else {
        // reciclaje
        contadores.CNR++;
        contadores.ER++;
        const T = 20 + 10 * u9;
        contadores.TR += T;
      }
 
    } else if (u1 <= 0.80) {
      // ── PC COMPLETA (35%) ───────────────────────
      contadores.PC++;
      const u6 = lehmer();
      if (u6 <= 0.01) {
        // reacondicionamiento
        contadores.CPCRA++;
        contadores.ERA++;
        const u7 = lehmer();
        const T = 45 + 45 * u7;
        contadores.TRA += T;
      } else {
        // reciclaje
        contadores.CPCR++;
        contadores.ER++;
        const u8 = lehmer();
        const T = 20 + 10 * u8;
        contadores.TR += T;
      }
 
    } else {
      // ── COMPONENTE (20%) ────────────────────────
      const u2 = lehmer();
 
      if (u2 <= 0.35) {
        // FUENTE
        contadores.F++;
        const u3 = lehmer();
        if (u3 <= 0.01) {
          contadores.CFRA++;
          contadores.ERA++;
          const u4 = lehmer();
          const T = 10 + 10 * u4;
          contadores.TRA += T;
        } else {
          contadores.CFR++;
          contadores.ER++;
          const u5 = lehmer();
          const T = 7 + 4 * u5;
          contadores.TR += T;
        }
 
      } else if (u2 <= 0.60) {
        // MOTHERBOARD
        contadores.M++;
        const u3 = lehmer();
        if (u3 <= 0.01) {
          contadores.CMRA++;
          contadores.ERA++;
          const u4 = lehmer();
          const T = 15 + 10 * u4;
          contadores.TRA += T;
        } else {
          contadores.CMR++;
          contadores.ER++;
          const u5 = lehmer();
          const T = 10 + 5 * u5;
          contadores.TR += T;
        }
 
      } else if (u2 <= 0.80) {
        // RAM
        contadores.R++;
        const u3 = lehmer();
        if (u3 <= 0.01) {
          contadores.CRRA++;
          contadores.ERA++;
          const u4 = lehmer();
          const T = 8 + 5 * u4;
          contadores.TRA += T;
        } else {
          contadores.CRR++;
          contadores.ER++;
          const u5 = lehmer();
          const T = 5 + 3 * u5;
          contadores.TR += T;
        }
 
      } else if (u2 <= 0.95) {
        // PROCESADOR
        contadores.CPU++;
        const u3 = lehmer();
        if (u3 <= 0.01) {
          contadores.CCPURA++;
          contadores.ERA++;
          const u4 = lehmer();
          const T = 20 + 10 * u4;
          contadores.TRA += T;
        } else {
          contadores.CCPUR++;
          contadores.ER++;
          const u5 = lehmer();
          const T = 10 + 5 * u5;
          contadores.TR += T;
        }
 
      } else {
        // GPU
        contadores.GPU++;
        const u3 = lehmer();
        if (u3 <= 0.01) {
          contadores.CGPURA++;
          contadores.ERA++;
          const u4 = lehmer();
          const T = 25 + 15 * u4;
          contadores.TRA += T;
        } else {
          contadores.CGPUR++;
          contadores.ER++;
          const u5 = lehmer();
          const T = 15 + 10 * u5;
          contadores.TR += T;
        }
      }
    }
  }

}
