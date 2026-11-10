import React from "react";

import Button from "../common/Button";
import { formatCurrency } from "../../utils/formatCurrency";

function RoomCard({
  room,
  onSelect,
  selected = false
}) {
  return (
    <article className={`room-card ${selected ? "room-selected" : ""}`}>
      <div className="room-card-content">
        <div>
          <h3>{room.name}</h3>
          <p>{room.description || "Comfortable accommodation."}</p>
        </div>

        <div className="room-information">
          <span>Capacity: {room.capacity} guests</span>
          <span>{room.totalRooms} rooms available in total</span>
        </div>

        <div className="room-card-footer">
          <strong>
            {formatCurrency(room.pricePerNight)}
            <small> / night</small>
          </strong>

          <Button
            size="small"
            variant={selected ? "secondary" : "primary"}
            disabled={!room.available}
            onClick={() => onSelect(room)}
          >
            {selected ? "Selected" : "Select room"}
          </Button>
        </div>
      </div>
    </article>
  );
}

export default RoomCard;