interface AddressCheckerProps {
  address: string;
  setAddress: (address: string) => void;
  geocodeAddress: () => void;
}

export default function AddressChecker({
  address,
  setAddress,
  geocodeAddress,
}: AddressCheckerProps) {
  return (
    <div>
      <input
        type="text"
        placeholder="Ej: Roque Perez 4263, Ciudad de Buenos Aires"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="p-2 border rounded w-full"
      />
      <button
        onClick={geocodeAddress}
        className="p-2 bg-slate-900 hover:bg-slate-900/90 text-white rounded mt-2 w-full"
      >
        Verificar dirección
      </button>
    </div>
  );
}
