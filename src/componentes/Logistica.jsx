import React, { useState } from "react";
import "../css/logistica.css";
import MapaPuntos from "./MapaPuntos";
import { Simulador } from "../simulador/simulador.js";
import { IniciarGenerador } from "../simulador/Generadores.js";

function Logistica() {
  const [zona, setZona] = useState("Zona 1");
  const [camiones, setCamiones] = useState("");
  const [clima, setClima] = useState(0);
  const [resultados, setResultados] = useState([]);

  const handleResetear = () => {
    setResultados([]);
  };

  async function handleSimular() {
    IniciarGenerador(4122, 76);
    const datos = [];
    await Simulador(datos, 31);
    setResultados(datos);
    console.log(datos);
  }

  return (
    <section>
      <div className="logistica-container d-flex">
        <div className="logistica-card">
          {/* IZQUIERDA */}
          <div className="panel-control">
            <h1 className="titulo">
              <i className="bi bi-truck"></i>
              Logística
            </h1>

            {/* ZONA */}
            <div className="campo">
              <label>
                <i className="bi bi-geo-alt-fill"></i>
                Puntos limpios a recoger
              </label>
              <select value={zona} onChange={(e) => setZona(e.target.value)}>
                <option>Zona 1</option>
                <option>Zona 2</option>
              </select>
            </div>

            {/* CAMIONES */}
            <label>Cantidad de camiones</label>
            <input
              type="text"
              placeholder="Máximo 1"
              value={camiones}
              onChange={(e) => {
                let valor = e.target.value;
                valor = valor.replace(/\D/g, "");
                if (Number(valor) > 1) valor = 1;
                setCamiones(valor);
              }}
              className="input-camiones"
            />

            {/* CLIMA */}
            <div className="campo">
              <label>
                <i className="bi bi-cloud-fill"></i>
                Condición climática
              </label>
              <div className="clima-container">
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="1"
                  value={clima}
                  onChange={(e) => setClima(Number(e.target.value))}
                  className="slider"
                />
                <div className="clima-opciones">
                  <div className={clima === 0 ? "activo" : ""}>
                    ☀️<span>Normal</span>
                  </div>
                  <div className={clima === 1 ? "activo" : ""}>
                    🌧️<span>Lluvia</span>
                  </div>
                  <div className={clima === 2 ? "activo" : ""}>
                    ⛈️<span>Tormenta</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTONES */}
            <div className="botones">
              <button className="btn-simular" onClick={handleSimular}>
                Simular
              </button>
              <button className="btn-salir">Salir</button>
              {resultados.length > 0 && (
                <button className="btn-salir" onClick={handleResetear}>
                  Resetear
                </button>
              )}
            </div>
          </div>

          {/* MAPA */}
          <div className="mapa-container">
            <MapaPuntos zona={zona} />
          </div>
        </div>
      </div>

      {/* RESULTADOS */}
      {resultados.length > 0 && (
        <div className="resultados-container">
          <h2>Resultados de la simulación — {zona}</h2>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Día</th>
                <th>Situación</th>
                <th>Km Recorridos</th>
                <th>Duración Viaje (min)</th>
                <th>Litros Combustible</th>
                <th>Precio Combustible ($)</th>
                <th>Peso Recibido (kg)</th>
                <th>Equipos Estimados</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((r) => (
                <tr key={r.dia}>
                  <td>{r.dia}</td>
                  <td>{r.S}</td>
                  <td>
                    {zona === "Zona 1"
                      ? r.KMZ1?.toFixed(2)
                      : r.KMZ2?.toFixed(2)}
                  </td>
                  <td>
                    {zona === "Zona 1"
                      ? r.DVZ1?.toFixed(2)
                      : r.DVZ2?.toFixed(2)}
                  </td>
                  <td>
                    {zona === "Zona 1"
                      ? r.LCZ1?.toFixed(2)
                      : r.LCZ2?.toFixed(2)}
                  </td>
                  <td>
                    {zona === "Zona 1"
                      ? r.PCZ1?.toFixed(2)
                      : r.PCZ2?.toFixed(2)}
                  </td>
                  <td>{r.P}</td>
                  <td>{r.CE?.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Logistica;
