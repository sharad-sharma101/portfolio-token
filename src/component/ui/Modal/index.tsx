import React, { useEffect } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  dismissOnBackdrop?: boolean;
};

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  footer,
  dismissOnBackdrop = true,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/60"
        onClick={dismissOnBackdrop ? onClose : undefined}
      />
      <div
        className="relative z-10 w-full max-w-lg text-text-primary shadow-xl bg-[#212124] rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="bg-[#212124] rounded-tl-xl rounded-tr-xl">{children}</div>
        {footer && (
          <div className="border-t bg-[#27272A] border-table-border rounded-bl-xl rounded-br-xl">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;