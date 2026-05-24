import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import puntosVerdes from "../helpers/puntosVerdes";


// CAMBIAR UBICACIÓN AUTOMÁTICAMENTE
function CambiarMapa({ centro }) {

  const map = useMap();

  map.setView(centro, 12);

  return null;
}

function MapaPuntos({ zona }) {

  // FILTRAR PUNTOS SEGÚN ZONA
  const puntosFiltrados = puntosVerdes.filter(
    (punto) => punto.zona === zona
  );

  // CENTRO DEL MAPA SEGÚN ZONA
  const centroMapa =
    zona === "Zona 1"
      ? [-32.8895, -68.8440]
      : [-32.9500, -68.8300];

  return (

    <MapContainer
      center={centroMapa}
      zoom={12}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "20px",
      }}
    >

      {/* MOVER MAPA AUTOMÁTICAMENTE */}
      <CambiarMapa centro={centroMapa} />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* MOSTRAR PUNTOS */}
      {puntosFiltrados.map((punto, index) => (

        <Marker
          key={index}
          position={punto.posicion}
        >

          <Popup>
            ♻️ {punto.nombre}
          </Popup>

        </Marker>

      ))}

    </MapContainer>
  );
}

export default MapaPuntos;