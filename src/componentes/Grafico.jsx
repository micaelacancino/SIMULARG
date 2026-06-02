import useMediaQuery from "@mui/material/useMediaQuery";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

function Grafico({ resultados = [] }) {
  const esMobile = useMediaQuery("(max-width:600px)");
  const esTablet = useMediaQuery("(max-width:1000px)");
  const diasNormales = resultados.filter((resultado) => resultado.S === "Normal").length;
  const diasAdversos = resultados.filter((resultado) => resultado.S === "Adversa").length;
  const totalDias = resultados.length || 1;

  const costoZona1 = resultados.reduce((total, resultado) => total + (resultado.PCZ1 || 0), 0);
  const costoZona2 = resultados.reduce((total, resultado) => total + (resultado.PCZ2 || 0), 0);

  const porcentajeNormal = ((diasNormales / totalDias) * 100).toFixed(1);
  const porcentajeAdverso = ((diasAdversos / totalDias) * 100).toFixed(1);

  const datosRutas = [
    {
      id: 0,
      value: diasNormales,
      label: `Normal (${porcentajeNormal}%)`,
      color: "#51B9A0",
    },
    {
      id: 1,
      value: diasAdversos,
      label: `Adversa (${porcentajeAdverso}%)`,
      color: "#F59E0B",
    },
  ];

  const zonaMasCostosa = costoZona1 >= costoZona2 ? "Zona 1" : "Zona 2";
  const diferenciaCosto = Math.abs(costoZona1 - costoZona2);
  const anchoDona = esMobile ? 300 : 360;
  const altoDona = esMobile ? 220 : 240;
  const anchoBarras = esMobile ? 320 : esTablet ? 440 : 520;
  const altoBarras = esMobile ? 240 : 270;

  return (
    <div className="reportes-graficos">
      <div className="grafico-logistica">
        <div className="grafico-header">
          <div>
            <h4>Rutas normales vs adversas</h4>
            <p>Distribucion de escenarios generados en los dias mostrados.</p>
          </div>
          <span>{resultados.length} dias</span>
        </div>

        <div className="grafico-contenido">
          <PieChart
            series={[
              {
                data: datosRutas,
                innerRadius: 54,
                outerRadius: 92,
                paddingAngle: 3,
                cornerRadius: 4,
            },
          ]}
            width={anchoDona}
            height={altoDona}
            margin={{ top: 8, bottom: 8, left: 8, right: 8 }}
            slotProps={{
              legend: { hidden: true },
            }}
          />

          <div className="grafico-leyenda">
            <div>
              <span className="leyenda-color normal"></span>
              <p>Rutas normales</p>
              <strong>
                {diasNormales} dias - {porcentajeNormal}%
              </strong>
            </div>
            <div>
              <span className="leyenda-color adversa"></span>
              <p>Rutas adversas</p>
              <strong>
                {diasAdversos} dias - {porcentajeAdverso}%
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="grafico-logistica">
        <div className="grafico-header">
          <div>
            <h4>Costo total por zona</h4>
            <p>Comparacion del gasto acumulado de combustible.</p>
          </div>
          <span>{zonaMasCostosa}</span>
        </div>

        <div className="grafico-barras">
          <BarChart
            xAxis={[
              {
                data: ["Zona 1", "Zona 2"],
                scaleType: "band",
              },
            ]}
            series={[
              {
                data: [Number(costoZona1.toFixed(2)), Number(costoZona2.toFixed(2))],
                color: "#51B9A0",
                valueFormatter: (valor) => `$${valor.toFixed(2)}`,
              },
            ]}
            width={anchoBarras}
            height={altoBarras}
            margin={{
              top: 20,
              bottom: 36,
              left: esMobile ? 54 : 72,
              right: 18,
            }}
            slotProps={{
              legend: { hidden: true },
            }}
          />
        </div>

        <div className="grafico-decision">
          <p>Zona con mayor costo</p>
          <strong>{zonaMasCostosa}</strong>
          <span>Diferencia: ${diferenciaCosto.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default Grafico;
