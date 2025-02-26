"use client";

import ResultModal from "@/components/modals/ResultModal";
import { createContext, useContext, useState } from "react";

// Contexto para manejar el estado del modal
interface ModalContextType {
  showModal: (message: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const showModal = (msg: string) => {
    setMessage(msg);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setMessage(null);
  };

  return (
    <ModalContext.Provider value={{ showModal }}>
      {children}
      <ResultModal
        isOpen={isOpen}
        onClose={closeModal}
        resultMessage={message}
      />
    </ModalContext.Provider>
  );
};

// Hook para acceder al modal en cualquier parte de la app
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal debe usarse dentro de un ModalProvider");
  }
  return context;
};
