import React, { useEffect } from "react";
import Button from "./Button";

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  showCloseButton = true
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose?.();
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={handleBackdropClick}
      role="presentation"
    >
      <section
        className={`modal modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>

          {showCloseButton && (
            <Button
              variant="ghost"
              size="small"
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </Button>
          )}
        </div>

        <div className="modal-body">{children}</div>
      </section>
    </div>
  );
}

export default Modal;