import { IniciarGenerador, lehmer } from "./Generadores.js";
IniciarGenerador(4122, 76);

export async function Simulador(resultado, dias) {
let dia= 1;

while (dia < 32) {
let n=0;
let N = 0 ;
let CNRA = 0 ;
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

const u = lehmer(); // genera un número entre 0 y 1 usando el método Lehmer

while(u<= 0.19)

