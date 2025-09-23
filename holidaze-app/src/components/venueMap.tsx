import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default Leaflet marker icons
if (typeof L !== "undefined") {
  const DefaultIcon = L.Icon.Default;
  DefaultIcon.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  });
}

interface VenueMapProps {
  lat?: number;
  lng?: number;
  venueName?: string;
  height?: string;
}

const DEFAULT_POSITION = { lat: 51.505, lng: -0.09 };

const VenueMap: React.FC<VenueMapProps> = ({
  lat,
  lng,
  venueName,
  height = "500px",
}) => {
  const position = useMemo(
    () => ({ lat: lat ?? DEFAULT_POSITION.lat, lng: lng ?? DEFAULT_POSITION.lng }),
    [lat, lng]
  );

  const zoomLevel = useMemo(() => (lat && lng ? 14 : 2), [lat, lng]);

  return (
    <div
      className="w-full leaflet-map-container rounded-lg !z-10 overflow-hidden shadow-md"
      style={{ height }}
    >
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={zoomLevel}
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
