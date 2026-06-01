import { useState } from "react";
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

  return (
    <div className="tratamiento-container">
      <h1 className="titulo">Simulación de Tratamiento</h1>

      <div className="tratamiento-grid">

        {/* ── FORMULARIO ── */}
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
              <ul>
                <li>Equipos reciclados</li>
                <li>Equipos reacondicionados</li>
                <li>Tiempos y empleados necesarios</li>
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Tratamiento;
