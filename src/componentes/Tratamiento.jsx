import { useState } from "react";
import "../css/tratamiento.css";
import { IniciarGenerador, congruencialMixto } from "../simulador/Generadores.js";
import { Simulador } from "../simulador/simulador.js";

function Tratamiento() {
  const DIAS_SIMULACION = 60;
  const [tipo, setTipo] = useState("Reacondicionamiento");

  // ── REACONDICIONAMIENTO ──
  const [totalRecibidos, setTotalRecibidos] = useState(0);
  const [empleadosDisponibles, setEmpleadosDisponibles] = useState(1);
  const [equipos, setEquipos] = useState({
    N: 0, PC: 0, F: 0, M: 0, R: 0, CPU: 0, GPU: 0,
  });
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState(null);

  // ── RECICLAJE ──
  const [simDatos, setSimDatos] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(1);
  const [simCorrida, setSimCorrida] = useState(false);
  const [empleadosReciclaje, setEmpleadosReciclaje] = useState(1);

  const labels = {
    N: "Notebooks", PC: "PCs completas", F: "Fuentes",
    M: "Motherboards", R: "Memorias RAM", CPU: "Procesadores", GPU: "Tarjetas gráficas"
  };

  // labels para contadores de reciclaje por tipo
  const labelsReciclaje = {
    CNR: "Notebooks recicladas",
    CPCR: "PCs recicladas",
    CFR: "Fuentes recicladas",
    CMR: "Motherboards recicladas",
    CRR: "RAMs recicladas",
    CCPUR: "Procesadores reciclados",
    CGPUR: "GPUs recicladas",
  };

  const sumaActual = Object.values(equipos).reduce((a, b) => a + b, 0);

  // ── HANDLERS REACONDICIONAMIENTO ──
  const handleTotalChange = (e) => {
    const val = Math.min(Number(e.target.value), 150);
    setTotalRecibidos(val);
    setError("");
    setResultado(null);
    setEquipos({ N: 0, PC: 0, F: 0, M: 0, R: 0, CPU: 0, GPU: 0 });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = Math.min(Number(value), 100);
    if (val < 0) val = 0;
    const nuevasSuma = sumaActual - equipos[name] + val;
    if (nuevasSuma > totalRecibidos) {
      setError(`La suma no puede superar ${totalRecibidos} equipos recibidos hoy.`);
      return;
    }
    setError("");
    setEquipos((prev) => ({ ...prev, [name]: val }));
  };

  const calcular = () => {
    if (totalRecibidos === 0) {
      setError("Ingresá la cantidad de equipos recibidos hoy.");
      return;
    }
    if (sumaActual === 0) {
      setError("Ingresá al menos un equipo para calcular.");
      return;
    }
    if (sumaActual > totalRecibidos) {
      setError(`La suma (${sumaActual}) supera el total recibido (${totalRecibidos}).`);
      return;
    }

    setError("");
    IniciarGenerador(4122, 76);

    const tiempos = {
      N: 60 + 60 * congruencialMixto(),
      PC: 45 + 45 * congruencialMixto(),
      F: 10 + 10 * congruencialMixto(),
      M: 15 + 10 * congruencialMixto(),
      R: 8 + 5 * congruencialMixto(),
      CPU: 20 + 10 * congruencialMixto(),
      GPU: 25 + 15 * congruencialMixto(),
    };

    const detalle = {};
    Object.keys(equipos).forEach((key) => {
      detalle[key] = {
        cantidad: equipos[key],
        tiempoPorUnidad: tiempos[key],
        tiempoTotal: equipos[key] * tiempos[key],
      };
    });

    const TT   = Object.values(detalle).reduce((a, b) => a + b.tiempoTotal, 0);
    const HH   = TT / 60;
    const jornadaMin = empleadosDisponibles * 8 * 60;
    const CEMP = Math.ceil(HH / 8);

    const minPorEquipo = TT / sumaActual;
    const equiposProcesados = Math.min(sumaActual, Math.floor(jornadaMin / minPorEquipo));
    const equiposPendientes = sumaActual - equiposProcesados;

    setResultado({
      detalle, TT, HH, CEMP,
      equiposProcesados, equiposPendientes,
      empleadosDisponibles,
    });
  };

  const handleResetear = () => {
    setResultado(null);
    setError("");
    setEquipos({ N: 0, PC: 0, F: 0, M: 0, R: 0, CPU: 0, GPU: 0 });
    setTotalRecibidos(0);
    setEmpleadosDisponibles(1);
  };

  // ── HANDLERS RECICLAJE ──
  const handleSimularReciclaje = async () => {
    const semilla = Math.floor(Math.random() * 9000) + 1000;
    IniciarGenerador(semilla, 76);
    const datos = [];
    await Simulador(datos, DIAS_SIMULACION);
    setSimDatos(datos);
    setDiaSeleccionado(1);
    setSimCorrida(true);
  };

  const handleResetearReciclaje = () => {
    setSimDatos([]);
    setSimCorrida(false);
    setDiaSeleccionado(1);
    setEmpleadosReciclaje(1);
  };

  // día seleccionado de la simulación
  const diaData = simDatos.find((d) => d.dia === diaSeleccionado);

  // comparación empleados (reacondicionamiento)
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

          <label>Tipo de tratamiento</label>
          <select
            value={tipo}
            onChange={(e) => {
              setTipo(e.target.value);
              setError("");
              setResultado(null);
            }}
          >
            <option>Reacondicionamiento</option>
            <option>Reciclaje</option>
          </select>

          {/* ── PANEL REACONDICIONAMIENTO ── */}
          {tipo === "Reacondicionamiento" && (
            <>
              <label>Equipos recibidos hoy (total)</label>
              <input
                type="number"
                value={totalRecibidos}
                onChange={handleTotalChange}
                min="0"
                max="150"
              />

              <label>Empleados disponibles</label>
              <input
                type="number"
                value={empleadosDisponibles}
                onChange={(e) => setEmpleadosDisponibles(Math.min(Math.max(1, Number(e.target.value)), 50))}
                min="1"
                max="50"
              />

              <h3>Clasificación de equipos</h3>
              <p className="texto-suma">
                Ingresados: <strong>{sumaActual}</strong> / {totalRecibidos}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
                {Object.keys(equipos).map((key) => (
                  <div key={key}>
                    <label style={{ fontSize: "0.85rem" }}>{labels[key]}</label>
                    <input
                      type="number"
                      name={key}
                      value={equipos[key]}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      disabled={totalRecibidos === 0}
                      style={{ width: "100%" }}
                    />
                  </div>
                ))}
              </div>

              {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}

              <div className="botones" style={{ marginTop: "12px" }}>
                <button
                  className="btn-simular"
                  onClick={calcular}
                  disabled={totalRecibidos === 0 || sumaActual === 0}
                >
                  Calcular
                </button>
                {resultado && (
                  <button className="btn-salir" onClick={handleResetear}>
                    Resetear
                  </button>
                )}
              </div>
            </>
          )}

          {/* ── PANEL RECICLAJE ── */}
          {tipo === "Reciclaje" && (
            <>
              <p style={{ fontSize: "0.9rem", color: "#555", marginTop: "8px" }}>
                Se correrá la simulación de {DIAS_SIMULACION} días y podrás ver los equipos reciclados por día.
              </p>

              {simCorrida && (
                <>
                  <label>Seleccionar día</label>
                  <select
                    value={diaSeleccionado}
                    onChange={(e) => setDiaSeleccionado(Number(e.target.value))}
                  >
                    {simDatos.map((d) => (
                      <option key={d.dia} value={d.dia}>
                        Día {d.dia} — {d.S}
                      </option>
                    ))}
                  </select>

                  <label>Empleados disponibles</label>
                  <input
                    type="number"
                    value={empleadosReciclaje}
                    onChange={(e) => setEmpleadosReciclaje(Math.min(Math.max(1, Number(e.target.value)), 50))}
                    min="1"
                    max="50"
                  />
                </>
              )}

              <div className="botones" style={{ marginTop: "12px" }}>
                <button className="btn-simular" onClick={handleSimularReciclaje}>
                  {simCorrida ? "Volver a simular" : "Simular"}
                </button>
                {simCorrida && (
                  <button className="btn-salir" onClick={handleResetearReciclaje}>
                    Resetear
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── RESULTADOS ── */}
        <div className="resultados">

          {/* RESULTADOS REACONDICIONAMIENTO */}
          {tipo === "Reacondicionamiento" && (
            resultado ? (
              <>
                <h2>Resultados — Reacondicionamiento</h2>

                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>Equipo</th>
                      <th>Cantidad</th>
                      <th>Tiempo por unidad (min)</th>
                      <th>Tiempo total (min)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(resultado.detalle).map((key) =>
                      resultado.detalle[key].cantidad > 0 && (
                        <tr key={key}>
                          <td>{labels[key]}</td>
                          <td>{resultado.detalle[key].cantidad}</td>
                          <td>{resultado.detalle[key].tiempoPorUnidad.toFixed(1)}</td>
                          <td>{resultado.detalle[key].tiempoTotal.toFixed(1)}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>

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
              <h2>Ingresá los equipos y calculá</h2>
            )
          )}

          {/* RESULTADOS RECICLAJE */}
          {tipo === "Reciclaje" && (
            !simCorrida ? (
              <h2>Presioná Simular para ver los resultados de reciclaje</h2>
            ) : diaData ? (() => {
              // ── CÁLCULO DE JORNADA RECICLAJE ──
              const jornadaMinR = empleadosReciclaje * 8 * 60;
              const CEMPr = Math.ceil(diaData.TR / 60 / 8);
              const equiposProcR = diaData.ER > 0
                ? Math.min(diaData.ER, Math.floor(jornadaMinR / (diaData.TR / diaData.ER)))
                : 0;
              const equiposPendR = diaData.ER - equiposProcR;
              const estadoEmpR = empleadosReciclaje >= CEMPr
                ? { msg: `✅ La cantidad de empleados es suficiente (necesarios: ${CEMPr}, disponibles: ${empleadosReciclaje}).`, color: "#16a34a" }
                : { msg: `⚠️ Se necesitan ${CEMPr} empleados pero solo hay ${empleadosReciclaje} disponibles. Faltan ${CEMPr - empleadosReciclaje}.`, color: "#dc2626" };

              return (
                <>
                  <h2>Reciclaje — Día {diaData.dia} ({diaData.S})</h2>

                  {/* RESUMEN DEL DÍA */}
                  <div className="resultado-card mb-3">
                    <p><strong>Equipos recibidos estimados:</strong> {diaData.CE}</p>
                    <p><strong>Total equipos reciclados:</strong> {diaData.ER}</p>
                    <p><strong>Tiempo total de reciclaje:</strong> {diaData.TR?.toFixed(1)} min ({(diaData.TR / 60).toFixed(2)} hs)</p>
                    <p><strong>Empleados necesarios:</strong> {CEMPr}</p>
                    <p><strong>Equipos procesados en la jornada:</strong> {equiposProcR} de {diaData.ER}</p>
                    <p><strong>Equipos pendientes para el día siguiente:</strong> {equiposPendR}</p>
                  </div>

                  {/* TABLA POR TIPO */}
                  <table className="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <th>Tipo de equipo</th>
                        <th>Cantidad reciclada</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(labelsReciclaje).map(([key, label]) =>
                        diaData[key] > 0 && (
                          <tr key={key}>
                            <td>{label}</td>
                            <td>{diaData[key]}</td>
                          </tr>
                        )
                      )}
                      {Object.keys(labelsReciclaje).every((k) => !diaData[k] || diaData[k] === 0) && (
                        <tr>
                          <td colSpan={2} style={{ textAlign: "center", color: "#888" }}>
                            No se reciclaron equipos este día
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* COMPARACIÓN EMPLEADOS */}
                  <div style={{
                    marginTop: "12px",
                    padding: "14px 18px",
                    borderRadius: "12px",
                    background: estadoEmpR.color === "#16a34a" ? "#f0fdf4" : "#fef2f2",
                    borderLeft: `4px solid ${estadoEmpR.color}`,
                    color: estadoEmpR.color,
                    fontWeight: "600",
                  }}>
                    {estadoEmpR.msg}
                  </div>

                  {/* COMPARACIÓN CON REACONDICIONAMIENTO */}
                  <div className="resultado-card mt-3">
                    <p><strong>Equipos reacondicionados ese día:</strong> {diaData.ERA}</p>
                    <p><strong>Tiempo de reacondicionamiento:</strong> {diaData.TRA?.toFixed(1)} min</p>
                    <p><strong>Tiempo total del día (ambos procesos):</strong> {diaData.TT?.toFixed(1)} min ({diaData.HH?.toFixed(2)} hs)</p>
                  </div>
                </>
              );
            })() : null
          )}

        </div>
      </div>
    </div>
  );
}

export default Tratamiento;
