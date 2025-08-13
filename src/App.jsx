import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login, { AuthProvider, useAuth } from "./components/Login";
import Register from "./components/Register";
import PatientDashboard from "./components/Patient/PatientDashboard";
import PharmacyDashboard from "./components/Pharmacy/PharmacyDashboard";
import ViewNearbyPharmacies from "./components/Patient/ViewNearbyPharmacies";
import Chat from "./components/Patient/Chat";
import QuickActions from "./components/Patient/QuickActions";
import AdminDashboard from "./components/Admin/AdminDashboard";
import EmailVerification from "./components/EmailVerification";
import PharmacyEmailVerification from "./components/Pharmacy/PharmacyEmailVerification";
import PharmacyVerification from "./components/PharmacyVerification";
import PharmacyPage from "./components/Patient/PharmacyPage";
import OrderDetailsPage from "./components/Pharmacy/OrderDetailsPage";
import PharmacyLanding from "./components/PharmacyLanding";
import { NotificationProvider } from "./contexts/NotificationContext";
import { GlobalChatWatcher } from "./hooks/useGlobalChatWatcher";
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, logout } = useAuth();
  console.log("ProtectedRoute user:", user);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if user's email is verified
  if (!user.isEmailVerified && window.location.pathname !== "/verify-email") {
    return <Navigate to="/verify-email" />;
  }

  // Check if user has the required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    switch (user.role) {
      case "patient":
        return <Navigate to="/patient/dashboard" />;
      case "pharmacy":
        return <Navigate to="/pharmacy/dashboard" />;
      case "admin":
        return <Navigate to="/admin/dashboard" />;
      default:
        return <Navigate to="/login" />;
    }
  }
  console.log(`[PROTECTED ROUTE] User role:`, user);

  // For pharmacies, ensure admin approval
  if (user.role === "pharmacy" && user.isEmailVerified != true) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pending Approval
          </h2>
          <p className="text-gray-600 mb-6">
            Your pharmacy registration is currently under review by our admin
            team. You'll receive an email notification once your account is
            approved.
          </p>
          <button
            onClick={logout}
            className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return children;
};

// Role-based dashboard redirect
const DashboardRedirect = () => {
  const { user } = useAuth();
  console.log("DashboardRedirect user:", user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  switch (user.role) {
    case "patient":
      return <Navigate to="/patient/dashboard" />;
    case "pharmacy":
      return <Navigate to="/pharmacy/dashboard" />;
    case "admin":
      return <Navigate to="/admin/dashboard" />;
    default:
      return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <GlobalChatWatcher />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PharmacyLanding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/pharmacy-verification"
              element={<PharmacyVerification />}
            />
            <Route
              path="/pharmacy-email-verification"
              element={<PharmacyEmailVerification />}
            />

            {/* Email Verification Route */}
            <Route
              path="/verify-email"
              element={
                <ProtectedRoute>
                  <EmailVerification />
                </ProtectedRoute>
              }
            />

            {/* Patient Routes */}
            <Route
              path="/patient/dashboard"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            {/* Nearby Pharmacies for Patients */}
            <Route
              path="/patient/pharmacies"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <ViewNearbyPharmacies />
                </ProtectedRoute>
              }
            />
            {/* Chat Threads for Patients */}
            <Route
              path="/patient/chats"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <Chat />
                </ProtectedRoute>
              }
            />
            {/* Pharmacy detail page for patients */}
            <Route
              path="/patient/pharmacies/:id"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PharmacyPage />
                </ProtectedRoute>
              }
            />
            {/* Pharmacy detail page for patients - Alternative route */}
            <Route
              path="/patient/pharmacy/:id"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PharmacyPage />
                </ProtectedRoute>
              }
            />

            {/* Pharmacy Routes */}
            <Route
              path="/pharmacy/dashboard"
              element={
                <ProtectedRoute allowedRoles={["pharmacy"]}>
                  <PharmacyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacy/orders/:orderId"
              element={
                <ProtectedRoute allowedRoles={["pharmacy"]}>
                  <OrderDetailsPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Dashboard redirect based on role */}
            <Route path="/dashboard" element={<DashboardRedirect />} />

            {/* Fallback Route - redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
