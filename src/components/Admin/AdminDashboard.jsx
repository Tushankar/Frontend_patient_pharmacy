import React, { useState, useEffect } from "react";
import {
  Users,
  Building,
  Clock,
  Activity,
  Mail,
  TrendingUp,
  Phone,
  Shield,
  MapPin,
  Calendar,
  Eye,
  UserPlus,
  MessageCircle,
  Package,
  CheckCircle,
  FileText,
  Info,
  Bell,
  AlertTriangle,
  Filter,
  Trash2,
} from "lucide-react";
import NotificationCreator from "../Notifications/NotificationCreator";
import { useAdvancedNotifications } from "../../hooks/useAdvancedNotifications";
import { useNotifications } from "../../hooks/useNotifications";
import axiosInstance from "../../utils/axiosInstance";

// Import all the new components
import AdminSidebar from "./components/AdminSidebar";
import AdminTopBar from "./components/AdminTopBar";
import OverviewSection from "./components/OverviewSection";
import PendingApprovalsSection from "./components/PendingApprovalsSection";
import PharmaciesSection from "./components/PharmaciesSection";
import PatientsSection from "./components/PatientsSection";
import AdminsSection from "./components/AdminsSection";
import NotificationsSection from "./components/NotificationsSection";
import ApprovalModal from "./components/ApprovalModal";
import PharmacyDetailsModal from "./components/PharmacyDetailsModal";
import PatientDetailsModal from "./components/PatientDetailsModal";
import LocationMap from "./components/LocationMap";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState(null);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [patients, setPatients] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [approvalAction, setApprovalAction] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showNotificationCreator, setShowNotificationCreator] = useState(false);
  const [allNotifications, setAllNotifications] = useState([]);
  const [notificationFilter, setNotificationFilter] = useState("all");
  const [notificationAnalytics, setNotificationAnalytics] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotificationIds, setSelectedNotificationIds] = useState([]);

  // Add notifications hook
  const {
    chatUnreadCounts,
    approvalNotifications,
    orderStatusNotifications,
    getNotificationCounts,
    markApprovalAsRead,
    markChatAsRead,
    markOrderStatusAsRead,
    getAllNotifications,
    getNotificationAnalytics,
    markAsRead,
    dismissNotification,
  } = useAdvancedNotifications();

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  // Load notifications immediately when component mounts for bell icon
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const [notificationsData, analyticsData] = await Promise.all([
          getAllNotifications({}),
          getNotificationAnalytics(),
        ]);
        setAllNotifications(notificationsData?.data || []);
        setNotificationAnalytics(analyticsData);
      } catch (error) {
        console.error("Error loading notifications on mount:", error);
      }
    };

    loadNotifications();
  }, []); // Run only once on mount

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === "overview") {
        const response = await axiosInstance.get("/admin/dashboard/stats");
        if (response.data.success) {
          setStats(response.data.data);
        }
      } else if (activeTab === "approvals") {
        console.log("🔍 Fetching pharmacy approvals...");
        const response = await axiosInstance.get("/admin/pharmacy-approvals");
        console.log("📋 Approvals response:", response.data);
        if (response.data.success) {
          setPendingApprovals(response.data.data);
          console.log("✅ Set pending approvals:", response.data.data.length, "items");
        } else {
          console.error("❌ Failed to fetch approvals:", response.data.message);
        }
      } else if (activeTab === "pharmacies") {
        const response = await axiosInstance.get("/admin/pharmacies");
        if (response.data.success) {
          setPharmacies(response.data.data);
        }
      } else if (activeTab === "patients") {
        const response = await axiosInstance.get("/admin/patients");
        if (response.data.success) {
          setPatients(response.data.data);
        }
      } else if (activeTab === "admins") {
        const response = await axiosInstance.get("/admin/admins");
        if (response.data.success) {
          setAdmins(response.data.data);
        }
      } else if (activeTab === "notifications") {
        try {
          const [notificationsData, analyticsData] = await Promise.all([
            getAllNotifications({}), // Remove limit to get ALL notifications for admin
            getNotificationAnalytics(),
          ]);
          setAllNotifications(notificationsData?.data || []);
          setNotificationAnalytics(analyticsData);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalAction = async (action) => {
    if (action === "reject" && !remarks) {
      alert("Please provide rejection remarks");
      return;
    }

    setActionLoading(true);
    try {
      const response = await axiosInstance.put(
        `/admin/pharmacy-approvals/${selectedApproval._id}/${action}`,
        { remarks }
      );
      console.log("🔍 Approval action response:", response);

      if (response.data.success) {
        alert(`Pharmacy ${action}ed successfully!`);
        setSelectedApproval(null);
        setApprovalAction(null);
        setRemarks("");
        fetchDashboardData();
      } else {
        alert(response.data.message || `Failed to ${action} pharmacy`);
      }
    } catch (error) {
      console.error(`Error ${action}ing pharmacy:`, error);
      alert(`Failed to ${action} pharmacy`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      console.log("🔍 handleToggleUserStatus called with ID:", userId);
      const response = await axiosInstance.put(`/admin/users/${userId}/toggle-status`);
      console.log("🔍 Making request to toggle user status");

      console.log("🔍 Response status:", response.status);
      console.log("🔍 Response ok:", response.status < 400);

      console.log("✅ Response data:", response.data);

      if (response.data.success) {
        alert(response.data.message);
        fetchDashboardData();
      } else {
        alert(response.data.message || "Failed to update user status");
      }
    } catch (error) {
      console.error("❌ Error toggling user status:", error);
      alert(`Failed to update user status: ${error.message}`);
    }
  };

  const handleViewPatientDetails = async (patientId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/admin/patients/${patientId}`);

      if (response.data.success) {
        setSelectedPatient(response.data.data);
      } else {
        alert(response.data.message || "Failed to fetch patient details");
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
      alert(`Failed to fetch patient details: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDeleteNotifications = async (notificationIds) => {
    try {
      // Implementation for deleting notifications
      console.log("Deleting notifications:", notificationIds);
    } catch (error) {
      console.error("Error deleting notifications:", error);
    }
  };

  const handleNotificationAction = async (action, notificationId) => {
    try {
      // Implementation for notification actions
      console.log("Notification action:", action, notificationId);
    } catch (error) {
      console.error("Error handling notification action:", error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      console.log("Attempting to mark notification as read:", notificationId);

      // Immediately update the UI state for better UX
      setAllNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId
            ? {
                ...notif,
                read: true,
                userStatus: {
                  ...notif.userStatus,
                  deliveryStatus: "read",
                  readAt: new Date().toISOString(),
                },
                adminView: notif.adminView
                  ? {
                      ...notif.adminView,
                      readCount: (notif.adminView.readCount || 0) + 1,
                      unreadCount: Math.max(
                        0,
                        (notif.adminView.unreadCount || 1) - 1
                      ),
                    }
                  : notif.adminView,
              }
            : notif
        )
      );

      // Call the backend API
      const success = await markAsRead(notificationId);

      if (success) {
        console.log(
          "Successfully marked notification as read:",
          notificationId
        );
      } else {
        console.error("Failed to mark notification as read, reverting state");
        // Revert the state change if the API call failed
        setAllNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId
              ? {
                  ...notif,
                  read: false,
                  userStatus: {
                    ...notif.userStatus,
                    deliveryStatus: "delivered",
                  },
                  adminView: notif.adminView
                    ? {
                        ...notif.adminView,
                        readCount: Math.max(
                          0,
                          (notif.adminView.readCount || 1) - 1
                        ),
                        unreadCount: (notif.adminView.unreadCount || 0) + 1,
                      }
                    : notif.adminView,
                }
              : notif
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);

      // Revert the state change if there was an error
      setAllNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId
            ? {
                ...notif,
                read: false,
                userStatus: {
                  ...notif.userStatus,
                  deliveryStatus: "delivered",
                },
                adminView: notif.adminView
                  ? {
                      ...notif.adminView,
                      readCount: Math.max(
                        0,
                        (notif.adminView.readCount || 1) - 1
                      ),
                      unreadCount: (notif.adminView.unreadCount || 0) + 1,
                    }
                  : notif.adminView,
              }
            : notif
        )
      );
    }
  };

  const handleDismissNotification = async (notificationId) => {
    try {
      await dismissNotification(notificationId);
      setAllNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId)
      );
    } catch (error) {
      console.error("Error dismissing notification:", error);
    }
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "approvals", label: "Pending Approvals", icon: Clock },
    { id: "notifications", label: "All Notifications", icon: Bell },
    { id: "pharmacies", label: "Pharmacies", icon: Building },
    { id: "patients", label: "Patients", icon: Users },
    { id: "admins", label: "Admins", icon: Shield },
  ];

  // REMOVED the renderOverview() function completely to avoid conflicts

  const renderPendingApprovals = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Pending Pharmacy Approvals
      </h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : pendingApprovals.length > 0 ? (
        <div className="space-y-4">
          {pendingApprovals.map((approval) => (
            <div
              key={approval._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {approval.pharmacyData.pharmacyName}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending Review
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {approval.pharmacyData.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {approval.pharmacyData.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      License: {approval.pharmacyData.licenseNumber}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {approval.pharmacyData.address.city},{" "}
                      {approval.pharmacyData.address.state}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Applied: {new Date(approval.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedApproval(approval)}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2 font-medium"
                >
                  <Eye className="w-4 h-4" />
                  Review Application
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No pending approvals</p>
          <p className="text-gray-500 text-sm mt-2">
            All pharmacy applications have been reviewed
          </p>
        </div>
      )}
    </div>
  );

  const renderPharmacies = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Registered Pharmacies
      </h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : pharmacies.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pharmacy Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pharmacies.map((pharmacy) => (
                  <tr key={pharmacy._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {pharmacy.pharmacyName}
                        </p>
                        <p className="text-xs text-gray-500">
                          License: {pharmacy.licenseNumber}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <p className="text-gray-900">
                          {pharmacy.contactInfo?.email ||
                            pharmacy.email ||
                            "N/A"}
                        </p>
                        <p className="text-gray-500">
                          {pharmacy.contactInfo?.phone ||
                            pharmacy.phone ||
                            "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {pharmacy.address.city}, {pharmacy.address.state}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          pharmacy.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {pharmacy.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            console.log("Pharmacy details clicked:", pharmacy);
                            setSelectedPharmacy(pharmacy);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Details
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleToggleUserStatus(pharmacy._id)}
                          className={`font-medium ${
                            pharmacy.isActive
                              ? "text-red-600 hover:text-red-800"
                              : "text-green-600 hover:text-green-800"
                          }`}
                        >
                          {pharmacy.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No registered pharmacies</p>
          <p className="text-gray-500 text-sm mt-2">
            Pharmacies will appear here once approved
          </p>
        </div>
      )}
    </div>
  );

  const renderPatients = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Registered Patients</h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : patients.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {patient.firstName[0]}
                            {patient.lastName[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <p className="text-gray-900">{patient.email}</p>
                        <p className="text-gray-500">{patient.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(patient.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          patient.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {patient.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewPatientDetails(patient._id)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Details
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleToggleUserStatus(patient._id)}
                          className={`font-medium ${
                            patient.isActive
                              ? "text-red-600 hover:text-red-800"
                              : "text-green-600 hover:text-green-800"
                          }`}
                        >
                          {patient.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No registered patients</p>
          <p className="text-gray-500 text-sm mt-2">
            Patients will appear here once they sign up
          </p>
        </div>
      )}
    </div>
  );

  const renderAdmins = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Admin Users</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add Admin
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : admins.length > 0 ? (
        <div className="grid gap-4">
          {admins.map((admin) => (
            <div
              key={admin._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {admin.firstName[0]}
                      {admin.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {admin.firstName} {admin.lastName}
                      {admin.isSuperAdmin && (
                        <span className="ml-2 px-2.5 py-0.5 text-xs bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-full font-medium">
                          Super Admin
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{admin.email}</p>
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-500 mb-2">
                        Permissions:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {admin.permissions.map((permission) => (
                          <span
                            key={permission}
                            className="px-2.5 py-1 text-xs bg-gray-100 text-gray-700 rounded-md font-medium"
                          >
                            {permission.replace(/_/g, " ").toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {admin.lastLogin && (
                    <p className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Last login:{" "}
                      {new Date(admin.lastLogin).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No admin users found</p>
          <p className="text-gray-500 text-sm mt-2">
            Add admin users to manage the platform
          </p>
        </div>
      )}
    </div>
  );

  const renderNotifications = () => {
    const getNotificationIcon = (type) => {
      switch (type) {
        case "chat":
          return <MessageCircle className="w-5 h-5 text-blue-500" />;
        case "order_status":
          return <Package className="w-5 h-5 text-green-500" />;
        case "approval":
          return <CheckCircle className="w-5 h-5 text-yellow-500" />;
        case "health_record":
          return <FileText className="w-5 h-5 text-purple-500" />;
        case "system":
          return <Info className="w-5 h-5 text-gray-500" />;
        default:
          return <Bell className="w-5 h-5 text-gray-500" />;
      }
    };

    const getPriorityColor = (priority) => {
      switch (priority) {
        case "urgent":
          return "bg-red-100 text-red-800 border-red-200";
        case "high":
          return "bg-orange-100 text-orange-800 border-orange-200";
        case "medium":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "low":
          return "bg-green-100 text-green-800 border-green-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    const filteredNotifications = allNotifications.filter((notification) => {
      if (notificationFilter === "all") return true;
      if (notificationFilter === "unread") return !notification.read;
      if (notificationFilter === "urgent")
        return notification.priority === "urgent";
      return notification.type === notificationFilter;
    });

    const handleRefreshNotifications = async () => {
      try {
        const [notificationsData, analyticsData] = await Promise.all([
          getAllNotifications({}), // Remove limit to get ALL notifications for admin
          getNotificationAnalytics(),
        ]);
        setAllNotifications(notificationsData?.data || []);
        setNotificationAnalytics(analyticsData);
      } catch (error) {
        console.error("Error refreshing notifications:", error);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              All System Notifications
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Admin access - viewing all notifications across the entire
              platform
              {allNotifications.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  {allNotifications.length} total notifications loaded
                </span>
              )}
              {filteredNotifications.length !== allNotifications.length && (
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                  {filteredNotifications.length} filtered
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefreshNotifications}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Activity className="w-4 h-4" />
              Refresh
            </button>
            <div className="relative">
              <select
                value={notificationFilter}
                onChange={(e) => setNotificationFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread Only</option>
                <option value="urgent">Urgent</option>
                <option value="chat">Chat Messages</option>
                <option value="order_status">Order Updates</option>
                <option value="approval">Approvals</option>
                <option value="health_record">Health Records</option>
                <option value="system">System</option>
              </select>
              <Filter className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Analytics Summary */}
        {notificationAnalytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {notificationAnalytics.total || 0}
                  </p>
                </div>
                <Bell className="w-8 h-8 text-blue-600 opacity-30" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Unread</p>
                  <p className="text-2xl font-bold text-red-900">
                    {notificationAnalytics.unread || 0}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600 opacity-30" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Urgent</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {notificationAnalytics.urgent || 0}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-600 opacity-30" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Today</p>
                  <p className="text-2xl font-bold text-green-900">
                    {notificationAnalytics.today || 0}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-600 opacity-30" />
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-all ${
                  !notification.read
                    ? "border-l-4 border-l-blue-500 bg-blue-50/30"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {notification.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(
                            notification.priority
                          )}`}
                        >
                          {notification.priority?.toUpperCase() || "NORMAL"}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                        {notification.recipient && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {notification.recipient.firstName}{" "}
                            {notification.recipient.lastName}
                          </span>
                        )}
                        <span className="capitalize px-2 py-0.5 bg-gray-100 rounded text-gray-700">
                          {notification.type?.replace(/_/g, " ")}
                        </span>
                        {/* Admin-specific information */}
                        {notification.adminView && (
                          <>
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 rounded text-blue-700">
                              <Eye className="w-3 h-3" />
                              {notification.adminView.totalRecipients}{" "}
                              recipients
                            </span>
                            {notification.adminView.unreadCount > 0 && (
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 rounded text-red-700">
                                <AlertTriangle className="w-3 h-3" />
                                {notification.adminView.unreadCount} unread
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() =>
                        handleDismissNotification(notification._id)
                      }
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Dismiss notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              {notificationFilter === "all"
                ? "No notifications found"
                : `No ${notificationFilter} notifications`}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {notificationFilter === "all"
                ? "Notifications will appear here when they are created"
                : "Try changing the filter to see more notifications"}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewSection
            stats={stats}
            loading={loading}
            onViewPatientDetails={setSelectedPatient}
            onSelectPharmacy={setSelectedPharmacy}
          />
        );
      case "approvals":
        return (
          <PendingApprovalsSection
            approvals={pendingApprovals}
            loading={loading}
            onSelectApproval={setSelectedApproval}
          />
        );
      case "pharmacies":
        return (
          <PharmaciesSection
            pharmacies={pharmacies}
            loading={loading}
            onSelectPharmacy={setSelectedPharmacy}
            onToggleUserStatus={handleToggleUserStatus}
          />
        );
      case "patients":
        return (
          <PatientsSection
            patients={patients}
            loading={loading}
            onViewPatientDetails={handleViewPatientDetails}
            onToggleUserStatus={handleToggleUserStatus}
          />
        );
      case "admins":
        return <AdminsSection admins={admins} loading={loading} />;
      case "notifications":
        return (
          <NotificationsSection
            notifications={allNotifications}
            notificationAnalytics={notificationAnalytics}
            notificationFilter={notificationFilter}
            setNotificationFilter={setNotificationFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            selectedNotificationIds={selectedNotificationIds}
            setSelectedNotificationIds={setSelectedNotificationIds}
            loading={loading}
            onMarkAsRead={handleMarkAsRead}
            onDeleteNotifications={handleDeleteNotifications}
            onNotificationAction={handleNotificationAction}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#115E59",
        backgroundImage: "linear-gradient(135deg, #115E59 0%, #0F4C47 100%)",
      }}
    >
      {/* Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        notificationAnalytics={notificationAnalytics}
        onLogout={handleLogout}
      />

      {/* Main Content - FIXED WRAPPER with responsive margins */}
      <div
        className={`transition-all duration-200 ease-in-out ${
          sidebarOpen ? "lg:ml-64 ml-0" : "lg:ml-16 ml-0"
        }`}
      >
        {/* Top Bar */}
        <AdminTopBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onShowNotificationCreator={() => setShowNotificationCreator(true)}
          notifications={allNotifications}
          notificationAnalytics={notificationAnalytics}
          onMarkAsRead={handleMarkAsRead}
        />

        {/* Content */}
        <div className="p-4 lg:p-6">{renderContent()}</div>
      </div>

      {/* Modals */}
      <ApprovalModal
        selectedApproval={selectedApproval}
        onClose={() => {
          setSelectedApproval(null);
          setApprovalAction(null);
          setRemarks("");
        }}
        approvalAction={approvalAction}
        setApprovalAction={setApprovalAction}
        remarks={remarks}
        setRemarks={setRemarks}
        actionLoading={actionLoading}
        onApprovalAction={handleApprovalAction}
      />

      <PharmacyDetailsModal
        selectedPharmacy={selectedPharmacy}
        onClose={() => setSelectedPharmacy(null)}
        onToggleUserStatus={handleToggleUserStatus}
      />

      <PatientDetailsModal
        selectedPatient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
        onToggleUserStatus={handleToggleUserStatus}
      />

      {/* Notification Creator Modal */}
      {showNotificationCreator && (
        <NotificationCreator
          onClose={() => setShowNotificationCreator(false)}
          onSuccess={() => {
            console.log("Notification created successfully");
            // Optionally refresh notifications or show success message
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
