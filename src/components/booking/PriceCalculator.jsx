import React from "react";

import { calculateNights } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";

function PriceCalculator({ room, checkIn, checkOut }) {
  const validDates = Boolean(
    checkIn &&
    checkOut &&
    checkOut > checkIn
  );

  const nights = validDates
    ? calculateNights(checkIn, checkOut)
    : 0;

  const pricePerNight = Number(room?.pricePerNight || 0);
  const total = nights * pricePerNight;

  return (
    <div className="price-calculator">
      <h3>Price breakdown</h3>

      <div className="price-calculator-row">
        <span>Price per night</span>
        <strong>{formatCurrency(pricePerNight)}</strong>
      </div>

      <div className="price-calculator-row">
        <span>Number of nights</span>
        <strong>{nights}</strong>
      </div>

      <div className="price-calculator-total">
        <span>Estimated total</span>
        <strong>{formatCurrency(total)}</strong>
      </div>

      {!validDates && (
        <p className="form-hint">
          Select your check-in and check-out dates to calculate the price.
        </p>
      )}
    </div>
  );
}

export default PriceCalculator;