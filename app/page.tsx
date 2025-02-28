"use client";

import { useState, useEffect } from "react";
import Map from "@/components/Map";
import ZoneList from "@/components/ZoneList";
import ZoneForm from "@/components/ZoneForm";
import AddressChecker from "@/components/AddressChecker";
import { useModal } from "@/providers/ModalProvider";

interface Zone {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number }[];
}

export default function Home() {
  const [polygonPath, setPolygonPath] = useState<
    { lat: number; lng: number }[]
  >([]);
  const [isPolygonClosed, setIsPolygonClosed] = useState(false);
  const [zones, setZones] = useState<
    { id: string; name: string; coordinates: { lat: number; lng: number }[] }[]
  >([]);
  const [zoneName, setZoneName] = useState("");
  const [address, setAddress] = useState("");
  const [isLoadingZones, setIsLoadingZones] = useState(false);
  const [isCreatingZone, setIsCreatingZone] = useState(false);

  const { showModal } = useModal();

  useEffect(() => {
    const fetchZonesWithRetry = async (attempt = 1) => {
      if (attempt > 5) {
        console.error(
          "❌ Error: No se pudo cargar las zonas después de 5 intentos."
        );
        setIsLoadingZones(false);
        return;
      }

      setIsLoadingZones(true);

      try {
        const response = await fetch("/api/zones");
        if (!response.ok) throw new Error("Error al obtener las zonas");

        const data = await response.json();
        setZones(
          data.zones.map((zone: Zone) => ({
            id: zone.id,
            name: zone.name,
            coordinates:
              typeof zone.coordinates === "string"
                ? (JSON.parse(zone.coordinates) as {
                    lat: number;
                    lng: number;
                  }[])
                : zone.coordinates,
          }))
        );

        setIsLoadingZones(false);
      } catch (error) {
        console.warn(`⚠️ Intento ${attempt} fallido. Reintentando...`, error);

        setTimeout(() => {
          fetchZonesWithRetry(attempt + 1);
        }, Math.pow(2, attempt) * 1000); // ⏳ Tiempo de espera: 2^intento * 1000ms
      }
    };

    fetchZonesWithRetry();
  }, []);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!isCreatingZone || !e.latLng) return;

    const newPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() };

    if (polygonPath.length >= 3) {
      const firstPoint = polygonPath[0];
      const distance = Math.sqrt(
        Math.pow(newPoint.lat - firstPoint.lat, 2) +
          Math.pow(newPoint.lng - firstPoint.lng, 2)
      );

      if (distance < 0.0025) {
        setPolygonPath([...polygonPath, firstPoint]);
        setIsPolygonClosed(true);
        return;
      }
    }

    setPolygonPath([...polygonPath, newPoint]);
  };

  const saveZoneToDB = async (
    name: string,
    coordinates: { lat: number; lng: number }[]
  ) => {
    try {
      const response = await fetch("/api/zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, coordinates }),
      });

      if (!response.ok) throw new Error("Error al guardar la zona");
      return (await response.json()).zone;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const saveZone = async () => {
    if (!zoneName.trim() || polygonPath.length < 3) {
      showModal("⚠️ Ingresa un nombre y selecciona al menos 3 puntos.");
      return;
    }
    const newZone = await saveZoneToDB(zoneName, polygonPath);
    if (newZone) {
      setZones([
        ...zones,
        { id: newZone.id, name: zoneName, coordinates: polygonPath },
      ]);
      setPolygonPath([]);
      setIsPolygonClosed(false);
      setZoneName("");
      setIsCreatingZone(false);
    }
  };

  const deleteZone = async (id: string) => {
    try {
      await fetch(`/api/zones/${id}`, { method: "DELETE" });
      setZones((prev) => prev.filter((zone) => zone.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const geocodeAddress = () => {
    if (!address.trim()) {
      showModal("⚠️ Ingresa una dirección.");
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        const latLng = new google.maps.LatLng(location.lat(), location.lng());
        let foundZone = null;

        zones.forEach((zone) => {
          const polygon = new google.maps.Polygon({ paths: zone.coordinates });
          if (google.maps.geometry.poly.containsLocation(latLng, polygon)) {
            foundZone = zone.name;
          }
        });

        showModal(
          foundZone
            ? `✅ La dirección "${address}" está dentro de la zona: "${foundZone}".`
            : `❌ La dirección "${address}" no está dentro de ninguna zona guardada.`
        );
      } else {
        showModal("⚠️ No se pudo encontrar la dirección.");
      }
    });
  };

  return (
    <div className="flex w-full h-screen py-4">
      <div className="flex flex-col gap-2 p-4">
        <AddressChecker
          address={address}
          setAddress={setAddress}
          geocodeAddress={geocodeAddress}
        />
        <ZoneList
          zones={zones}
          isLoadingZones={isLoadingZones}
          deleteZone={deleteZone}
        />
        <ZoneForm
          zoneName={zoneName}
          setZoneName={setZoneName}
          saveZone={saveZone}
          isCreatingZone={isCreatingZone}
          toggleCreatingMode={() => {
            setIsCreatingZone(!isCreatingZone);
            if (!isCreatingZone) {
              setPolygonPath([]);
              setIsPolygonClosed(false);
            }
          }}
        />
      </div>
      <Map
        polygonPath={polygonPath}
        setPolygonPath={setPolygonPath}
        isPolygonClosed={isPolygonClosed}
        zones={zones}
        handleMapClick={handleMapClick}
      />
    </div>
  );
}
