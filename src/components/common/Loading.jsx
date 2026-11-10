import React from "react";

function Loading({
  message = "Loading...",
  fullPage = false
}) {
  return (
    <div className={`loading-state ${fullPage ? "loading-full" : ""}`}>
      <span className="loading-spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

export default Loading;