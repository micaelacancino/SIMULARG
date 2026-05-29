import React, { useState } from "react";
import "../css/tratamiento.css";
import { IniciarGenerador, lehmer } from "../simulador/Generadores.js";

function Tratamiento() {
  const [tipo, setTipo] = useState("Reacondicionamiento");
  const [totalRecibidos, setTotalRecibidos] = useState(0);
  const [equipos, setEquipos] = useState({
    N: 0,
    PC: 0,
    F: 0,
    M: 0,
    R: 0,
    CPU: 0,
    GPU: 0,
  });
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState(null);

  const labels = {
    N: "Notebooks",
    PC: "PCs completas",
    F: "Fuentes",
    M: "Motherboards",
    R: "Memorias RAM",
    CPU: "Procesadores",
    GPU: "Tarjetas gráficas",
  };

  const sumaActual = Object.values(equipos).reduce((a, b) => a + b, 0);

  const handleTotalChange = (e) => {
    const val = Math.min(Number(e.target.value), 150);
    setTotalRecibidos(val);
    setError("");
    setResultado(null);
    setEquipos({ N: 0, PC: 0, F: 0, M: 0, R: 0, CPU: 0, GPU: 0 });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = Math.min(Number(value), 150);
    if (val < 0) val = 0;

    const nuevasSuma = sumaActual - equipos[name] + val;
    if (nuevasSuma > totalRecibidos) {
      setError(
        `La suma no puede superar ${totalRecibidos} equipos recibidos hoy.`,
      );
      return;
    }

    setError("");
    setEquipos((prev) => ({ ...prev, [name]: val }));
  };

  const calcular = () => {
    if (tipo === "Reciclaje") {
      setError("El proceso de Reciclaje aún no está disponible.");
      return;
    }
    if (totalRecibidos === 0) {
      setError("Ingresá la cantidad de equipos recibidos hoy.");
      return;
    }
    if (sumaActual === 0) {
      setError("Ingresá al menos un equipo para calcular.");
      return;
    }
    if (sumaActual > totalRecibidos) {
      setError(
        `La suma (${sumaActual}) supera el total recibido (${totalRecibidos}).`,
      );
      return;
    }

    setError("");
    IniciarGenerador(4122, 76);

    const tiempos = {
      N: 60 + 60 * lehmer(),
      PC: 45 + 45 * lehmer(),
      F: 10 + 10 * lehmer(),
      M: 15 + 10 * lehmer(),
      R: 8 + 5 * lehmer(),
      CPU: 20 + 10 * lehmer(),
      GPU: 25 + 15 * lehmer(),
    };

    const detalle = {};
    Object.keys(equipos).forEach((key) => {
      detalle[key] = {
        cantidad: equipos[key],
        tiempoPorUnidad: tiempos[key],
        tiempoTotal: equipos[key] * tiempos[key],
      };
    });

    const TT = Object.values(detalle).reduce((a, b) => a + b.tiempoTotal, 0);
    const HH = TT / 60;
    const CEMP = Math.ceil(HH / 8);

    setResultado({ detalle, TT, HH, CEMP });
  };

  const handleResetear = () => {
    setResultado(null);
    setError("");
    setEquipos({ N: 0, PC: 0, F: 0, M: 0, R: 0, CPU: 0, GPU: 0 });
    setTotalRecibidos(0);
  };

  return (
    <div className="tratamiento-container">
      <h1 className="titulo">Simulación de Tratamiento</h1>

      <div className="tratamiento-grid">
        {/* FORMULARIO */}
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

          <label>Equipos recibidos hoy (total)</label>
          <input
            type="number"
            value={totalRecibidos}
            onChange={handleTotalChange}
            min="0"
            max="150" 
            disabled={tipo === "Reciclaje"}
          />

          <h3>Clasificación de equipos</h3>
          <p className="texto-suma">
            Ingresados: <strong>{sumaActual}</strong> / {totalRecibidos}
          </p>

          {/* DOS COLUMNAS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px 16px",
            }}
          >
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
                  disabled={totalRecibidos === 0 || tipo === "Reciclaje"}
                  style={{ width: "100%" }}
                />
              </div>
            ))}
          </div>

          {error && (
            <p
              className="texto-error"
              style={{ color: "red", marginTop: "8px" }}
            >
              {error}
            </p>
          )}

          <div className="botones" style={{ marginTop: "12px" }}>
            <button
              className="btn-simular"
              onClick={calcular}
              disabled={
                totalRecibidos === 0 || sumaActual === 0 || tipo === "Reciclaje"
              }
            >
              Calcular
            </button>
            {resultado && (
              <button className="btn-salir" onClick={handleResetear}>
                Resetear
              </button>
            )}
          </div>
        </div>

        {/* RESULTADOS */}
        <div className="resultados">
          {resultado ? (
            <>
              <h2>Resultados — {tipo}</h2>
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
                  {Object.keys(resultado.detalle).map(
                    (key) =>
                      resultado.detalle[key].cantidad > 0 && (
                        <tr key={key}>
                          <td>{labels[key]}</td>
                          <td>{resultado.detalle[key].cantidad}</td>
                          <td>
                            {resultado.detalle[key].tiempoPorUnidad.toFixed(1)}
                          </td>
                          <td>
                            {resultado.detalle[key].tiempoTotal.toFixed(1)}
                          </td>
                        </tr>
                      ),
                  )}
                </tbody>
              </table>

              <div className="resultado-card mt-3">
                <p>
                  <strong>Tiempo total:</strong> {resultado.TT.toFixed(1)} min
                </p>
                <p>
                  <strong>Horas totales:</strong> {resultado.HH.toFixed(2)} hs
                </p>
                <p>
                  <strong>Empleados necesarios:</strong> {resultado.CEMP}
                </p>
              </div>
            </>
          ) : (
            <h2>
              {tipo === "Reciclaje"
                ? "⚠️ El proceso de Reciclaje aún no está disponible."
                : "Ingresá los equipos y calculá"}
            </h2>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tratamiento;
