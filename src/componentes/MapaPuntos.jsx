import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import puntosVerdes from "../helpers/puntosVerdes";
import "../css/mapaPuntos.css";

const puntoVerdeIcono = L.divIcon({
  className: "punto-verde-marker",
  html: `
    <span class="pin-icono">
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8 16s6-5.7 6-10A6 6 0 0 0 2 6c0 4.3 6 10 6 10Zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
      </svg>
    </span>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -32],
});

function CambiarMapa({ centro }) {
  const map = useMap();
  map.setView(centro, 12);
  return null;
}

function MapaPuntos({ zona }) {
  const puntosFiltrados = puntosVerdes.filter((punto) => punto.zona === zona);

  const centroMapa =
    zona === "Zona 1" ? [-32.8895, -68.844] : [-32.95, -68.83];

  return (
    <MapContainer center={centroMapa} zoom={12} className="mapa-leaflet">
      <CambiarMapa centro={centroMapa} />

      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {puntosFiltrados.map((punto, index) => (
        <Marker key={index} position={punto.posicion} icon={puntoVerdeIcono}>
          <Popup>{punto.nombre}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapaPuntos;
