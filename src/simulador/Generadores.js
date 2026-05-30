//Generador
//Metodo lehmer (del libro)

let semillas = []; //array vacio para guardar todas las semillas generadas
let T = 0; //contador para el numero de semillas generadas

//funcion donde se va a generar el numero pseudoaleatorio
export function IniciarGenerador(semillaInicial, t) {
  semillas = [semillaInicial]; //inicializamos el array con la semilla inicial (N0 del libro)
  T = t; //asignamos el numero de semillas a generar (t del libro),  guarda la constante para usarla después en cada llamada a lehmer()
}
export function lehmer() {
  const ultima = semillas[semillas.length - 1]; //toma el último número del array. La primera vez es n0, después es el último generado.
  const resultado = ultima * T; //multiplica la semilla x T
  const k = T.toString().length; //toString cuenta la cantidad de dígitos de T
  const izquierda = parseInt(resultado.toString().substring(0, k)); //toma los primeros k dígitos del resultado
  const derecha = parseInt(resultado.toString().substring(k)); //toma los últimos k dígitos del resultado con substring y con parseInt los convierte a número
  let n = derecha - izquierda; //resta derecha - izquierda para obtener el número pseudoaleatorio
    //PROTECCIÓN: si n es 0 o negativo, reiniciamos con un valor alternativo
  if (n <= 0) n = ultima + 1;
  semillas.push(n); //guarda la semilla en el array
  const cantDigitos = ultima.toString().length;
  return n / Math.pow(10, cantDigitos); //devuelve el número pseudoaleatorio entre 0 y 1, dividiendo n por 10 elevado a la cantidad de dígitos de la última semilla generada
}
