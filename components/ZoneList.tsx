import { useState } from "react";
import { Trash2, LoaderCircle } from "lucide-react";

interface ZoneListProps {
  zones: { id: string; name: string }[];
  isLoadingZones: boolean;
  deleteZone: (id: string) => Promise<void>;
}

export default function ZoneList({
  zones,
  isLoadingZones,
  deleteZone,
}: ZoneListProps) {
  const [loadingZoneId, setLoadingZoneId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setLoadingZoneId(id);
    await deleteZone(id);
    setLoadingZoneId(null);
  };

  return (
    <div className="flex-1 border-t border-slate-300 pt-2">
      <h2 className="text-lg font-semibold mb-2 ml-2">Zonas Guardadas</h2>
      {isLoadingZones ? (
        <LoaderCircle className="mx-auto animate-spin" />
      ) : zones.length === 0 ? (
        <p className="text-gray-500">No hay zonas guardadas.</p>
      ) : (
        <ul className="space-y-2">
          {zones.map((zone) => (
            <li
              key={zone.id}
              className="p-2 bg-gray-50 hover:bg-gray-100 rounded-md shadow-sm flex justify-between items-center"
            >
              <strong>{zone.name}</strong>
              {loadingZoneId === zone.id ? (
                <LoaderCircle className="animate-spin p-2" size={30} />
              ) : (
                <Trash2
                  size={30}
                  className="p-2 hover:bg-gray-200 rounded-lg cursor-pointer"
                  onClick={() => handleDelete(zone.id)}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
