import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useBookings } from "../../context/BookingContext";

import PropertyList from "../../components/manager/PropertyList";
import Loading from "../../components/common/Loading";

const MyProperties = () => {
  const { currentUser } = useAuth();

  const { properties, loading } = useBookings();

  if (loading) {
    return <Loading />;
  }

  const myProperties = properties.filter(
    (property) => property.managerId === currentUser.id
  );

  return (
    <div className="manager-page">
      <div className="manager-page-header">
        <div>
          <p className="page-eyebrow">PROPERTY MANAGEMENT</p>
          <h1>My Properties</h1>
          <p>View and manage your registered accommodation.</p>
        </div>

        <Link to="/manager/properties/new" className="primary-link">
          + Add Property
        </Link>
      </div>

      <PropertyList properties={myProperties} />
    </div>
  );
};

export default MyProperties;