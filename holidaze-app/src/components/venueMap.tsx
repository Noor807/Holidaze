// src/components/VenueMap.tsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

interface VenueMapProps {
  lat?: number;          // optional
  lng?: number;          // optional
  venueName?: string;
  height?: string;       // optional
}

const DEFAULT_POSITION = { lat: 51.505, lng: -0.09 }; // fallback: London

const VenueMap = ({ lat, lng, venueName, height = "200px" }: VenueMapProps) => {
  const position = { lat: lat ?? DEFAULT_POSITION.lat, lng: lng ?? DEFAULT_POSITION.lng };

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-md" style={{ height }}>
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={lat && lng ? 14 : 2} // zoom out if default
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {lat && lng && venueName && (
          <Marker position={[lat, lng]}>
            <Popup>{venueName}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default VenueMap;
