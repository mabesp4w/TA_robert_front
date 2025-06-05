/** @format */

import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className = "",
}: ModalProps) => {
  const sizeClasses = {
    sm: "modal-box max-w-sm",
    md: "modal-box max-w-2xl",
    lg: "modal-box max-w-4xl",
    xl: "modal-box max-w-6xl",
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className={`${sizeClasses[size]} ${className}`}>
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">{title}</h3>
            <button
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {children}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </div>
  );
};

export default Modal;
