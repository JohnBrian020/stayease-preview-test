import React from "react";
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import DashboardLayout from "../components/layout/DashboardLayout";

import ProtectedRoute from "./ProtectedRoute";
import RoutePlaceholder from "./RoutePlaceholder";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminDashboard from "../pages/admin/AdminDashboard";
import Managers from "../pages/admin/Managers";
import Properties from "../pages/admin/Properties";
import Bookings from "../pages/admin/Bookings";

function AppRoutes() {
  return (
    <Routes>
      {/* ---------------------------------- */}
      {/* PUBLIC ROUTES */}
      {/* ---------------------------------- */}

      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={<RoutePlaceholder title="StayEase Home" />}
        />

        <Route
          path="/properties"
          element={<RoutePlaceholder title="Browse Properties" />}
        />

        <Route
          path="/properties/:propertyId"
          element={<RoutePlaceholder title="Property Details" />}
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
      </Route>

      {/* ---------------------------------- */}
      {/* CUSTOMER ROUTES */}
      {/* ---------------------------------- */}

      <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
        <Route path="/customer" element={<DashboardLayout />}>
          <Route
            path="dashboard"
            element={
              <RoutePlaceholder title="Customer Dashboard" />
            }
          />

          <Route
            path="bookings"
            element={
              <RoutePlaceholder title="My Bookings" />
            }
          />

          <Route
            path="bookings/:bookingId"
            element={
              <RoutePlaceholder title="Booking Details" />
            }
          />
        </Route>

        <Route
          path="/properties/:propertyId/book"
          element={
            <MainLayout />
          }
        >
          <Route
            index
            element={
              <RoutePlaceholder title="Create Booking" />
            }
          />
        </Route>
      </Route>

      {/* ---------------------------------- */}
      {/* MANAGER ROUTES */}
      {/* ---------------------------------- */}

      <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
        <Route path="/manager" element={<DashboardLayout />}>
          <Route
            path="dashboard"
            element={
              <RoutePlaceholder title="Manager Dashboard" />
            }
          />

          <Route
            path="properties"
            element={
              <RoutePlaceholder title="My Properties" />
            }
          />

          <Route
            path="properties/new"
            element={
              <RoutePlaceholder title="Add Property" />
            }
          />

          <Route
            path="properties/:propertyId/edit"
            element={
              <RoutePlaceholder title="Edit Property" />
            }
          />

          <Route
            path="properties/:propertyId/rooms"
            element={
              <RoutePlaceholder title="Manage Rooms" />
            }
          />

          <Route
            path="properties/:propertyId/rooms/:roomId/edit"
            element={
              <RoutePlaceholder title="Edit Room" />
            }
          />

          <Route
            path="bookings"
            element={
              <RoutePlaceholder title="Manager Bookings" />
            }
          />
        </Route>
      </Route>

      {/* ---------------------------------- */}
      {/* ADMIN ROUTES */}
      {/* ---------------------------------- */}

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route
            path="dashboard"
            element={
              <RoutePlaceholder title="Admin Dashboard" />
            }
          />

          <Route
            path="managers"
            element={
              <RoutePlaceholder title="Manage Managers" />
            }
          />

          <Route
            path="properties"
            element={
              <RoutePlaceholder title="Manage Properties" />
            }
          />

          <Route
            path="bookings"
            element={
              <RoutePlaceholder title="Manage Bookings" />
            }
          />
        </Route>
      </Route>

      {/* ---------------------------------- */}
      {/* FALLBACK */}
      {/* ---------------------------------- */}

      <Route
        path="/404"
        element={
          <MainLayout />
        }
      >
        <Route
          index
          element={
            <RoutePlaceholder title="Page Not Found" />
          }
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/404" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;