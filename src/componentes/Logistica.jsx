import React, { useState } from "react";
import "../css/logistica.css";
import MapaPuntos from "./MapaPuntos";
import { Simulador } from "../simulador/simulador.js";
import { IniciarGenerador } from "../simulador/Generadores.js";

function Logistica() {
  const [condicion, setCondicion] = useState("Normal");
  const [resultados, setResultados] = useState([]);

  const handleResetear = () => setResultados([]);

  async function handleSimular() {
    const semilla = Math.floor(Math.random() * 9000) + 1000;
    IniciarGenerador(semilla, 76);
    const datos = [];
    await Simulador(datos, 31, condicion);
    setResultados(datos);
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

            {/* TIPO DE CONDICIÓN */}
            <div className="campo">
              <label>
                <i className="bi bi-cloud-fill"></i>
                Tipo de condición
              </label>
              <select value={condicion} onChange={(e) => setCondicion(e.target.value)}>
                <option>Normal</option>
                <option>Adversa</option>
              </select>
            </div>

            {/* BOTONES */}
            <div className="botones">
              <button className="btn-simular" onClick={handleSimular}>
                Simular
              </button>
              {resultados.length > 0 && (
                <button className="btn-salir" onClick={handleResetear}>
                  Resetear
                </button>
              )}
            </div>
          </div>

          {/* MAPA */}
          <div className="mapa-container">
            <MapaPuntos zona="Zona 1" />
          </div>

        </div>
      </div>

      {/* RESULTADOS */}
      {resultados.length > 0 && (
        <div className="resultados-container">
          <h3 className="text-center m-4">Resultados de la simulación</h3>

          <div className="tablas-zona">

            {/* ZONA 1 */}
            <div className="tabla-wrapper">
              <h5>Zona 1</h5>
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Situación</th>
                    <th>Km</th>
                    <th>Duración (min)</th>
                    <th>Litros</th>
                    <th>Precio ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map((r) => (
                    <tr key={r.dia}>
                      <td>{r.dia}</td>
                      <td>{r.S}</td>
                      <td>{r.KMZ1?.toFixed(2)}</td>
                      <td>{r.DVZ1?.toFixed(2)}</td>
                      <td>{r.LCZ1?.toFixed(2)}</td>
                      <td>{r.PCZ1?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ZONA 2 */}
            <div className="tabla-wrapper">
              <h5>Zona 2</h5>
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Situación</th>
                    <th>Km</th>
                    <th>Duración (min)</th>
                    <th>Litros</th>
                    <th>Precio ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map((r) => (
                    <tr key={r.dia}>
                      <td>{r.dia}</td>
                      <td>{r.S}</td>
                      <td>{r.KMZ2?.toFixed(2)}</td>
                      <td>{r.DVZ2?.toFixed(2)}</td>
                      <td>{r.LCZ2?.toFixed(2)}</td>
                      <td>{r.PCZ2?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}

export default Logistica;
