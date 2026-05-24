import React, { useState } from "react";
import "../css/tratamiento.css";

function Tratamiento() {

  const [tipo, setTipo] = useState("Reciclaje");
  const [equipos, setEquipos] = useState(10);
  const [empleados, setEmpleados] = useState(2);

  const [resultado, setResultado] = useState(null);

  const simularTratamiento = () => {

    const capacidadPorEmpleado = tipo === "Reciclaje" ? 5 : 3;

    const procesados = empleados * capacidadPorEmpleado;

    const pendientes = equipos - procesados > 0
      ? equipos - procesados
      : 0;

    const tiempo = (equipos / empleados).toFixed(1);

    setResultado({
      procesados,
      pendientes,
      tiempo,
    });
  };

  return (
    <div className="tratamiento-container">

      <h1 className="titulo">
        Simulación de Tratamiento
      </h1>

      <div className="tratamiento-grid">

        {/* FORMULARIO */}
        <div className="formulario">

          <label>Tipo de Tratamiento</label>

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option>Reciclaje</option>
            <option>Reacondicionamiento</option>
          </select>

          <label>Cantidad de Equipos</label>

          <input
            type="number"
            value={equipos}
            onChange={(e) => setEquipos(e.target.value)}
            min="1"
          />

          <label>Cantidad de Empleados</label>

          <input
            type="number"
            value={empleados}
            onChange={(e) => setEmpleados(e.target.value)}
            min="1"
          />

          <button onClick={simularTratamiento}>
            Simular Tratamiento
          </button>

        </div>

        {/* RESULTADOS */}
        <div className="resultados">

          {resultado ? (
            <>
              <h2>Resultados</h2>

              <div className="resultado-card">

                <p>
                  <strong>Tratamiento:</strong> {tipo}
                </p>

                <p>
                  <strong>Equipos ingresados:</strong> {equipos}
                </p>

                <p>
                  <strong>Empleados:</strong> {empleados}
                </p>

                <p>
                  <strong>Equipos procesados:</strong>
                  {" "}
                  {resultado.procesados}
                </p>

                <p>
                  <strong>Equipos pendientes:</strong>
                  {" "}
                  {resultado.pendientes}
                </p>

                <p>
                  <strong>Tiempo estimado:</strong>
                  {" "}
                  {resultado.tiempo} hs
                </p>

              </div>
            </>
          ) : (
            <h2>Esperando simulación...</h2>
          )}

        </div>

      </div>

    </div>
  );
}

export default Tratamiento;