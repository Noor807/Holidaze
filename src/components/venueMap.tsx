import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default Leaflet marker icons for proper rendering
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
  /** Latitude of the venue */
  lat?: number;
  /** Longitude of the venue */
  lng?: number;
  /** Venue name displayed in the marker popup */
  venueName?: string;
  /** Height of the map container (default: 500px) */
  height?: string;
}

const DEFAULT_POSITION = { lat: 51.505, lng: -0.09 };

/**
 * VenueMap component displays a Leaflet map centered on a venue location.
 *
 * If latitude/longitude are not provided, the map defaults to a world view.
 * Shows a marker with a popup when venue coordinates and name are provided.
 *
 * @component
 * @param {VenueMapProps} props
 * @returns {JSX.Element} Map with optional marker
 */
const VenueMap: React.FC<VenueMapProps> = ({
  lat,
  lng,
  venueName,
  height = "500px",
}) => {
  // Memoize position to avoid unnecessary re-renders
  const position = useMemo(
    () => ({
      lat: lat ?? DEFAULT_POSITION.lat,
      lng: lng ?? DEFAULT_POSITION.lng,
    }),
    [lat, lng]
  );

  // Zoom level: close-up for known venue, world view otherwise
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
