/** @format */

// src/components/ui/Modal.tsx
import React from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}) => {
  const sizeClasses = {
    sm: "modal-box w-11/12 max-w-md",
    md: "modal-box w-11/12 max-w-2xl",
    lg: "modal-box w-11/12 max-w-4xl",
    xl: "modal-box w-11/12 max-w-6xl",
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className={sizeClasses[size]}>
        {(title || showCloseButton) && (
          <div className="flex justify-between items-center mb-4">
            {title && <h3 className="font-bold text-lg">{title}</h3>}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                icon={X}
                className="btn-circle"
              />
            )}
          </div>
        )}
        <div className="py-4">{children}</div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};
