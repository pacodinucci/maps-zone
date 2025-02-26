"use client";

import { useEffect } from "react";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultMessage: string | null;
}

const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  onClose,
  resultMessage,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        onClose();
      }, 5000); // Cierra automáticamente después de 5 segundos
      return () => clearTimeout(timeout);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-lg font-bold">Resultado de la búsqueda</h2>
        <p className="mt-2">{resultMessage}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
