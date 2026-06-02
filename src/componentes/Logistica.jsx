import { useRef, useState } from "react";
import "../css/logistica.css";
import Grafico from "./Grafico";
import MapaPuntos from "./MapaPuntos";
import { Simulador } from "../simulador/simulador.js";
import { IniciarGenerador } from "../simulador/Generadores.js";

function Logistica() {
  const DIAS_SIMULACION = 60;
  const [diasAMostrar, setDiasAMostrar] = useState("");
  const [resultados, setResultados] = useState([]);
  const [errorDias, setErrorDias] = useState("");
  const [simulando, setSimulando] = useState(false);
  const [zonaMapa, setZonaMapa] = useState("Zona 1");
  const resultadosRef = useRef(null);

  const handleResetear = () => {
    setResultados([]);
    setDiasAMostrar("");
    setErrorDias("");
    setSimulando(false);
  };
  const cantidadDiasAMostrar = diasAMostrar === "" ? DIAS_SIMULACION : Number(diasAMostrar);
  const resultadosFiltrados = resultados.slice(0, cantidadDiasAMostrar);
  const resumen = resultadosFiltrados.reduce(
    (acc, r) => ({
      zona1: {
        km: acc.zona1.km + (r.KMZ1 || 0),
        costo: acc.zona1.costo + (r.PCZ1 || 0),
        duracion: acc.zona1.duracion + (r.DVZ1 || 0),
      },
      zona2: {
        km: acc.zona2.km + (r.KMZ2 || 0),
        costo: acc.zona2.costo + (r.PCZ2 || 0),
        duracion: acc.zona2.duracion + (r.DVZ2 || 0),
      },
    }),
    {
      zona1: { km: 0, costo: 0, duracion: 0 },
      zona2: { km: 0, costo: 0, duracion: 0 },
    }
  );

  const handleDiasAMostrar = (e) => {
    if (e.target.value === "") {
      setDiasAMostrar("");
      setErrorDias("");
      return;
    }

    const valor = Number(e.target.value);
    setDiasAMostrar(Math.min(Math.max(valor, 1), DIAS_SIMULACION));
    setErrorDias("");
  };

  async function ejecutarSimulacion() {
    const semilla = Math.floor(Math.random() * 9000) + 1000;
    IniciarGenerador(semilla, 76);
    const datos = [];
    await Simulador(datos, DIAS_SIMULACION);
    setResultados(datos);
    setErrorDias("");
  }

  function handleSimular() {
    if (diasAMostrar === "") {
      setResultados([]);
      setErrorDias("Ingresá la cantidad de días que querés visualizar.");
      return;
    }

    setSimulando(true);
    setResultados([]);

    setTimeout(async () => {
      await ejecutarSimulacion();
      setSimulando(false);
      setTimeout(() => {
        resultadosRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 80);
    }, 450);
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

            <div className="logistica-info">
              <div>
                <span>Simulación</span>
                <strong>{DIAS_SIMULACION} días</strong>
              </div>
              <div>
                <span>Vista</span>
                <strong>{diasAMostrar || "-"} días</strong>
              </div>
              <div>
                <span>Rutas</span>
                <strong>2 zonas</strong>
              </div>
            </div>

            {/* CANTIDAD DE DIAS A MOSTRAR */}
            <div className="campo">
              <label>
                <i className="bi bi-calendar-range"></i>
                Ingrese cantidad de días a mostrar (1-{DIAS_SIMULACION}):
              </label>
              <input
                type="number"
                min="1"
                max={DIAS_SIMULACION}
                value={diasAMostrar}
                onChange={handleDiasAMostrar}
                placeholder="Ej: 15"
              />
              {errorDias && <p className="mensaje-error">{errorDias}</p>}
            </div>

            {/* BOTONES */}
            <div className="botones">
              <button className="btn-simular" onClick={handleSimular} disabled={simulando}>
                {simulando ? (
                  <>
                    <span className="spinner-simular" aria-hidden="true"></span>
                    Simulando
                  </>
                ) : (
                  "Simular"
                )}
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
            <div className="mapa-header">
              <div>
                <h2>Mapa de puntos de recolección</h2>
                <p>Visualización territorial de la ruta activa.</p>
              </div>
              <div className="mapa-zona-toggle" aria-label="Seleccionar zona del mapa">
                <button
                  type="button"
                  className={zonaMapa === "Zona 1" ? "activo" : ""}
                  onClick={() => setZonaMapa("Zona 1")}
                >
                  Zona 1
                </button>
                <button
                  type="button"
                  className={zonaMapa === "Zona 2" ? "activo" : ""}
                  onClick={() => setZonaMapa("Zona 2")}
                >
                  Zona 2
                </button>
              </div>
            </div>
            <MapaPuntos zona={zonaMapa} />
          </div>

        </div>
      </div>

      {/* RESULTADOS */}
      {simulando && (
        <div className="resultados-container">
          <div className="estado-logistica">
            <div className="loader-logistica" aria-hidden="true"></div>
            <h3>Simulando rutas</h3>
            <p>Calculando recorridos, duración, combustible y costos estimados.</p>
          </div>
        </div>
      )}

      {!simulando && resultados.length === 0 && (
        <div className="resultados-container">
          <div className="estado-logistica">
            <div className="estado-logistica-icono" aria-hidden="true">▦</div>
            <h3>Resultados de logística</h3>
            <p>Ingresá la cantidad de días y presioná Simular para ver el detalle por zona.</p>
          </div>
        </div>
      )}

      {!simulando && resultados.length > 0 && (
        <div className="resultados-container" ref={resultadosRef}>
          <h3 className="text-center m-4">
            Resultados de la simulación ({resultadosFiltrados.length} de {resultados.length} días)
          </h3>

          <div className="resumen-logistica resumen-logistica-zonas">
            <div className="resumen-card resumen-dias">
              <span>Días mostrados</span>
              <strong>{resultadosFiltrados.length}</strong>
            </div>
            <div className="resumen-zona-card">
              <div className="resumen-zona-header">
                <span>Zona 1</span>
                <strong>Recolección</strong>
              </div>
              <div className="resumen-zona-grid">
                <div>
                  <span>Km</span>
                  <strong>{resumen.zona1.km.toFixed(1)}</strong>
                </div>
                <div>
                  <span>Duración</span>
                  <strong>{resumen.zona1.duracion.toFixed(1)} min</strong>
                </div>
                <div>
                  <span>Costo</span>
                  <strong>${resumen.zona1.costo.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            <div className="resumen-zona-card">
              <div className="resumen-zona-header">
                <span>Zona 2</span>
                <strong>Recolección</strong>
              </div>
              <div className="resumen-zona-grid">
                <div>
                  <span>Km</span>
                  <strong>{resumen.zona2.km.toFixed(1)}</strong>
                </div>
                <div>
                  <span>Duración</span>
                  <strong>{resumen.zona2.duracion.toFixed(1)} min</strong>
                </div>
                <div>
                  <span>Costo</span>
                  <strong>${resumen.zona2.costo.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>

          <Grafico resultados={resultadosFiltrados} />

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
                  {resultadosFiltrados.map((r) => (
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
                  {resultadosFiltrados.map((r) => (
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








































































































































































    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
  


