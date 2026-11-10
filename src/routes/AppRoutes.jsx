
import React from "react";
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// Layouts
import MainLayout from "../components/layout/MainLayout";
import DashboardLayout from "../components/layout/DashboardLayout";

// Route protection
import ProtectedRoute from "./ProtectedRoute";
import RoutePlaceholder from "./RoutePlaceholder";

// Authentication pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Customer pages
import Home from "../pages/customer/Home";
import BrowseProperties from "../pages/customer/BrowseProperties";
import PropertyDetails from "../pages/customer/PropertyDetails";
import BookingForm from "../pages/customer/BookingForm";
import MyBookings from "../pages/customer/MyBookings";
import BookingDetails from "../pages/customer/BookingDetails";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import Managers from "../pages/admin/Managers";
import Properties from "../pages/admin/Properties";
import Bookings from "../pages/admin/Bookings";

// Manager pages
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import MyProperties from "../pages/manager/MyProperties";
import AddProperty from "../pages/manager/AddProperty";
import EditProperty from "../pages/manager/EditProperty";
import ManageRooms from "../pages/manager/ManageRooms";
import EditRoom from "../pages/manager/EditRoom";
import ManagerBookings from "../pages/manager/ManagerBookings";

function AppRoutes() {
  return (
    <Routes>

      {/* ================================== */}
      {/* PUBLIC ROUTES */}
      {/* ================================== */}

      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/properties"
          element={<BrowseProperties />}
        />

        <Route
          path="/properties/:propertyId"
          element={<PropertyDetails />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/verify-email"
          element={
            <RoutePlaceholder title="Email Verification" />
          }
        />

        <Route
          path="/forgot-password"
          element={
            <RoutePlaceholder title="Forgot Password" />
          }
        />

        <Route
          path="/unauthorized"
          element={
            <RoutePlaceholder title="Access Denied" />
          }
        />

        <Route
          path="/404"
          element={
            <RoutePlaceholder title="Page Not Found" />
          }
        />

        {/* Customer booking form */}
        <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route
            path="/properties/:propertyId/book"
            element={<BookingForm />}
          />
        </Route>
      </Route>


      {/* ================================== */}
      {/* CUSTOMER DASHBOARD ROUTES */}
      {/* ================================== */}

      <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
        <Route path="/customer" element={<DashboardLayout />}>

          <Route
            index
            element={<Navigate to="bookings" replace />}
          />

          <Route
            path="bookings"
            element={<MyBookings />}
          />

          <Route
            path="bookings/:bookingId"
            element={<BookingDetails />}
          />

        </Route>
      </Route>


      {/* ================================== */}
      {/* MANAGER ROUTES */}
      {/* ================================== */}

      <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
        <Route path="/manager" element={<DashboardLayout />}>

          <Route
            index
            element={<ManagerDashboard />}
          />

          <Route
            path="dashboard"
            element={<ManagerDashboard />}
          />

          <Route
            path="properties"
            element={<MyProperties />}
          />

          <Route
            path="properties/add"
            element={<AddProperty />}
          />

          <Route
            path="properties/:propertyId/edit"
            element={<EditProperty />}
          />

          <Route
            path="properties/:propertyId/rooms"
            element={<ManageRooms />}
          />

          <Route
            path="properties/:propertyId/rooms/:roomId/edit"
            element={<EditRoom />}
          />

          <Route
            path="bookings"
            element={<ManagerBookings />}
          />

        </Route>
      </Route>


      {/* ================================== */}
      {/* ADMIN ROUTES */}
      {/* ================================== */}

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<DashboardLayout />}>

          <Route
            index
            element={<AdminDashboard />}
          />

          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="managers"
            element={<Managers />}
          />

          <Route
            path="properties"
            element={<Properties />}
          />

          <Route
            path="bookings"
            element={<Bookings />}
          />

        </Route>
      </Route>


      {/* ================================== */}
      {/* FALLBACK */}
      {/* ================================== */}

      <Route
        path="*"
        element={<Navigate to="/404" replace />}
      />

    </Routes>
  );
}

export default AppRoutes;
