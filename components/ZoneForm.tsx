import { LoaderCircle } from "lucide-react";
import { useState } from "react";

interface ZoneFormProps {
  zoneName: string;
  setZoneName: (name: string) => void;
  saveZone: () => Promise<void>;
  isCreatingZone: boolean;
  toggleCreatingMode: () => void;
}

export default function ZoneForm({
  zoneName,
  setZoneName,
  saveZone,
  isCreatingZone,
  toggleCreatingMode,
}: ZoneFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await saveZone();
    setIsSaving(false);
  };

  return (
    <div className="mt-4 flex flex-col gap-2 border-t border-slate-300 pt-2">
      {isCreatingZone ? (
        <>
          <h4 className="font-semibold">
            Seleccione los puntos de la zona sobre el mapa
          </h4>
          <input
            type="text"
            placeholder="Nombre de la zona"
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
            className="p-2 border rounded w-full"
            disabled={isSaving} // 🔹 Deshabilita el input si está guardando
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="p-2 bg-green-900 hover:bg-green-900/90 text-white rounded flex-1 flex items-center justify-center"
              disabled={isSaving} // 🔹 Deshabilita el botón mientras se guarda
            >
              {isSaving ? (
                <LoaderCircle className="animate-spin" size={20} />
              ) : (
                "Guardar Zona"
              )}
            </button>
            <button
              onClick={toggleCreatingMode}
              className="p-2 bg-red-900 hover:bg-red-900/90 text-white rounded"
              disabled={isSaving} // 🔹 Deshabilita "Cancelar" mientras se guarda
            >
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={toggleCreatingMode}
          className="p-2 bg-slate-900 hover:bg-slate-900/90 text-white rounded"
        >
          Crear Zona
        </button>
      )}
    </div>
  );
}
