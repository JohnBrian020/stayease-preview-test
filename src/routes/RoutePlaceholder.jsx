import React from "react";
import { Link } from "react-router-dom";

function RoutePlaceholder({ title }) {
  return (
    <section className="page-container">
      <div className="page-heading">
        <span className="eyebrow">StayEase Phase 1</span>

        <h1>{title}</h1>

        <p>
          This page is part of the StayEase project and will be
          implemented in the next development section.
        </p>
      </div>

      <div className="placeholder-panel">
        <div className="placeholder-icon">⌂</div>

        <h2>{title}</h2>

        <p>
          The navigation is connected. The full feature implementation
          is coming next.
        </p>

        <Link to="/" className="text-link">
          Return to homepage
        </Link>
      </div>
    </section>
  );
}

export default RoutePlaceholder;