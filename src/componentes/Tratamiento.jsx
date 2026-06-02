/*import { useState } from "react";
import { BsClipboardData } from "react-icons/bs";
import "../css/tratamiento.css";
import { IniciarGenerador, congruencialMixto } from "../simulador/Generadores.js";

function Tratamiento() {
  const PROB_REACONDICIONAMIENTO = 0.02;
  const [totalRecibidos, setTotalRecibidos] = useState("");
  const [empleadosDisponibles, setEmpleadosDisponibles] = useState("");
  const [equipos, setEquipos] = useState({
    N: "", PC: "", F: "", M: "", R: "", CPU: "", GPU: "",
  });
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState(null);
  const [simulando, setSimulando] = useState(false);
  const [vistaResultado, setVistaResultado] = useState("detalle");

  const labels = {
    N: "Notebooks", PC: "PCs completas", F: "Fuentes",
    M: "Motherboards", R: "Memorias RAM", CPU: "Procesadores", GPU: "Tarjetas gráficas"
  };

  const sumaActual = Object.values(equipos).reduce((a, b) => a + Number(b || 0), 0);

  const handleTotalChange = (e) => {
    const { value } = e.target;

    if (value === "" || /^\d+$/.test(value)) {
      setTotalRecibidos(value);
    }

    setError("");
    setResultado(null);
    setEquipos({ N: "", PC: "", F: "", M: "", R: "", CPU: "", GPU: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value !== "" && !/^\d+$/.test(value)) {
      return;
    }

    const val = Number(value || 0);
    const total = Number(totalRecibidos);
    const nuevaSuma = sumaActual - Number(equipos[name] || 0) + val;

    if (nuevaSuma > total) {
      setError(`La suma no puede superar ${total} equipos recibidos hoy.`);
      return;
    }

    setError("");
    setEquipos((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmpleadosChange = (e) => {
    const { value } = e.target;

    if (value === "" || /^\d+$/.test(value)) {
      setEmpleadosDisponibles(value);
    }

    setError("");
  };

  const ejecutarSimulacion = () => {
    const total = Number(totalRecibidos);

    if (totalRecibidos === "") {
      setError("Ingresá la cantidad de equipos recibidos hoy.");
      return;
    }
    if (total < 1) {
      setError("La cantidad de equipos recibidos debe ser al menos 1.");
      return;
    }
    if (total > 250) {
      setError("La cantidad de equipos recibidos no puede superar 250.");
      return;
    }
    if (sumaActual === 0) {
      setError("Ingresá al menos un equipo para calcular.");
      return;
    }
    if (empleadosDisponibles === "") {
      setError("Ingresá la cantidad de empleados disponibles.");
      return;
    }
    if (Number(empleadosDisponibles) < 1) {
      setError("La cantidad de empleados disponibles debe ser al menos 1.");
      return;
    }
    if (Number(empleadosDisponibles) > 150) {
      setError("La cantidad de empleados disponibles no puede superar 150.");
      return;
    }
    if (sumaActual > total) {
      setError(`La suma (${sumaActual}) supera el total recibido (${total}).`);
      return;
    }

    setError("");
    IniciarGenerador(4122, 76);

    const tiemposPorDestino = {
      N: { reacondicionamiento: [60, 120], reciclaje: [20, 30] },
      PC: { reacondicionamiento: [45, 90], reciclaje: [20, 40] },
      F: { reacondicionamiento: [10, 20], reciclaje: [7, 11] },
      M: { reacondicionamiento: [15, 30], reciclaje: [5, 10] },
      R: { reacondicionamiento: [5, 10], reciclaje: [1, 3] },
      CPU: { reacondicionamiento: [10, 20], reciclaje: [3, 6] },
      GPU: { reacondicionamiento: [15, 30], reciclaje: [3, 8] },
    };

    const detalle = {};
    Object.keys(equipos).forEach((key) => {
      let reciclaje = 0;
      let reacondicionamiento = 0;
      let tiempoReciclaje = 0;
      let tiempoReacondicionamiento = 0;

      const cantidad = Number(equipos[key] || 0);

      for (let i = 0; i < cantidad; i++) {
        const destino = congruencialMixto() <= PROB_REACONDICIONAMIENTO ? "reacondicionamiento" : "reciclaje";
        const [min, max] = tiemposPorDestino[key][destino];
        const tiempo = min + (max - min) * congruencialMixto();

        if (destino === "reacondicionamiento") {
          reacondicionamiento++;
          tiempoReacondicionamiento += tiempo;
        } else {
          reciclaje++;
          tiempoReciclaje += tiempo;
        }
      }

      const tiempoTotal = tiempoReciclaje + tiempoReacondicionamiento;

      detalle[key] = {
        cantidad,
        reciclaje,
        reacondicionamiento,
        tiempoReciclaje,
        tiempoReacondicionamiento,
        tiempoPromedioReciclaje: reciclaje > 0 ? tiempoReciclaje / reciclaje : 0,
        tiempoPromedioReacondicionamiento:
          reacondicionamiento > 0 ? tiempoReacondicionamiento / reacondicionamiento : 0,
        tiempoPorUnidad: cantidad > 0 ? tiempoTotal / cantidad : 0,
        tiempoTotal,
      };
    });

    const TT   = Object.values(detalle).reduce((a, b) => a + b.tiempoTotal, 0);
    const HH   = TT / 60;
    const empleados = Number(empleadosDisponibles);
    const jornadaMin = empleados * 8 * 60;
    const CEMP = Math.ceil(HH / 8);

    const minPorEquipo = TT / sumaActual;
    const equiposProcesados = Math.min(sumaActual, Math.floor(jornadaMin / minPorEquipo));
    const equiposPendientes = sumaActual - equiposProcesados;

    setResultado({
      detalle, TT, HH, CEMP,
      equiposProcesados, equiposPendientes,
      empleadosDisponibles: empleados,
    });
  };

  const handleSimular = () => {
    setSimulando(true);
    setResultado(null);

    setTimeout(() => {
      ejecutarSimulacion();
      setSimulando(false);
    }, 450);
  };

  const handleResetear = () => {
    setResultado(null);
    setSimulando(false);
    setError("");
    setEquipos({ N: "", PC: "", F: "", M: "", R: "", CPU: "", GPU: "" });
    setTotalRecibidos("");
    setEmpleadosDisponibles("");
  };

  const estadoEmpleados = resultado
    ? resultado.empleadosDisponibles >= resultado.CEMP
      ? { msg: `✅ La cantidad de empleados es suficiente (necesarios: ${resultado.CEMP}, disponibles: ${resultado.empleadosDisponibles}).`, color: "#16a34a" }
      : { msg: `⚠️ Se necesitan ${resultado.CEMP} empleados pero solo hay ${resultado.empleadosDisponibles} disponibles. Faltan ${resultado.CEMP - resultado.empleadosDisponibles}.`, color: "#dc2626" }
    : null;

  const validarAntesDeSimular = () => {
    if (empleadosDisponibles === "") {
      setError("Ingresa la cantidad de empleados disponibles.");
      return false;
    }
    if (Number(empleadosDisponibles) < 1) {
      setError("La cantidad de empleados disponibles debe ser al menos 1.");
      return false;
    }
    if (Number(empleadosDisponibles) > 150) {
      setError("La cantidad de empleados disponibles no puede superar 150.");
      return false;
    }

    if (modo === "total") {
      const total = Number(totalRecibidos);
      if (totalRecibidos === "") {
        setError("Ingresa la cantidad de equipos recibidos hoy.");
        return false;
      }
      if (total < 1) {
        setError("La cantidad de equipos recibidos debe ser al menos 1.");
        return false;
      }
      if (total > 250) {
        setError("La cantidad de equipos recibidos no puede superar 250.");
        return false;
      }
    }

    if (modo === "clasificacion") {
      if (sumaActual === 0) {
        setError("Ingresa al menos un equipo para calcular.");
        return false;
      }
      if (sumaActual > 250) {
        setError("La suma de equipos no puede superar 250.");
        return false;
      }
    }

    setError("");
    return true;
  };

  return (
    <div className="tratamiento-container">
      <h1 className="titulo">Simulación de Tratamiento</h1>

      <div className="tratamiento-grid">

        {/* ── FORMULARIO ── *//*}
        <div className="formulario">

          <div className="campos-principales">
            <div>
              <label>Equipos recibidos hoy (total)</label>
              <input
                type="text"
                inputMode="numeric"
                value={totalRecibidos}
                onChange={handleTotalChange}
                min="1"
                max="250"
                placeholder="Ej: 120"
              />
            </div>

            <div>
              <label>Empleados disponibles</label>
              <input
                type="text"
                inputMode="numeric"
                value={empleadosDisponibles}
                onChange={handleEmpleadosChange}
                min="1"
                max="150"
                placeholder="Ej: 8"
              />
            </div>
          </div>

          <div className="clasificacion-header">
            <h3>Clasificación de equipos</h3>
            <p className="texto-suma">
              Ingresados: <strong>{sumaActual}</strong> / {totalRecibidos}
            </p>
          </div>

          <div className="equipos-grid">
            {Object.keys(equipos).map((key) => (
              <div key={key}>
                <label>{labels[key]}</label>
                <input
                  type="number"
                  name={key}
                  value={equipos[key]}
                  onChange={handleChange}
                  min="0"
                  disabled={totalRecibidos === ""}
                />
              </div>
            ))}
          </div>

          {error && <p className="texto-error">{error}</p>}

          <div className="botones">
            <button
              className="btn-simular"
              onClick={handleSimular}
              disabled={simulando}
            >
              {simulando ? (
                <>
                  <span className="spinner-simular" aria-hidden="true"></span>
                  Simulando
                </>
              ) : (
                "Simular"
              )}
            </button>
            {resultado && (
              <button className="btn-salir" onClick={handleResetear}>
                Resetear
              </button>
            )}
          </div>

        </div>

        {/* ── RESULTADOS ── *//*}
        <div className="resultados">

          {simulando ? (
            <div className="estado-vacio-resultados">
              <div className="loader-simulacion" aria-hidden="true"></div>
              <h2>Simulando tratamiento</h2>
              <p>Procesando clasificación, destinos y tiempos estimados.</p>
            </div>
          ) : resultado ? (
            <>
              <h2>Resultados de la simulación</h2>

                <div className="tabla-panel">
                  <div className="tabla-panel-header">
                    <h3>Equipos reciclados</h3>
                  </div>
                  <div className="tabla-scroll">
                    <table className="tabla-datos">
                      <thead>
                        <tr>
                          <th>Equipo</th>
                          <th>Cantidad</th>
                          <th>Tiempo promedio (min)</th>
                          <th>Tiempo total (min)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(resultado.detalle).map((key) =>
                          resultado.detalle[key].reciclaje > 0 && (
                            <tr key={key}>
                              <td>{labels[key]}</td>
                              <td>{resultado.detalle[key].reciclaje}</td>
                              <td>{resultado.detalle[key].tiempoPromedioReciclaje.toFixed(1)}</td>
                              <td>{resultado.detalle[key].tiempoReciclaje.toFixed(1)}</td>
                            </tr>
                          )
                        )}
                        {Object.keys(resultado.detalle).every((key) => resultado.detalle[key].reciclaje === 0) && (
                          <tr>
                            <td colSpan={4} className="tabla-vacia">
                              No hubo equipos reciclados
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="tabla-panel">
                  <div className="tabla-panel-header">
                    <h3>Equipos reacondicionados</h3>
                  </div>
                  <div className="tabla-scroll">
                    <table className="tabla-datos">
                      <thead>
                        <tr>
                          <th>Equipo</th>
                          <th>Cantidad</th>
                          <th>Tiempo promedio (min)</th>
                          <th>Tiempo total (min)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(resultado.detalle).map((key) =>
                          resultado.detalle[key].reacondicionamiento > 0 && (
                            <tr key={key}>
                              <td>{labels[key]}</td>
                              <td>{resultado.detalle[key].reacondicionamiento}</td>
                              <td>{resultado.detalle[key].tiempoPromedioReacondicionamiento.toFixed(1)}</td>
                              <td>{resultado.detalle[key].tiempoReacondicionamiento.toFixed(1)}</td>
                            </tr>
                          )
                        )}
                        {Object.keys(resultado.detalle).every((key) => resultado.detalle[key].reacondicionamiento === 0) && (
                          <tr>
                            <td colSpan={4} className="tabla-vacia">
                              No hubo equipos reacondicionados
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="resultado-card mt-3">
                  <p><strong>Tiempo total para procesar todos:</strong> {resultado.TT.toFixed(1)} min ({resultado.HH.toFixed(2)} hs)</p>
                  <p><strong>Equipos procesados en la jornada:</strong> {resultado.equiposProcesados} de {sumaActual}</p>
                  <p><strong>Equipos pendientes para el día siguiente:</strong> {resultado.equiposPendientes}</p>
                  <p><strong>Empleados necesarios:</strong> {resultado.CEMP}</p>
                </div>

                <div style={{
                  marginTop: "12px",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  background: estadoEmpleados.color === "#16a34a" ? "#f0fdf4" : "#fef2f2",
                  borderLeft: `4px solid ${estadoEmpleados.color}`,
                  color: estadoEmpleados.color,
                  fontWeight: "600",
                }}>
                  {estadoEmpleados.msg}
                </div>
            </>
          ) : (
            <div className="estado-vacio-resultados">
              <div className="estado-vacio-icono">
                <BsClipboardData aria-hidden="true" />
              </div>
              <h2>Resultados de la simulación</h2>
              <p>Completá los equipos recibidos y presioná Calcular.</p>
              <div className="resultado-preview-grid">
                <div>
                  <strong>01</strong>
                  <span>Destino de equipos</span>
                  <p>Reciclaje y reacondicionamiento.</p>
                </div>
                <div>
                  <strong>02</strong>
                  <span>Tiempos de proceso</span>
                  <p>Promedios y totales por tipo.</p>
                </div>
                <div>
                  <strong>03</strong>
                  <span>Capacidad diaria</span>
                  <p>Empleados necesarios y pendientes.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Tratamiento;




*/

