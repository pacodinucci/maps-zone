"use client";

import {
  GoogleMap,
  Polygon,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";

const containerStyle = {
  width: "80%",
  height: "90vh",
};

const center = { lat: -34.55, lng: -58.45 };

interface Zone {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number }[];
}

interface MapProps {
  polygonPath: { lat: number; lng: number }[];
  setPolygonPath: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number }[]>
  >;
  handleMapClick: (e: google.maps.MapMouseEvent) => void;
  isPolygonClosed: boolean;
  zones: Zone[];
}

export default function Map({
  polygonPath,
  handleMapClick,
  isPolygonClosed,
  zones,
}: MapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["geometry", "places"],
  });

  if (!isLoaded)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      onClick={handleMapClick}
    >
      {polygonPath.map((point, index) => (
        <Marker key={index} position={point} label={(index + 1).toString()} />
      ))}

      {polygonPath.length >= 3 && (
        <Polygon
          paths={polygonPath}
          options={{
            fillColor: isPolygonClosed
              ? "rgba(0, 0, 255, 0.3)"
              : "rgba(255, 165, 0, 0.3)",
            fillOpacity: 0.5,
            strokeColor: isPolygonClosed ? "blue" : "orange",
            strokeWeight: 2,
          }}
        />
      )}

      {zones.map((zone) => (
        <Polygon
          key={zone.id}
          paths={zone.coordinates}
          options={{
            fillColor: "rgba(0, 255, 0, 0.3)",
            strokeColor: "green",
            strokeWeight: 2,
          }}
        />
      ))}
    </GoogleMap>
  );
}
