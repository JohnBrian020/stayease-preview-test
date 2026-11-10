import React from "react";

function ErrorMessage({
  message,
  onRetry,
  title = "Something went wrong"
}) {
  if (!message) return null;

  return (
    <div className="error-message" role="alert">
      <div>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>

      {onRetry && (
        <button
          type="button"
          className="error-retry"
          onClick={onRetry}
        >
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;