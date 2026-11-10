import React from "react";
import Input from "../common/Input";
import { getToday } from "../../utils/formatDate";

function DateSelector({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  error = ""
}) {
  return (
    <div className="date-selector">
      <Input
        label="Check-in"
        name="checkIn"
        type="date"
        value={checkIn}
        min={getToday()}
        onChange={(event) => onCheckInChange(event.target.value)}
        required
      />

      <Input
        label="Check-out"
        name="checkOut"
        type="date"
        value={checkOut}
        min={checkIn || getToday()}
        onChange={(event) => onCheckOutChange(event.target.value)}
        required
      />

      {error && (
        <p className="field-error date-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default DateSelector;