import { useState } from "react";
import { BsClipboardData } from "react-icons/bs";
import "../css/tratamiento.css";
import GraficoTratamiento from "./GraficoTratamiento";
import { IniciarGenerador, congruencialMixto } from "../simulador/Generadores.js";
import { proceso } from "../simulador/proceso.js";

function Tratamiento() {
  const PROB_REACONDICIONAMIENTO = 0.02;

  const [modo, setModo] = useState("total"); // "total" | "clasificacion"
  const [totalRecibidos, setTotalRecibidos] = useState("");
  const [empleadosDisponibles, setEmpleadosDisponibles] = useState("");
  const [equipos, setEquipos] = useState({
    N: "", PC: "", F: "", M: "", R: "", CPU: "", GPU: "",
  });
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState(null);
  const [simulando, setSimulando] = useState(false);

  const labels = {
    N: "Notebooks", PC: "PCs completas", F: "Fuentes",
    M: "Motherboards", R: "Memorias RAM", CPU: "Procesadores", GPU: "Tarjetas gráficas"
  };

  const sumaActual = Object.values(equipos).reduce((a, b) => a + Number(b || 0), 0);

  const handleModoChange = (nuevoModo) => {
    setModo(nuevoModo);
    setError("");
    setResultado(null);
    setTotalRecibidos("");
    setEquipos({ N: "", PC: "", F: "", M: "", R: "", CPU: "", GPU: "" });
  };

  const handleTotalChange = (e) => {
    const { value } = e.target;

    if (value === "") {
      setTotalRecibidos("");
      setError("");
      setResultado(null);
      return;
    }

    if (!/^\d+$/.test(value) || value.length > 3) {
      return;
    }

    if (Number(value) > 250) {
      setError("La cantidad de equipos recibidos no puede superar 250.");
      return;
    }

    setTotalRecibidos(value);
    setError("");
    setResultado(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === "") {
      setError("");
      setEquipos((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    if (!/^\d+$/.test(value) || value.length > 3) {
      return;
    }

    const nuevaSuma = sumaActual - Number(equipos[name] || 0) + Number(value);

    if (nuevaSuma > 250) {
      setError("La suma de equipos no puede superar 250.");
      return;
    }

    setError("");
    setEquipos((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmpleadosChange = (e) => {
    const { value } = e.target;

    if (value === "") {
      setEmpleadosDisponibles("");
      setError("");
      return;
    }

    if (!/^\d+$/.test(value) || value.length > 3) {
      return;
    }

    if (Number(value) > 150) {
      setError("La cantidad de empleados disponibles no puede superar 150.");
      return;
    }

    setEmpleadosDisponibles(value);
    setError("");
  };

  const ejecutarSimulacion = () => {
    if (empleadosDisponibles === "") {
      setError("Ingresá la cantidad de empleados disponibles.");
      return;
    }
    if (Number(empleadosDisponibles) < 1) {
      setError("La cantidad de empleados disponibles debe ser al menos 1.");
      return;
    }
    if (Number(empleadosDisponibles) > 150) {
      setError("La cantidad de empleados disponibles no puede superar 150.");
      return;
    }

    let clasificacionFinal;

    if (modo === "total") {
      const total = Number(totalRecibidos);
      if (totalRecibidos === "") {
        setError("Ingresá la cantidad de equipos recibidos hoy.");
        return;
      }
      if (total < 1) {
        setError("La cantidad de equipos recibidos debe ser al menos 1.");
        return;
      }
      if (total > 250) {
        setError("La cantidad de equipos recibidos no puede superar 250.");
        return;
      }

      IniciarGenerador(4122, 2147483648);
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
      for (let i = 0; i < total; i++) {
        proceso(contadores);
      }
      clasificacionFinal = {
        N: contadores.N, PC: contadores.PC, F: contadores.F,
        M: contadores.M, R: contadores.R, CPU: contadores.CPU, GPU: contadores.GPU
      };

    } else {
      if (sumaActual === 0) {
        setError("Ingresá al menos un equipo para calcular.");
        return;
      }
      if (sumaActual > 250) {
        setError("La suma de equipos no puede superar 250.");
        return;
      }
      clasificacionFinal = Object.fromEntries(
        Object.entries(equipos).map(([k, v]) => [k, Number(v || 0)])
      );
      IniciarGenerador(4122, 2147483648);
    }

    setError("");

    const tiemposPorDestino = {
      N: { reacondicionamiento: [60, 120], reciclaje: [20, 30] },
      PC: { reacondicionamiento: [45, 90], reciclaje: [20, 40] },
      F: { reacondicionamiento: [10, 20], reciclaje: [7, 11] },
      M: { reacondicionamiento: [15, 30], reciclaje: [5, 10] },
      R: { reacondicionamiento: [5, 10], reciclaje: [1, 3] },
      CPU: { reacondicionamiento: [10, 20], reciclaje: [3, 6] },
      GPU: { reacondicionamiento: [15, 30], reciclaje: [3, 8] },
    };

    const detalle = {};
    Object.keys(clasificacionFinal).forEach((key) => {
      let reciclaje = 0;
      let reacondicionamiento = 0;
      let tiempoReciclaje = 0;
      let tiempoReacondicionamiento = 0;

      const cantidad = clasificacionFinal[key];

      for (let i = 0; i < cantidad; i++) {
        const destino = congruencialMixto() <= PROB_REACONDICIONAMIENTO ? "reacondicionamiento" : "reciclaje";
        const [min, max] = tiemposPorDestino[key][destino];
        const tiempo = min + (max - min) * congruencialMixto();

        if (destino === "reacondicionamiento") {
          reacondicionamiento++;
          tiempoReacondicionamiento += tiempo;
        } else {
          reciclaje++;
          tiempoReciclaje += tiempo;
        }
      }

      const tiempoTotal = tiempoReciclaje + tiempoReacondicionamiento;

      detalle[key] = {
        cantidad,
        reciclaje,
        reacondicionamiento,
        tiempoReciclaje,
        tiempoReacondicionamiento,
        tiempoPromedioReciclaje: reciclaje > 0 ? tiempoReciclaje / reciclaje : 0,
        tiempoPromedioReacondicionamiento:
          reacondicionamiento > 0 ? tiempoReacondicionamiento / reacondicionamiento : 0,
        tiempoPorUnidad: cantidad > 0 ? tiempoTotal / cantidad : 0,
        tiempoTotal,
      };
    });

    const totalEquipos = Object.values(clasificacionFinal).reduce((a, b) => a + b, 0);
    const TT = Object.values(detalle).reduce((a, b) => a + b.tiempoTotal, 0);
    const HH = TT / 60;
    const empleados = Number(empleadosDisponibles);
    const jornadaMin = empleados * 8 * 60;
    const CEMP = Math.ceil(HH / 8);

    const minPorEquipo = TT / totalEquipos;
    const equiposProcesados = Math.min(totalEquipos, Math.floor(jornadaMin / minPorEquipo));
    const equiposPendientes = totalEquipos - equiposProcesados;

    setResultado({
      detalle, TT, HH, CEMP,
      equiposProcesados, equiposPendientes,
      empleadosDisponibles: empleados,
      totalEquipos,
      clasificacionUsada: clasificacionFinal,
      modoUsado: modo,
    });
  };

  const handleSimular = () => {
    setSimulando(true);
    setResultado(null);
    setTimeout(() => {
      ejecutarSimulacion();
      setSimulando(false);
    }, 450);
  };

  const handleResetear = () => {
    setResultado(null);
    setSimulando(false);
    setError("");
    setEquipos({ N: "", PC: "", F: "", M: "", R: "", CPU: "", GPU: "" });
    setTotalRecibidos("");
    setEmpleadosDisponibles("");
  };

  const estadoEmpleados = resultado
    ? resultado.empleadosDisponibles >= resultado.CEMP
      ? {
          msg: `La cantidad de empleados es suficiente (necesarios: ${resultado.CEMP}, disponibles: ${resultado.empleadosDisponibles})`,
          estado: "suficiente",
        }
      : {
          msg: `Se necesitan ${resultado.CEMP} empleados pero solo hay ${resultado.empleadosDisponibles} disponibles.`,
          estado: "insuficiente",
        }
    : null;

  return (
    <div className="tratamiento-container">
      <h1 className="titulo">Simulación de Tratamiento</h1>

      <div className="tratamiento-grid">

        {/* ── FORMULARIO ── */}
        <div className="formulario">

          <div className="modo-tabs">
            <button
              className={`modo-tab${modo === "total" ? " activo" : ""}`}
              onClick={() => handleModoChange("total")}
            >
              Solo total de equipos
            </button>
            <button
              className={`modo-tab${modo === "clasificacion" ? " activo" : ""}`}
              onClick={() => handleModoChange("clasificacion")}
            >
              Solo clasificación
            </button>
          </div>

          <p className="descripcion-modo">
            {modo === "total"
              ? "La simulación clasificará los equipos automáticamente usando el proceso de distribución."
              : "Ingresá la cantidad por tipo de equipo. El total se calcula como la suma de las categorías."}
          </p>

          <div className="campos-principales">
            {modo === "total" && (
              <div>
                <label>Equipos recibidos hoy (total)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={totalRecibidos}
                  onChange={handleTotalChange}
                  min="1"
                  max="250"
                  placeholder="Ej: 120"
                />
              </div>
            )}
            <div>
              <label>Empleados disponibles</label>
              <input
                type="text"
                inputMode="numeric"
                value={empleadosDisponibles}
                onChange={handleEmpleadosChange}
                min="1"
                max="150"
                placeholder="Ej: 8"
              />
            </div>
          </div>

          {modo === "clasificacion" && (
            <>
              <div className="clasificacion-header">
                <h3>Clasificación de equipos</h3>
                <p className="texto-suma">Total: <strong>{sumaActual}</strong></p>
              </div>
              <div className="equipos-grid">
                {Object.keys(equipos).map((key) => (
                  <div key={key}>
                    <label>{labels[key]}</label>
                    <input
                      type="number"
                      name={key}
                      value={equipos[key]}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {error && <p className="texto-error">{error}</p>}

          <div className="botones">
            <button className="btn-simular" onClick={handleSimular} disabled={simulando}>
              {simulando ? (
                <><span className="spinner-simular" aria-hidden="true"></span>Simulando</>
              ) : "Simular"}
            </button>
            {resultado && (
              <button className="btn-salir" onClick={handleResetear}>Resetear</button>
            )}
          </div>

        </div>

        {/* ── RESULTADOS ── */}
        <div className="resultados">

          {simulando ? (
            <div className="estado-vacio-resultados">
              <div className="loader-simulacion" aria-hidden="true"></div>
              <h2>Simulando tratamiento</h2>
              <p>Procesando clasificación, destinos y tiempos estimados.</p>
            </div>
          ) : resultado ? (
            <>
              <h2>Resultados de la simulación</h2>

              {resultado.modoUsado === "total" && (
                <div className="tabla-panel">
                  <div className="tabla-panel-header">
                    <h3>Clasificación generada por proceso</h3>
                  </div>
                  <div className="tabla-scroll">
                    <table className="tabla-datos">
                      <thead>
                        <tr><th>Equipo</th><th>Cantidad asignada</th></tr>
                      </thead>
                      <tbody>
                        {Object.keys(resultado.clasificacionUsada).map((key) =>
                          resultado.clasificacionUsada[key] > 0 && (
                            <tr key={key}>
                              <td>{labels[key]}</td>
                              <td>{resultado.clasificacionUsada[key]}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="tabla-panel">
                <div className="tabla-panel-header"><h3>Equipos reciclados</h3></div>
                <div className="tabla-scroll">
                  <table className="tabla-datos">
                    <thead>
                      <tr>
                        <th>Equipo</th><th>Cantidad</th>
                        <th>Tiempo promedio (min)</th><th>Tiempo total (min)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(resultado.detalle).map((key) =>
                        resultado.detalle[key].reciclaje > 0 && (
                          <tr key={key}>
                            <td>{labels[key]}</td>
                            <td>{resultado.detalle[key].reciclaje}</td>
                            <td>{resultado.detalle[key].tiempoPromedioReciclaje.toFixed(1)}</td>
                            <td>{resultado.detalle[key].tiempoReciclaje.toFixed(1)}</td>
                          </tr>
                        )
                      )}
                      {Object.keys(resultado.detalle).every((key) => resultado.detalle[key].reciclaje === 0) &&
                        <tr><td colSpan={4} className="tabla-vacia">No hubo equipos reciclados</td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="tabla-panel">
                <div className="tabla-panel-header"><h3>Equipos reacondicionados</h3></div>
                <div className="tabla-scroll">
                  <table className="tabla-datos">
                    <thead>
                      <tr>
                        <th>Equipo</th><th>Cantidad</th>
                        <th>Tiempo promedio (min)</th><th>Tiempo total (min)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(resultado.detalle).map((key) =>
                        resultado.detalle[key].reacondicionamiento > 0 && (
                          <tr key={key}>
                            <td>{labels[key]}</td>
                            <td>{resultado.detalle[key].reacondicionamiento}</td>
                            <td>{resultado.detalle[key].tiempoPromedioReacondicionamiento.toFixed(1)}</td>
                            <td>{resultado.detalle[key].tiempoReacondicionamiento.toFixed(1)}</td>
                          </tr>
                        )
                      )}
                      {Object.keys(resultado.detalle).every((key) => resultado.detalle[key].reacondicionamiento === 0) &&
                        <tr><td colSpan={4} className="tabla-vacia">No hubo equipos reacondicionados (probabilidad: 2% por equipo)</td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="resultado-card mt-3">
                <p><strong>Tiempo total para procesar todos:</strong> {resultado.TT.toFixed(1)} min ({resultado.HH.toFixed(1)} hs)</p>
                <p><strong>Equipos procesados en la jornada:</strong> {resultado.equiposProcesados} de {resultado.totalEquipos}</p>
                <p><strong>Equipos pendientes para el día siguiente:</strong> {resultado.equiposPendientes}</p>
                <p><strong>Empleados necesarios:</strong> {resultado.CEMP}</p>
              </div>

              <div className={`estado-empleados ${estadoEmpleados.estado}`}>
                {estadoEmpleados.msg}
              </div>

            </>
          ) : (
            <div className="estado-vacio-resultados">
              <div className="estado-vacio-icono"><BsClipboardData aria-hidden="true" /></div>
              <span className="estado-vacio-etiqueta">Panel de salida</span>
              <h2>Resultados de la simulación</h2>
              <p>Elegí un modo de ingreso y presioná Simular.</p>
              <ul>
                <li>Equipos reciclados</li>
                <li>Equipos reacondicionados</li>
                <li>Tiempos y empleados necesarios</li>
              </ul>
            </div>
          )}

        </div>
      </div>

      {resultado && !simulando && (
        <div className="reportes-tratamiento-seccion">
          <div className="reportes-tratamiento-titulo">
            <h2>Reportes graficos</h2>
            <p>Lectura visual de destinos y tiempos de tratamiento.</p>
          </div>
          <GraficoTratamiento resultado={resultado} labels={labels} />
        </div>
      )}
    </div>
  );
}

export default Tratamiento;























































































































































































































































































































































































































































