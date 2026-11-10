import { Link } from "react-router-dom";

import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import { formatCurrency } from "../../utils/formatCurrency";

const RoomList = ({ rooms, propertyId }) => {
  if (!rooms || rooms.length === 0) {
    return (
      <EmptyState
        title="No rooms added"
        message="Add rooms to make this property ready for booking."
      />
    );
  }

  return (
    <div className="room-list">
      {rooms.map((room) => (
        <div className="manager-room-card" key={room.id}>
          <div>
            <h3>{room.name}</h3>

            <p>
              {formatCurrency(room.pricePerNight)} / night
            </p>

            <p>Capacity: {room.capacity} guests</p>

            <p>Total rooms: {room.totalRooms}</p>
          </div>

          <Link to={`/manager/properties/${propertyId}/rooms/${room.id}/edit`}>
            <Button variant="secondary" size="small">
              Edit Room
            </Button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default RoomList;