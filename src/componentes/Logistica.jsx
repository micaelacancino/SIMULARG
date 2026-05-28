import React, { useState } from "react";
import "../css/logistica.css";
import MapaPuntos from "./MapaPuntos";

function Logistica() {
  const [zona, setZona] = useState("Zona 1");
  const [camiones, setCamiones] = useState();
  const [clima, setClima] = useState(0);

  const climas = ["Normal", "Lluvia", "Tormenta"];

  return (
    <div className="logistica-container d-flex ">
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

    // SOLO NÚMEROS
    valor = valor.replace(/\D/g, "");

    // SOLO PERMITIR 1
    if (Number(valor) > 1) {
      valor = 1;
    }

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
                  ☀️
                  <span>Normal</span>
                </div>

                <div className={clima === 1 ? "activo" : ""}>
                  🌧️
                  <span>Lluvia</span>
                </div>

                <div className={clima === 2 ? "activo" : ""}>
                  ⛈️
                  <span>Tormenta</span>
                </div>
              </div>
            </div>
          </div>

          {/* BOTONES */}
          <div className="botones">
            <button className="btn-simular">Simular</button>

            <button className="btn-salir">Salir</button>
          </div>
        </div>
      <div className="mapa-container">
        {/* DERECHA */}
        <MapaPuntos zona={zona} />
        </div> 
      </div>
    </div>
  );
}



export default Logistica;
