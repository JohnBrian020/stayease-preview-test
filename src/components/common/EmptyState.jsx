import React from "react";
import Button from "./Button";

function EmptyState({
  title = "Nothing here yet",
  message = "There is no information to display.",
  actionLabel,
  onAction,
  icon = "📭"
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>

      <h3>{title}</h3>
      <p>{message}</p>

      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;