import useMediaQuery from "@mui/material/useMediaQuery";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

function GraficoTratamiento({ resultado, labels }) {
  const esMobile = useMediaQuery("(max-width:600px)");
  const esTablet = useMediaQuery("(max-width:1000px)");

  if (!resultado) return null;

  const detalle = resultado.detalle;
  const totalReciclados = Object.values(detalle).reduce(
    (total, item) => total + item.reciclaje,
    0
  );
  const totalReacondicionados = Object.values(detalle).reduce(
    (total, item) => total + item.reacondicionamiento,
    0
  );
  const totalDestino = totalReciclados + totalReacondicionados || 1;

  const porcentajeReciclados = ((totalReciclados / totalDestino) * 100).toFixed(1);
  const porcentajeReacondicionados = ((totalReacondicionados / totalDestino) * 100).toFixed(1);

  const equipos = Object.keys(detalle);
  const labelsCortos = {
    N: "Notebooks",
    PC: "PCs",
    F: "Fuentes",
    M: "Mothers",
    R: "RAM",
    CPU: "CPU",
    GPU: "GPU",
  };
  const tiemposPorEquipo = equipos.map((key) => Number(detalle[key].tiempoTotal.toFixed(1)));
  const tiempoMayorEquipo = Math.max(...tiemposPorEquipo);

  const equipoMayorTiempo = equipos.reduce(
    (mayor, key) =>
      detalle[key].tiempoTotal > detalle[mayor].tiempoTotal ? key : mayor,
    equipos[0]
  );

  const anchoDona = esMobile ? 270 : 300;
  const altoDona = esMobile ? 200 : 215;
  const anchoBarras = esMobile ? 310 : esTablet ? 480 : 590;
  const altoBarras = esMobile ? 250 : 285;

  const datosDestino = [
    {
      id: 0,
      value: totalReciclados,
      label: `Reciclados (${porcentajeReciclados}%)`,
      color: "#51B9A0",
    },
    {
      id: 1,
      value: totalReacondicionados,
      label: `Reacondicionados (${porcentajeReacondicionados}%)`,
      color: "#F59E0B",
    },
  ];

  return (
    <div className="reportes-tratamiento">
      <div className="grafico-tratamiento-card">
        <div className="grafico-tratamiento-header">
          <div>
            <h3>Reciclados vs reacondicionados</h3>
            <p>Distribucion del destino final de los equipos procesados.</p>
          </div>
          <span>{totalDestino} equipos</span>
        </div>

        <div className="grafico-kpis">
          <div>
            <span>Total reciclados</span>
            <strong>{totalReciclados}</strong>
          </div>
          <div>
            <span>Total reacondicionados</span>
            <strong>{totalReacondicionados}</strong>
          </div>
        </div>

        <div className="grafico-tratamiento-contenido">
          <PieChart
            series={[
              {
                data: datosDestino,
                innerRadius: 48,
                outerRadius: 80,
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

          <div className="grafico-tratamiento-leyenda">
            <div>
              <span className="leyenda-destino reciclado"></span>
              <p>Reciclados</p>
              <strong>
                {totalReciclados} equipos - {porcentajeReciclados}%
              </strong>
            </div>
            <div>
              <span className="leyenda-destino reacondicionado"></span>
              <p>Reacondicionados</p>
              <strong>
                {totalReacondicionados} equipos - {porcentajeReacondicionados}%
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="grafico-tratamiento-card grafico-tratamiento-card-ancho">
        <div className="grafico-tratamiento-header">
          <div>
            <h3>Tiempo total por tipo de equipo</h3>
            <p>Comparacion de la carga de trabajo acumulada por categoria.</p>
          </div>
          <span>{labels[equipoMayorTiempo]}</span>
        </div>

        <div className="grafico-kpis">
          <div>
            <span>Mayor carga</span>
            <strong>{labels[equipoMayorTiempo]}</strong>
          </div>
          <div>
            <span>Tiempo acumulado</span>
            <strong>{tiempoMayorEquipo.toFixed(1)} min</strong>
          </div>
        </div>

        <div className="grafico-tratamiento-barras">
          <BarChart
            xAxis={[
              {
                data: equipos.map((key) => labelsCortos[key]),
                scaleType: "band",
              },
            ]}
            series={[
              {
                data: tiemposPorEquipo,
                color: "#51B9A0",
                valueFormatter: (valor) => `${valor.toFixed(1)} min`,
              },
            ]}
            width={anchoBarras}
            height={altoBarras}
            margin={{
              top: 20,
              bottom: esMobile ? 92 : 74,
              left: esMobile ? 52 : 70,
              right: 18,
            }}
            slotProps={{
              legend: { hidden: true },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default GraficoTratamiento;
