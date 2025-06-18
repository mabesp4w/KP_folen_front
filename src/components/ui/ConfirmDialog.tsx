/** @format */

// src/components/ui/ConfirmDialog.tsx
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message = "Apakah Anda yakin ingin melanjutkan?",
  confirmText = "Ya",
  cancelText = "Batal",
  type = "warning",
  loading = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case "danger":
        return <AlertTriangle className="text-red-500" size={48} />;
      case "warning":
        return <AlertTriangle className="text-yellow-500" size={48} />;
      default:
        return <AlertTriangle className="text-blue-500" size={48} />;
    }
  };

  const getConfirmVariant = () => {
    switch (type) {
      case "danger":
        return "danger" as const;
      case "warning":
        return "secondary" as const;
      default:
        return "primary" as const;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center space-y-4">
        <div className="flex justify-center">{getIcon()}</div>
        <p className="text-gray-300">{message}</p>
        <div className="flex gap-3 justify-center pt-4">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={getConfirmVariant()}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
