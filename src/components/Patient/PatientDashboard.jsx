import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Login";
import {
  User,
  Calendar,
  FileText,
  Activity,
  LogOut,
  Bell,
  Settings,
  ChevronRight,
  Clock,
  Pill,
  Heart,
  MapPin,
  Phone,
  Mail,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  UploadCloud,
  MessageCircle,
  Video,
  CreditCard,
  Package,
  X,
  Share,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  ChevronDown,
  Home,
  Users,
  BarChart3,
  Menu,
  Stethoscope,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import StatsGrid from "./StatsGrid";
import QuickActions from "./QuickActions";
import UpcomingAppointments from "./UpcomingAppointments";
import ActivePrescriptions from "./ActivePrescriptions";
import UploadPrescription from "./UploadPrescription";
import ViewNearbyPharmacies from "./ViewNearbyPharmacies";
import ChatWithPharmacy from "./ChatWithPharmacy";
import OrderHistory from "./OrderHistory";
import NotificationIcon from "../Notifications/NotificationIcon";
import AdvancedNotificationCenter from "../Notifications/AdvancedNotificationCenter";
import UnifiedNotificationCenter from "../Notifications/UnifiedNotificationCenter";
import { useAdvancedNotifications } from "../../hooks/useAdvancedNotifications";

// Import new components
import PatientSidebar from "./components/PatientSidebar";
import PatientTopBar from "./components/PatientTopBar";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const PatientDashboard = ({ initialTab = "overview" }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [chatPharmacyId, setChatPharmacyId] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [bookingData, setBookingData] = useState({
    pharmacyId: "",
    scheduledAt: "",
    notes: "",
  });
  const [healthRecords, setHealthRecords] = useState({
    medicalHistory: [],
    allergies: [],
    currentMedications: [],
    vitalSigns: [],
    emergencyContact: {},
    insuranceInfo: {},
    chronicConditions: [],
    labResults: [],
  });
  const [showAddHealthRecord, setShowAddHealthRecord] = useState(false);
  const [healthRecordForm, setHealthRecordForm] = useState({
    type: "medical-history",
    condition: "",
    diagnosedDate: "",
    status: "active",
    notes: "",
    attachments: [],
  });
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Add notifications hook
  const {
    chatUnreadCounts,
    approvalNotifications,
    orderStatusNotifications,
    getNotificationCounts,
    markChatAsRead,
    markOrderStatusAsRead,
  } = useAdvancedNotifications();
  const [showShareModal, setShowShareModal] = useState(false);
  const [nearbyPharmacies, setNearbyPharmacies] = useState([]);
  const [shareRecordType, setShareRecordType] = useState("medical-history");

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  // Get default form structure based on type
  const getDefaultHealthRecordForm = (type = "medical-history") => {
    const baseForm = { type, notes: "", attachments: [] };

    switch (type) {
      case "medical-history":
        return {
          ...baseForm,
          condition: "",
          diagnosedDate: "",
          status: "active",
        };
      case "allergy":
        return {
          ...baseForm,
          allergen: "",
          severity: "moderate",
          reaction: "",
        };
      case "medication":
        return {
          ...baseForm,
          name: "",
          dosage: "",
          frequency: "",
          startDate: "",
          endDate: "",
        };
      case "vital-signs":
        return {
          ...baseForm,
          bloodPressure: "",
          heartRate: "",
          temperature: "",
          weight: "",
        };
      case "emergency-contact":
        return { ...baseForm, name: "", relationship: "", phone: "" };
      default:
        return baseForm;
    }
  };

  // Handle form type change
  const handleFormTypeChange = (newType) => {
    setHealthRecordForm(getDefaultHealthRecordForm(newType));
  };

  // Health records utility functions
  const handleAddHealthRecord = async () => {
    try {
      const response = await axiosInstance.post(
        "/patients/health-records",
        healthRecordForm
      );

      // Refresh health records from server to ensure data persistence
      const healthRes = await axiosInstance.get("/patients/health-records");
      setHealthRecords(healthRes.data.data);

      setShowAddHealthRecord(false);
      setHealthRecordForm(getDefaultHealthRecordForm());

      console.log("Health record added successfully:", response.data);
    } catch (error) {
      console.error("Error adding health record:", error);
      alert("Error adding health record. Please try again.");
    }
  };

  const handleDeleteHealthRecord = async (type, recordId) => {
    try {
      await axiosInstance.delete(
        `/patients/health-records/${type}/${recordId}`
      );

      // Refresh health records from server to ensure data persistence
      const healthRes = await axiosInstance.get("/patients/health-records");
      setHealthRecords(healthRes.data.data);

      console.log("Health record deleted successfully");
    } catch (error) {
      console.error("Error deleting health record:", error);
      alert("Error deleting health record. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "confirmed":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "completed":
      case "resolved":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleShareWithPharmacy = async (recordIds, recordType, pharmacyId) => {
    try {
      const response = await axiosInstance.post(
        "/patients/health-records/share",
        {
          pharmacyId,
          recordIds,
          recordType,
        }
      );

      alert("Health records shared with pharmacy successfully!");
      // Refresh health records
      const healthRes = await axiosInstance.get("/patients/health-records");
      setHealthRecords(healthRes.data.data);
    } catch (error) {
      console.error("Error sharing health records:", error);
      alert("Error sharing health records. Please try again.");
    }
  };

  // Fetch data on mount
  useEffect(() => {
    Promise.all([
      axiosInstance.get("/patients/profile"),
      axiosInstance.get("/patients/consultations"),
      axiosInstance.get("/patients/prescriptions/history"),
      axiosInstance.get("/patients/health-records"),
      axiosInstance.get("/patients/pharmacies/nearby"),
    ])
      .then(([profileRes, apptRes, presRes, healthRes, pharmaciesRes]) => {
        setProfile(profileRes.data.data);
        setAppointments(apptRes.data.data);
        setPrescriptions(presRes.data.data);
        setHealthRecords(healthRes.data.data);
        setNearbyPharmacies(pharmaciesRes.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  // Prepare stats
  const stats = profile
    ? [
        {
          icon: Calendar,
          label: "Appointments",
          value: profile.pharmacyConsultations.length,
          color: "bg-[#256C5C]",
          cardBg: "bg-[#CAE7E1]",
          iconBg: "bg-[#256C5C20]",
          iconColor: "text-[#256C5C]",
          textColor: "text-gray-900",
          labelColor: "text-gray-700",
          trend: "+12%",
          trendUp: true,
          data: [
            { name: "Mon", value: 10 },
            { name: "Tue", value: 20 },
            { name: "Wed", value: 40 },
            { name: "Thu", value: 30 },
            { name: "Fri", value: 40 },
          ],
        },
        {
          icon: FileText,
          label: "Prescriptions",
          value: profile.prescriptionHistory.length,
          color: "bg-[#256C5C]",
          cardBg: "bg-[#CAE7E1]",
          iconBg: "bg-[#256C5C20]",
          iconColor: "text-[#256C5C]",
          textColor: "text-gray-900",
          labelColor: "text-gray-700",
          trend: "+8%",
          trendUp: true,
          data: [
            { name: "Mon", value: 20 },
            { name: "Tue", value: 10 },
            { name: "Wed", value: 30 },
            { name: "Thu", value: 30 },
            { name: "Fri", value: 40 },
          ],
        },
        {
          icon: Pill,
          label: "Active Medications",
          value: profile.currentMedications.length,
          color: "bg-[#256C5C]",
          cardBg: "bg-[#CAE7E1]",
          iconBg: "bg-[#256C5C20]",
          iconColor: "text-[#256C5C]",
          textColor: "text-gray-900",
          labelColor: "text-gray-700",
          trend: "-2%",
          trendUp: false,
          data: [
            { name: "Mon", value: 10 },
            { name: "Tue", value: 20 },
            { name: "Wed", value: 20 },
            { name: "Thu", value: 30 },
            { name: "Fri", value: 40 },
          ],
        },
        {
          icon: Heart,
          label: "Health Score",
          value: "85%",
          color: "bg-[#256C5C]",
          cardBg: "bg-[#CAE7E1]",
          iconBg: "bg-[#256C5C20]",
          iconColor: "text-[#256C5C]",
          textColor: "text-gray-900",
          labelColor: "text-gray-700",
          trend: "+5%",
          trendUp: true,
          data: [
            { name: "Mon", value: 20 },
            { name: "Tue", value: 10 },
            { name: "Wed", value: 10 },
            { name: "Thu", value: 30 },
            { name: "Fri", value: 40 },
          ],
        },
      ]
    : [];

  const getStrokeColor = (label) => {
    switch (label) {
      case "Appointments":
        return "#ffd700"; // blue-400
      case "Prescriptions":
        return "#ffd700"; // emerald-400
      case "Active Medications":
        return "#ffd700"; // purple-400
      case "Health Score":
        return "#ffd700"; // rose-400
      default:
        return "#ffd700"; // fallback gold
    }
  };

  // Custom action handler: open modal for booking, navigate for others
  const handleQuickAction = (id) => {
    if (id === "appointments") {
      setActiveTab("appointments");
      setBookingModalOpen(true);
    } else if (id === "pharmacies") {
      // Navigate to pharmacies search page
      navigate("/patient/pharmacies");
    } else {
      setActiveTab(id);
    }
  };

  const renderOverview = () => (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-[#256C5C] shadow-neo-inner rounded-[1.6rem] px-6 py-5 border border-[#256C5C40] transition-all duration-300"
            >
                <div className="flex items-start justify-between mb-4">
                  <div className="">
                    <h2 className="text-[1.8rem] font-bold text-white mb-1">
                      {stat.value}
                    </h2>
                    <p className="text-sm text-gray-200 mb-2">{stat.label}</p>
                    <div className="w-20 ">
                      {stat.trend && (
                        <div
                          className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-xl
                      ${
                        stat.trendUp
                          ? "bg-[rgb(0_255_114_/_0.15)] text-[rgb(0_255_114)]"
                          : "bg-[rgb(255_86_86_/_0.25)] text-[#ff9cab]"
                      }`}
                        >
                          {stat.trendUp ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span>{stat.trend}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-full bg-white bg-opacity-20`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div>
                  {/* Line Chart */}
                  <div className="h-12">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stat.data}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={getStrokeColor(stat.label)}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions - Already updated */}
      <div className="bg-[#256C5C] rounded-2xl p-6 shadow-sm border border-[#256C5C40]">
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              id: "appointments",
              icon: Calendar,
              label: "Book Appointment",
              color: "blue",
            },
            {
              id: "prescriptions",
              icon: FileText,
              label: "View Prescriptions",
              color: "emerald",
            },
            {
              id: "upload",
              icon: UploadCloud,
              label: "Upload Prescription",
              color: "purple",
            },
            {
              id: "pharmacies",
              icon: MapPin,
              label: "Find Pharmacies",
              color: "rose",
            },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.id)}
                className={`p-6 flex flex-col gap-2 items-center rounded-xl bg-[#CAE7E1] border-2 border-transparent hover:border-[#256C5C40] hover:bg-[#b8ddd5] transition-all duration-300 group relative`}
              >
                <Icon
                  className={`w-8 h-8 text-${action.color}-500 mb-3 group-hover:scale-110 transition-transform`}
                />
                <p className="text-sm font-medium text-gray-900">
                  {action.label}
                </p>
                
                {/* Navigation Arrow Icon - Always Visible */}
                <div className="absolute top-2 right-2">
                  <svg 
                    className="w-4 h-4 text-[#256C5C]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                    />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity - Already updated */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#256C5C] rounded-2xl p-6 shadow-sm border border-[#256C5C40]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Upcoming Appointments
            </h3>
            <button
              onClick={() => setActiveTab("appointments")}
              className="text-sm text-yellow-400 hover:text-yellow-500 font-medium"
            >
              View all
            </button>
          </div>
          <div className="space-y-4">
            {appointments.slice(0, 3).map((appointment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-[#CAE7E1] hover:bg-[#b8ddd5] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#256C5C20] flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-[#256C5C]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {appointment.pharmacyId?.pharmacyName || "Pharmacy"}
                    </p>
                    <p className="text-sm text-gray-700">
                      {new Date(appointment.scheduledAt).toLocaleDateString()}{" "}
                      at{" "}
                      {new Date(appointment.scheduledAt).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#256C5C] rounded-2xl p-6 shadow-sm border border-[#256C5C40]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Active Prescriptions
            </h3>
            <button
              onClick={() => setActiveTab("prescriptions")}
              className="text-sm text-yellow-400 hover:text-yellow-500 font-medium"
            >
              View all
            </button>
          </div>
          <div className="space-y-4">
            {prescriptions
              .filter((p) => p.status === "accepted" || p.status === "pending")
              .slice(0, 3)
              .map((prescription, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-[#CAE7E1] hover:bg-[#b8ddd5] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#256C5C20] flex items-center justify-center">
                      <Pill className="w-6 h-6 text-[#256C5C]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {prescription.medications?.[0]?.name || "Medication"}
                      </p>
                      <p className="text-sm text-gray-700">
                        {prescription.medications?.[0]?.dosage || "Dosage"}
                      </p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-[#256C5C] text-white rounded-lg text-sm font-medium hover:bg-[#1e5648] transition-colors">
                    Refill
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(
        "/patients/consultations",
        bookingData
      );
      setAppointments((prev) => [...prev, res.data.data]);
      setBookingModalOpen(false);
      setBookingData({
        pharmacyId: "",
        scheduledAt: "",
        notes: "",
      });
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
        <button
          onClick={() => setBookingModalOpen(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Book New Appointment
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-200 w-5 h-5" />
              <input
                type="text"
                placeholder="Search appointments..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-2 transition-colors">
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all hover:border-blue-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.pharmacyId?.pharmacyName ||
                          "Pharmacy Consultation"}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(
                            appointment.scheduledAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(appointment.scheduledAt).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {appointment.consultationType || "In-person"}
                        </span>
                      </div>
                    </div>
                    {appointment.notes && (
                      <p className="text-sm text-gray-600 mt-3 bg-gray-50 p-3 rounded-lg">
                        {appointment.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors">
                      Reschedule
                    </button>
                    <button className="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleBookingSubmit}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-in slide-in-from-bottom-5"
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900">
                Book Appointment
              </h3>
              <p className="text-gray-600 mt-1">
                Schedule a consultation with a healthcare provider
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pharmacy <span className="text-red-500">*</span>
                </label>
                <select
                  value={bookingData.pharmacyId}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      pharmacyId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select a pharmacy</option>
                  {nearbyPharmacies.map((pharmacy) => (
                    <option key={pharmacy._id} value={pharmacy._id}>
                      {pharmacy.pharmacyName} - {pharmacy.distance?.toFixed(1)}
                      km away
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={bookingData.scheduledAt}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      scheduledAt: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  placeholder="Any special requirements or notes..."
                  value={bookingData.notes}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, notes: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-6 bg-gray-50 rounded-b-2xl">
              <button
                type="button"
                onClick={() => {
                  setBookingModalOpen(false);
                  setBookingData({
                    pharmacyId: "",
                    scheduledAt: "",
                    notes: "",
                  });
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-lg hover:shadow-xl"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );

  const renderPrescriptions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Prescriptions</h2>
        <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2">
          <Download className="w-5 h-5" />
          Download All
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex gap-2">
            <button className="px-5 py-2.5 bg-blue-50 text-blue-600 rounded-lg font-medium border border-blue-200">
              Active (
              {
                prescriptions.filter(
                  (p) => p.status === "accepted" || p.status === "pending"
                ).length
              }
              )
            </button>
            <button className="px-5 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              Completed (
              {prescriptions.filter((p) => p.status === "completed").length})
            </button>
            <button className="px-5 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              All ({prescriptions.length})
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {prescriptions.map((prescription) => (
            <div
              key={prescription._id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {prescription.medications?.[0]?.name || "Prescription"}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        prescription.status
                      )}`}
                    >
                      {prescription.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="space-y-1">
                      <p>
                        <span className="font-medium">Dosage:</span>{" "}
                        {prescription.medications?.[0]?.dosage || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Frequency:</span>{" "}
                        {prescription.medications?.[0]?.frequency || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p>
                        <span className="font-medium">Prescribed by:</span>{" "}
                        {prescription.doctorId?.name || "Doctor"}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  {(prescription.status === "accepted" ||
                    prescription.status === "pending") && (
                    <button className="px-4 py-2 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-colors">
                      Order Refill
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHealthRecords = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold" style={{ color: "#CAE7E1" }}>Health Records</h2>
        <button
          onClick={() => setShowAddHealthRecord(true)}
          className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add Health Record
        </button>
      </div>

      {/* Personal Information */}
      <div className="rounded-2xl shadow-sm p-6 border" style={{ backgroundColor: "#CAE7E1", borderColor: "rgba(37, 108, 92, 0.2)" }}>
        <h3 className="text-lg font-semibold mb-6 text-black">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full" style={{ backgroundColor: "#256C5C" }}>
              <User className="w-5 h-5" style={{ color: "#CAE7E1" }} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-medium text-black">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full" style={{ backgroundColor: "#256C5C" }}>
              <Mail className="w-5 h-5" style={{ color: "#CAE7E1" }} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-black">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full" style={{ backgroundColor: "#256C5C" }}>
              <Phone className="w-5 h-5" style={{ color: "#CAE7E1" }} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium text-black">
                {user?.phone || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full" style={{ backgroundColor: "#256C5C" }}>
              <Calendar className="w-5 h-5" style={{ color: "#CAE7E1" }} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Date of Birth</p>
              <p className="font-medium text-black">
                {user?.dateOfBirth
                  ? new Date(user.dateOfBirth).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full" style={{ backgroundColor: "#256C5C" }}>
              <User className="w-5 h-5" style={{ color: "#CAE7E1" }} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="font-medium capitalize text-black">
                {user?.gender || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full" style={{ backgroundColor: "#256C5C" }}>
              <MapPin className="w-5 h-5" style={{ color: "#CAE7E1" }} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium text-black">
                {user?.address
                  ? `${user.address.street}, ${user.address.city}, ${user.address.state}`
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Medical History */}
      <div className="rounded-2xl shadow-sm p-6 border" style={{ backgroundColor: "#CAE7E1", borderColor: "rgba(37, 108, 92, 0.2)" }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-black">
            <FileText className="w-5 h-5" />
            Medical History
          </h3>
          {healthRecords.medicalHistory?.length > 0 && (
            <button
              onClick={() => {
                setShareRecordType("medical-history");
                setShowShareModal(true);
              }}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <Share className="w-4 h-4" />
              Share with Pharmacy
            </button>
          )}
        </div>
        <div className="space-y-4">
          {healthRecords.medicalHistory?.length > 0 ? (
            healthRecords.medicalHistory.map((history) => (
              <div
                key={history._id}
                className="border rounded-xl p-5 transition-all hover:shadow-sm bg-white"
                style={{ borderColor: "rgba(37, 108, 92, 0.3)" }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedRecords.includes(history._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRecords((prev) => [...prev, history._id]);
                        } else {
                          setSelectedRecords((prev) =>
                            prev.filter((id) => id !== history._id)
                          );
                        }
                      }}
                      className="mt-1 w-4 h-4 border-gray-300 rounded focus:ring-2"
                      style={{ accentColor: "#256C5C" }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-lg text-black">
                        {history.condition}
                      </h4>
                      <p className="text-sm mt-1 text-gray-600">
                        Diagnosed:{" "}
                        {new Date(history.diagnosedDate).toLocaleDateString()}
                      </p>
                      {history.doctor && (
                        <p className="text-sm text-gray-600">
                          Doctor: {history.doctor}
                        </p>
                      )}
                      {history.notes && (
                        <p className="text-sm mt-3 p-3 rounded-lg bg-gray-50 text-gray-700">
                          {history.notes}
                        </p>
                      )}
                      {/* Show sharing status */}
                      {history.sharedWithPharmacies?.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium" style={{ color: "#256C5C" }}>
                            Shared with {history.sharedWithPharmacies.length}{" "}
                            pharmacy(ies)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        history.status
                      )}`}
                    >
                      {history.status}
                    </span>
                    <button
                      onClick={() =>
                        handleDeleteHealthRecord("medical-history", history._id)
                      }
                      className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg text-black">
                No medical history records
              </p>
              <p className="text-sm mt-1 text-gray-600">
                Add your first record to get started
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Current Medications */}
      <div className="rounded-2xl shadow-sm p-6 border" style={{ backgroundColor: "#CAE7E1", borderColor: "rgba(37, 108, 92, 0.2)" }}>
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-black">
          <Pill className="w-5 h-5" />
          Current Medications
        </h3>
        <div className="space-y-4">
          {healthRecords.currentMedications?.length > 0 ? (
            healthRecords.currentMedications.map((medication) => (
              <div
                key={medication._id}
                className="border rounded-xl p-5 transition-all hover:shadow-sm bg-white"
                style={{ borderColor: "rgba(37, 108, 92, 0.3)" }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-lg text-black">
                      {medication.name}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Dosage:</span>{" "}
                        {medication.dosage}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Frequency:</span>{" "}
                        {medication.frequency}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Started:</span>{" "}
                        {new Date(medication.startDate).toLocaleDateString()}
                      </p>
                      {medication.endDate && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Ends:</span>{" "}
                          {new Date(medication.endDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleDeleteHealthRecord("medication", medication._id)
                    }
                    className="text-red-500 hover:text-red-700 p-1.5 rounded-full transition-colors ml-4 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Pill className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg text-black">No current medications</p>
              <p className="text-sm mt-1 text-gray-600">
                Add medications you're currently taking
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Allergies */}
      <div className="rounded-2xl shadow-sm p-6 border" style={{ backgroundColor: "#CAE7E1", borderColor: "rgba(37, 108, 92, 0.2)" }}>
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-black">
          <AlertTriangle className="w-5 h-5" />
          Allergies & Intolerances
        </h3>
        <div className="space-y-2">
          {healthRecords.allergies?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {healthRecords.allergies.map((allergy, index) => (
                <span
                  key={allergy._id || index}
                  className="bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-red-200"
                >
                  {allergy.allergen || allergy}
                  {allergy.severity && (
                    <span className="text-xs font-medium">
                      ({allergy.severity})
                    </span>
                  )}
                  <button
                    onClick={() => {
                      handleDeleteHealthRecord("allergy", allergy._id);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <p className="text-lg text-black">No known allergies</p>
              <p className="text-sm mt-1 text-gray-600">
                Add any allergies or intolerances
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="rounded-2xl shadow-sm p-6 border" style={{ backgroundColor: "#CAE7E1", borderColor: "rgba(37, 108, 92, 0.2)" }}>
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-black">
          <Phone className="w-5 h-5" />
          Emergency Contact
        </h3>
        {healthRecords.emergencyContact?.name ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-white" style={{ borderColor: "rgba(37, 108, 92, 0.3)" }}>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium mt-1 text-black">
                {healthRecords.emergencyContact.name}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white" style={{ borderColor: "rgba(37, 108, 92, 0.3)" }}>
              <p className="text-sm text-gray-600">Relationship</p>
              <p className="font-medium mt-1 text-black">
                {healthRecords.emergencyContact.relationship}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white" style={{ borderColor: "rgba(37, 108, 92, 0.3)" }}>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium mt-1 text-black">
                {healthRecords.emergencyContact.phone}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Phone className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg text-black">No emergency contact information</p>
            <p className="text-sm mt-1 text-gray-600">Add an emergency contact for safety</p>
          </div>
        )}
      </div>

      {/* Vital Signs */}
      <div className="rounded-2xl shadow-sm p-6 border" style={{ backgroundColor: "#CAE7E1", borderColor: "rgba(37, 108, 92, 0.2)" }}>
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-black">
          <Activity className="w-5 h-5" />
          Recent Vital Signs
        </h3>
        <div className="space-y-4">
          {healthRecords.vitalSigns?.length > 0 ? (
            healthRecords.vitalSigns.slice(0, 3).map((vital) => (
              <div
                key={vital._id}
                className="border rounded-xl p-5 transition-all bg-white"
                style={{ borderColor: "rgba(37, 108, 92, 0.3)" }}
              >
                <div className="flex justify-between items-start">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-sm text-gray-600">Blood Pressure</p>
                      <p className="font-semibold mt-1 text-black">
                        {vital.bloodPressure || "N/A"}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-sm text-gray-600">Heart Rate</p>
                      <p className="font-semibold mt-1 text-black">
                        {vital.heartRate || "N/A"} bpm
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-sm text-gray-600">Temperature</p>
                      <p className="font-semibold mt-1 text-black">
                        {vital.temperature || "N/A"}°F
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold mt-1 text-black">
                        {new Date(vital.recordedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleDeleteHealthRecord("vital-signs", vital._id)
                    }
                    className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-full transition-colors ml-4"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg text-black">No vital signs recorded</p>
              <p className="text-sm mt-1 text-gray-600">Record your vital signs regularly</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Health Record Modal */}
      {showAddHealthRecord && (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50 p-4">
    <div className="max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl rounded-2xl flex" style={{ backgroundColor: '#CAE7E1' }}>
      {/* Left Sidebar - Record Type Stepper */}
      <div className="w-64 border-r-2 border-gray-400 overflow-y-auto" style={{ background: 'linear-gradient(135deg, #4A9D8F 0%, #256C5C 100%)' }}>
        <div className="p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Record Type</h4>
          <div className="space-y-2">
            <button
              onClick={() => handleFormTypeChange("medical-history")}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                healthRecordForm.type === "medical-history"
                  ? "bg-white bg-opacity-25 text-white shadow-md"
                  : "hover:bg-white hover:bg-opacity-15 text-white"
              }`}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium text-white">Medical History</span>
            </button>
            
            <button
              onClick={() => handleFormTypeChange("medication")}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                healthRecordForm.type === "medication"
                  ? "bg-white bg-opacity-25 text-white shadow-md"
                  : "hover:bg-white hover:bg-opacity-15 text-white"
              }`}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span className="font-medium text-white">Current Medication</span>
            </button>
            
            <button
              onClick={() => handleFormTypeChange("allergy")}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                healthRecordForm.type === "allergy"
                  ? "bg-white bg-opacity-25 text-white shadow-md"
                  : "hover:bg-white hover:bg-opacity-15 text-white"
              }`}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium text-white">Allergy</span>
            </button>
            
            <button
              onClick={() => handleFormTypeChange("vital-signs")}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                healthRecordForm.type === "vital-signs"
                  ? "bg-white bg-opacity-25 text-white shadow-md"
                  : "hover:bg-white hover:bg-opacity-15 text-white"
              }`}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-medium text-white">Vital Signs</span>
            </button>
            
            <button
              onClick={() => handleFormTypeChange("emergency-contact")}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                healthRecordForm.type === "emergency-contact"
                  ? "bg-white bg-opacity-25 text-white shadow-md"
                  : "hover:bg-white hover:bg-opacity-15 text-white"
              }`}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-medium text-white">Emergency Contact</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Content - Form */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-300 border-opacity-30">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Add Health Record
            </h3>
            <button
              onClick={() => {
                setShowAddHealthRecord(false);
                setHealthRecordForm(getDefaultHealthRecordForm());
              }}
              className="hover:bg-white hover:bg-opacity-50 p-2 rounded-full transition-colors text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {healthRecordForm.type === "medical-history" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Condition/Diagnosis
                  </label>
                  <input
                    type="text"
                    value={healthRecordForm.condition}
                    onChange={(e) =>
                      setHealthRecordForm((prev) => ({
                        ...prev,
                        condition: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    placeholder="Enter medical condition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Diagnosed Date
                  </label>
                  <input
                    type="date"
                    value={healthRecordForm.diagnosedDate}
                    onChange={(e) =>
                      setHealthRecordForm((prev) => ({
                        ...prev,
                        diagnosedDate: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Status
                  </label>
                  <select
                    value={healthRecordForm.status}
                    onChange={(e) =>
                      setHealthRecordForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="resolved">Resolved</option>
                    <option value="monitoring">Monitoring</option>
                  </select>
                </div>
              </>
            )}

            {healthRecordForm.type === "allergy" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Allergen
                  </label>
                  <input
                    type="text"
                    value={healthRecordForm.allergen || ""}
                    onChange={(e) =>
                      setHealthRecordForm((prev) => ({
                        ...prev,
                        allergen: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    placeholder="Enter allergen (e.g., Penicillin, Nuts)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Severity
                  </label>
                  <select
                    value={healthRecordForm.severity || "moderate"}
                    onChange={(e) =>
                      setHealthRecordForm((prev) => ({
                        ...prev,
                        severity: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Reaction
                  </label>
                  <input
                    type="text"
                    value={healthRecordForm.reaction || ""}
                    onChange={(e) =>
                      setHealthRecordForm((prev) => ({
                        ...prev,
                        reaction: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    placeholder="Describe the allergic reaction"
                  />
                </div>
              </>
            )}

            {healthRecordForm.type === "medication" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Medication Name
                  </label>
                  <input
                    type="text"
                    value={healthRecordForm.name || ""}
                    onChange={(e) =>
                      setHealthRecordForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    placeholder="Enter medication name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={healthRecordForm.dosage || ""}
                    onChange={(e) =>
                      setHealthRecordForm((prev) => ({
                        ...prev,
                        dosage: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    placeholder="e.g., 10mg, 500mg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Frequency
                  </label>
                  <input
                    type="text"
                    value={healthRecordForm.frequency || ""}
                    onChange={(e) =>
                      setHealthRecordForm((prev) => ({
                        ...prev,
                        frequency: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    placeholder="e.g., Once daily, Twice daily"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={healthRecordForm.startDate || ""}
                    onChange={(e) =>
                      setHealthRecordForm((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={healthRecordForm.endDate || ""}
                    onChange={(e) =>
                      setHealthRecordForm((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  />
                </div>
              </>
            )}

            {healthRecordForm.type === "vital-signs" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Blood Pressure
                  </label>
                  <input
                    type="text"
                    value={healthRecordForm.bloodPressure || ""}
                    onChange={(e) =>
                      setHealthRecordForm((prev) => ({
                        ...prev,
                        bloodPressure: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    placeholder="e.g., 120/80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={healthRecordForm.weight || ""}
                    onChange={(e) =>
                      setHealthRecordForm((prev) => ({
                        ...prev,
                        weight: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    placeholder="e.g., 70.5"
                  />
                </div>
              </>
            )}

            {healthRecordForm.type === "emergency-contact" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={healthRecordForm.name || ""}
                    onChange={(e) =>
                      setHealthRecordForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    placeholder="Enter contact person's name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={healthRecordForm.relationship || ""}
                    onChange={(e) =>
                      setHealthRecordForm((prev) => ({
                        ...prev,
                        relationship: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    placeholder="e.g., Spouse, Parent, Sibling"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={healthRecordForm.phone || ""}
                    onChange={(e) =>
                      setHealthRecordForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    placeholder="Enter phone number"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Notes
              </label>
              <textarea
                value={healthRecordForm.notes}
                onChange={(e) =>
                  setHealthRecordForm((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                placeholder="Additional notes..."
                rows="3"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 pb-2">
              <button
                onClick={() => {
                  setShowAddHealthRecord(false);
                  setHealthRecordForm(
                    getDefaultHealthRecordForm("medical-history")
                  );
                }}
                className="px-6 py-3 border border-gray-400 text-gray-700 rounded-xl font-medium hover:bg-white hover:bg-opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHealthRecord}
                className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 font-medium transition-colors shadow-lg hover:shadow-xl"
              >
                Add Record
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Share with Pharmacy Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl bg-white">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-black">
                  Share Health Records with Pharmacy
                </h3>
                <button
                  onClick={() => {
                    setShowShareModal(false);
                    setSelectedRecords([]);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Selected Records Summary */}
              {shareRecordType === "medical-history" &&
                selectedRecords.length > 0 && (
                  <div className="rounded-xl p-4 border bg-blue-50 border-blue-200">
                    <h4 className="font-medium mb-3 text-blue-900">
                      Selected Medical Records ({selectedRecords.length})
                    </h4>
                    <div className="space-y-2">
                      {healthRecords.medicalHistory
                        .filter((record) =>
                          selectedRecords.includes(record._id)
                        )
                        .map((record) => (
                          <div
                            key={record._id}
                            className="text-sm flex items-center gap-2 text-blue-800"
                          >
                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                            {record.condition} (Diagnosed:{" "}
                            {new Date(
                              record.diagnosedDate
                            ).toLocaleDateString()}
                            )
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              <div>
                <h4 className="font-medium mb-4 text-black">
                  Select Pharmacy to Share With:
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {nearbyPharmacies.length > 0 ? (
                    nearbyPharmacies.map((pharmacy) => (
                      <div
                        key={pharmacy._id}
                        className="border border-gray-300 rounded-xl p-4 cursor-pointer transition-all hover:shadow-sm hover:border-blue-500 group"
                        onClick={() => {
                          if (
                            shareRecordType === "medical-history" &&
                            selectedRecords.length > 0
                          ) {
                            handleShareWithPharmacy(
                              selectedRecords,
                              shareRecordType,
                              pharmacy._id
                            );
                            setShowShareModal(false);
                            setSelectedRecords([]);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-medium text-black group-hover:text-blue-600 transition-colors">
                              {pharmacy.pharmacyName}
                            </h5>
                            <p className="text-sm mt-1 text-gray-600">
                              {pharmacy.address?.street},{" "}
                              {pharmacy.address?.city}
                            </p>
                            <p className="text-sm text-gray-600">
                              Phone:{" "}
                              {pharmacy.contactInfo?.phone ||
                                pharmacy.phone ||
                                "N/A"}
                            </p>
                            {pharmacy.distance && (
                              <p className="text-xs mt-2 font-medium text-blue-600">
                                {pharmacy.distance.toFixed(1)} km away
                              </p>
                            )}
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg text-black">No nearby pharmacies found</p>
                    </div>
                  )}
                </div>
              </div>

              {shareRecordType === "medical-history" &&
                selectedRecords.length === 0 && (
                  <div className="rounded-xl p-4 bg-yellow-50 border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <p className="text-yellow-800">
                        Please select at least one medical record to share.
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "find-pharmacies", label: "Find Pharmacies", icon: MapPin },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "prescriptions", label: "Prescriptions", icon: FileText },
    { id: "order-history", label: "Order History", icon: Package },
    { id: "health-records", label: "Health Records", icon: Heart },
  ];

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center bg-gradient-to-br from-[#0a2f2c] via-[#104440] to-[#0f3c38]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a2f2c] via-[#104440] to-[#0f3c38] flex relative overflow-hidden">
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      <aside
        className={`fixed lg:relative top-0 left-0 h-screen z-40 bg-[#1e5651] shadow-xl border-r border-[#a2a74739] transition-all duration-300 transform flex-shrink-0
          ${
            sidebarCollapsed
              ? "-translate-x-full lg:translate-x-0 lg:w-16"
              : "translate-x-0 w-64"
          }
        `}
      >
        <div className="p-3 lg:p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div className="flex items-center gap-2 lg:gap-3">
              <Stethoscope
                className={`w-5 h-5 lg:w-6 lg:h-6 text-gray-100 flex-shrink-0 ${
                  sidebarCollapsed ? "lg:hidden" : "block"
                }`}
              />
              <h1
                className={`font-bold text-lg lg:text-xl text-gray-100 transition-opacity duration-300 ${
                  sidebarCollapsed ? "lg:hidden" : "block"
                }`}
              >
                Patient
              </h1>
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-[#a2a74739] rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-4 h-4 lg:w-5 lg:h-5 text-gray-100" />
            </button>
          </div>
          <nav className="space-y-1 lg:space-y-2 flex-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (window.innerWidth < 1024) {
                      setSidebarCollapsed(true);
                    }
                  }}
                  className={`w-full flex ${
                    sidebarCollapsed
                      ? "flex-col justify-center items-center gap-1 py-3"
                      : "flex-row gap-2 lg:gap-3 py-2.5 lg:py-3"
                  } px-3 lg:px-4 rounded-xl font-medium transition-all duration-200 text-sm lg:text-base ${
                    activeTab === tab.id
                      ? "text-yellow-300 hover:bg-[#a2a74739]"
                      : "text-gray-200 hover:text-gray-100 hover:bg-[#a2a74739]"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      activeTab === tab.id ? "bg-[#0a6a6270]" : ""
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                  </div>
                  <span
                    className={`mt-[6px] transition-opacity duration-300 ${
                      sidebarCollapsed ? "lg:hidden hidden" : "block"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
          <div className="mt-4">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl font-medium text-white transition-all duration-200 text-sm lg:text-base
                bg-red-500 shadow-[inset_2px_2px_5px_#cc3b3b,inset_-5px_-5px_10px_#ff6666]
                hover:bg-red-600 active:shadow-[inset_2px_2px_5px_#cc3b3b,inset_-5px_-5px_10px_#ff6666]
                ${sidebarCollapsed ? "lg:justify-center" : ""}
              `}
            >
              <LogOut className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 text-white" />
              <span
                className={`transition-opacity duration-300 ${
                  sidebarCollapsed ? "lg:hidden" : "block"
                }`}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>
      <div className="flex-1 h-screen bg-gradient-to-br from-[#1e5651] via-[#104440] to-[#0f3c38] flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 w-full backdrop-blur-sm bg-[#1e5651]/80 border-b border-[#a2a74739]">
          <div className="px-3 sm:px-4 lg:px-6 py-3 lg:py-4">
            {/* Mobile Header */}
            <div className="flex items-center justify-between lg:hidden mb-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="p-2 hover:bg-[#a2a74739] rounded-lg transition-colors"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5 text-gray-100" />
              </button>

              {/* Mobile Search */}
              <div className="relative flex-1 max-w-[200px] mx-3">
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-full px-3 py-1.5 pr-8 border bg-transparent border-[#a2a74739] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs text-gray-200 placeholder-gray-400 transition-all"
                />
                <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-300" />
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center gap-1">
                <UnifiedNotificationCenter userRole="patient" />
                <button className="p-2 hover:bg-[#a2a74739] rounded-lg transition-colors">
                  <Settings className="w-4 h-4 text-gray-300" />
                </button>
              </div>
            </div>

            {/* Main Header Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4">
              {/* Welcome Section */}
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-200 font-Unbounded truncate">
                  Welcome back, {user?.firstName || "Patient"}!
                </h1>
                <p className="text-yellow-300 mt-1 text-xs sm:text-sm lg:text-base">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="hidden lg:flex items-center gap-3 xl:gap-4 flex-shrink-0">
                <div className="relative w-48 xl:w-64">
                  <input
                    type="search"
                    placeholder="Search..."
                    className="w-full px-4 py-2 pr-10 border bg-transparent border-[#a2a74739] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-200 placeholder-gray-400 transition-all"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-300" />
                </div>

                <UnifiedNotificationCenter userRole="patient" />
                <button className="p-2 hover:bg-[#a2a74739] rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-gray-300" />
                </button>

                <div className="flex items-center gap-3 ml-3 pl-3 border-l border-[#a2a74760]">
                  <div className="text-right hidden xl:block">
                    <p className="text-sm font-medium text-gray-200 truncate max-w-[120px]">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-300 truncate max-w-[120px]">
                      {user?.email}
                    </p>
                  </div>
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#0D554F] border border-[#a2a74760] rounded-full flex items-center justify-center text-white font-medium text-sm lg:text-base flex-shrink-0">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {activeTab === "overview" && renderOverview()}
              {activeTab === "appointments" && (
                <>
                  <UpcomingAppointments appointments={appointments} />
                  {/* Responsive Booking Modal */}
                  {bookingModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                      <form
                        onSubmit={handleBookingSubmit}
                        className="bg-[#104440] p-4 sm:p-6 rounded-lg w-full max-w-sm sm:max-w-md border border-[#a2a74739]"
                      >
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-200 text-center">
                          Book Appointment
                        </h3>

                        <div className="space-y-3 sm:space-y-4">
                          <input
                            type="text"
                            placeholder="Pharmacy ID"
                            value={bookingData.pharmacyId}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                pharmacyId: e.target.value,
                              })
                            }
                            className="w-full border p-2.5 sm:p-3 rounded-xl bg-[#0a2f2c] border-[#a2a74760] text-gray-200 placeholder-gray-400 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />

                          <input
                            type="datetime-local"
                            value={bookingData.scheduledAt}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                scheduledAt: e.target.value,
                              })
                            }
                            className="w-full bg-[#0a2f2c] border-[#a2a74760] p-2.5 sm:p-3 rounded-xl text-gray-200 text-sm sm:text-base border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />

                          <textarea
                            placeholder="Notes"
                            value={bookingData.notes}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                notes: e.target.value,
                              })
                            }
                            rows={3}
                            className="w-full bg-[#0a2f2c] border-[#a2a74760] p-2.5 sm:p-3 rounded-xl text-gray-200 placeholder-gray-400 text-sm sm:text-base border focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6">
                          <button
                            type="button"
                            onClick={() => setBookingModalOpen(false)}
                            className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2.5 bg-yellow-300 hover:bg-yellow-400 text-gray-800 font-semibold rounded-lg transition-colors text-sm sm:text-base"
                          >
                            Confirm
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              )}
              {activeTab === "prescriptions" && (
                <ActivePrescriptions prescriptions={prescriptions} />
              )}
              {activeTab === "upload" && (
                <UploadPrescription
                  onUpload={() => setActiveTab("prescriptions")}
                />
              )}
              {activeTab === "order-history" && <OrderHistory />}
              {activeTab === "health-records" && renderHealthRecords()}
              {activeTab === "find-pharmacies" && (
                <ViewNearbyPharmacies onChat={(phId) => setChatPharmacyId(phId)} />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Chat Modal */}
      {chatPharmacyId && (
        <ChatWithPharmacy
          pharmacyId={chatPharmacyId}
          onClose={() => setChatPharmacyId(null)}
        />
      )}
    </div>
  );
};

export default PatientDashboard;
