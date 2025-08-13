import React, { useState, useEffect } from "react";
import {
  Users,
  Building,
  Clock,
  Activity,
  Mail,
  TrendingUp,
  Eye,
  Calendar,
  MapPin,
  Phone,
  Star,
  ChevronRight,
} from "lucide-react";

const OverviewSection = ({
  stats,
  loading,
  onViewPatientDetails,
  onSelectPharmacy,
}) => {
  const [recentPatients, setRecentPatients] = useState([]);
  const [recentPharmacies, setRecentPharmacies] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  // Demo data for stats
  const demoStats = {
    totalPatients: 1247,
    totalPharmacies: 89,
    pendingApprovals: 23,
    activeUsers: 892,
    verifiedEmails: 1156,
    recentRegistrations: 47
  };

  // Demo data for recent patients
  const demoRecentPatients = [
    {
      _id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      isActive: true
    },
    {
      _id: "2",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 987-6543",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      isActive: true
    },
    {
      _id: "3",
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.brown@email.com",
      phone: "+1 (555) 456-7890",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      isActive: false
    }
  ];

  // Demo data for recent pharmacies
  const demoRecentPharmacies = [
    {
      _id: "1",
      pharmacyName: "HealthPlus Pharmacy",
      address: { city: "New York", state: "NY" },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      isActive: true
    },
    {
      _id: "2",
      pharmacyName: "MediCare Central",
      address: { city: "Los Angeles", state: "CA" },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      isActive: true
    },
    {
      _id: "3",
      pharmacyName: "Wellness Pharmacy",
      address: { city: "Chicago", state: "IL" },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      isActive: false
    }
  ];

  // Fetch recent patients and pharmacies
  useEffect(() => {
    if (!loading && stats) {
      fetchRecentData();
    } else {
      // Use demo data
      setRecentPatients(demoRecentPatients);
      setRecentPharmacies(demoRecentPharmacies);
    }
  }, [loading, stats]);

  const fetchRecentData = async () => {
    setLoadingRecent(true);
    try {
      const [patientsResponse, pharmaciesResponse] = await Promise.all([
        fetch(
          "http://localhost:1111/api/v1/admin/patients?limit=5&sort=createdAt",
          {
            credentials: "include",
          }
        ),
        fetch(
          "http://localhost:1111/api/v1/admin/pharmacies?limit=5&sort=createdAt",
          {
            credentials: "include",
          }
        ),
      ]);

      const patientsData = await patientsResponse.json();
      const pharmaciesData = await pharmaciesResponse.json();

      if (patientsData.success) {
        setRecentPatients(patientsData.data.slice(0, 5));
      } else {
        setRecentPatients(demoRecentPatients);
      }
      if (pharmaciesData.success) {
        setRecentPharmacies(pharmaciesData.data.slice(0, 5));
      } else {
        setRecentPharmacies(demoRecentPharmacies);
      }
    } catch (error) {
      console.error("Error fetching recent data:", error);
      setRecentPatients(demoRecentPatients);
      setRecentPharmacies(demoRecentPharmacies);
    } finally {
      setLoadingRecent(false);
    }
  };

  const displayStats = stats || demoStats;
  const displayPatients = recentPatients.length > 0 ? recentPatients : demoRecentPatients;
  const displayPharmacies = recentPharmacies.length > 0 ? recentPharmacies : demoRecentPharmacies;

  if (loading) {
    return (
      <div className="space-y-6">
        <h2
          className="text-2xl font-bold"
          style={{
            color: "#DBF5F0",
            fontFamily: "Playfair Display, serif",
          }}
        >
          Dashboard Overview
        </h2>
        <div className="flex justify-center py-12">
          <div
            className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "#FDE047", borderTopColor: "transparent" }}
          />
        </div>
      </div>
    );
  }

  if (!displayStats) {
    return (
      <div className="space-y-6">
        <h2
          className="text-2xl font-bold"
          style={{
            color: "#DBF5F0",
            fontFamily: "Playfair Display, serif",
          }}
        >
          Dashboard Overview
        </h2>
        <div
          className="text-center py-12 rounded-xl"
          style={{
            backgroundColor: "#CAE7E1",
            border: "1px solid rgba(253, 224, 71, 0.2)",
            color: "#000000",
          }}
        >
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2
        className="text-2xl font-bold"
        style={{
          color: "#DBF5F0",
          fontFamily: "Playfair Display, serif",
        }}
      >
        Dashboard Overview
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          className="rounded-xl shadow-lg p-6 transition-all duration-300"
          style={{
            backgroundColor: "#256C5C",
            border: "1px solid rgba(253, 224, 71, 0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium mb-2"
                style={{ color: "#A7F3D0", fontFamily: "Inter, sans-serif" }}
              >
                Total Patients
              </p>
              <p
                className="text-3xl font-bold mb-2"
                style={{ color: "#DBF5F0" }}
              >
                {displayStats.totalPatients}
              </p>
              <div className="flex items-center gap-1">
                <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(34, 197, 94, 0.2)", color: "#22C55E" }}>
                  ↗ 12.5%
                </span>
                <span className="text-xs" style={{ color: "#A7F3D0", opacity: 0.7 }}>
                  vs last month
                </span>
              </div>
            </div>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ 
                background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
              }}
            >
              <Users className="w-6 h-6" style={{ color: "#FFFFFF" }} />
            </div>
          </div>
        </div>

        <div
          className="rounded-xl shadow-lg p-6 transition-all duration-300"
          style={{
            backgroundColor: "#256C5C",
            border: "1px solid rgba(253, 224, 71, 0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium mb-2"
                style={{ color: "#A7F3D0", fontFamily: "Inter, sans-serif" }}
              >
                Total Pharmacies
              </p>
              <p
                className="text-3xl font-bold mb-2"
                style={{ color: "#DBF5F0" }}
              >
                {displayStats.totalPharmacies}
              </p>
              <div className="flex items-center gap-1">
                <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(34, 197, 94, 0.2)", color: "#22C55E" }}>
                  ↗ 8.2%
                </span>
                <span className="text-xs" style={{ color: "#A7F3D0", opacity: 0.7 }}>
                  new registrations
                </span>
              </div>
            </div>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ 
                background: "linear-gradient(135deg, #10B981 0%, #047857 100%)",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
              }}
            >
              <Building className="w-6 h-6" style={{ color: "#FFFFFF" }} />
            </div>
          </div>
        </div>

        <div
          className="rounded-xl shadow-lg p-6 transition-all duration-300"
          style={{
            backgroundColor: "#256C5C",
            border: "1px solid rgba(253, 224, 71, 0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium mb-2"
                style={{ color: "#A7F3D0", fontFamily: "Inter, sans-serif" }}
              >
                Pending Approvals
              </p>
              <p
                className="text-3xl font-bold mb-2"
                style={{ color: "#DBF5F0" }}
              >
                {displayStats.pendingApprovals}
              </p>
              <div className="flex items-center gap-1">
                <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(251, 191, 36, 0.2)", color: "#F59E0B" }}>
                  ⚠ Urgent
                </span>
                <span className="text-xs" style={{ color: "#A7F3D0", opacity: 0.7 }}>
                  requires action
                </span>
              </div>
            </div>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ 
                background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)"
              }}
            >
              <Clock className="w-6 h-6" style={{ color: "#FFFFFF" }} />
            </div>
          </div>
        </div>

        <div
          className="rounded-xl shadow-lg p-6 transition-all duration-300"
          style={{
            backgroundColor: "#256C5C",
            border: "1px solid rgba(253, 224, 71, 0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium mb-2"
                style={{ color: "#A7F3D0", fontFamily: "Inter, sans-serif" }}
              >
                Active Users
              </p>
              <p
                className="text-3xl font-bold mb-2"
                style={{ color: "#DBF5F0" }}
              >
                {displayStats.activeUsers}
              </p>
              <div className="flex items-center gap-1">
                <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(34, 197, 94, 0.2)", color: "#22C55E" }}>
                  ✓ Online
                </span>
                <span className="text-xs" style={{ color: "#A7F3D0", opacity: 0.7 }}>
                  last 24h
                </span>
              </div>
            </div>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ 
                background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)"
              }}
            >
              <Activity className="w-6 h-6" style={{ color: "#FFFFFF" }} />
            </div>
          </div>
        </div>

        <div
          className="rounded-xl shadow-lg p-6 transition-all duration-300"
          style={{
            backgroundColor: "#256C5C",
            border: "1px solid rgba(253, 224, 71, 0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium mb-2"
                style={{ color: "#A7F3D0", fontFamily: "Inter, sans-serif" }}
              >
                Verified Emails
              </p>
              <p
                className="text-3xl font-bold mb-2"
                style={{ color: "#DBF5F0" }}
              >
                {displayStats.verifiedEmails}
              </p>
              <div className="flex items-center gap-1">
                <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(34, 197, 94, 0.2)", color: "#22C55E" }}>
                  ✉ 96.8%
                </span>
                <span className="text-xs" style={{ color: "#A7F3D0", opacity: 0.7 }}>
                  verification rate
                </span>
              </div>
            </div>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ 
                background: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
                boxShadow: "0 4px 12px rgba(6, 182, 212, 0.3)"
              }}
            >
              <Mail className="w-6 h-6" style={{ color: "#FFFFFF" }} />
            </div>
          </div>
        </div>

        <div
          className="rounded-xl shadow-lg p-6 transition-all duration-300"
          style={{
            backgroundColor: "#256C5C",
            border: "1px solid rgba(253, 224, 71, 0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium mb-2"
                style={{ color: "#A7F3D0", fontFamily: "Inter, sans-serif" }}
              >
                Recent Registrations
              </p>
              <p
                className="text-3xl font-bold mb-2"
                style={{ color: "#DBF5F0" }}
              >
                {displayStats.recentRegistrations}
              </p>
              <div className="flex items-center gap-1">
                <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(34, 197, 94, 0.2)", color: "#22C55E" }}>
                  ↗ +15%
                </span>
                <span className="text-xs" style={{ color: "#A7F3D0", opacity: 0.7 }}>
                  last 7 days
                </span>
              </div>
            </div>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ 
                background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)"
              }}
            >
              <TrendingUp className="w-6 h-6" style={{ color: "#FFFFFF" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <div
          className="rounded-xl shadow-lg p-6"
          style={{
            backgroundColor: "#256C5C",
            border: "1px solid rgba(253, 224, 71, 0.3)",
            backdropFilter: "blur(10px)",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-lg font-semibold flex items-center gap-2"
              style={{
                color: "#DBF5F0",
                fontFamily: "Playfair Display, serif",
              }}
            >
              <Users className="w-5 h-5" style={{ color: "#000000" }} />
              Recent Patients
            </h3>
            <button
              className="text-sm font-medium hover:underline flex items-center gap-1"
              style={{ color: "#A7F3D0" }}
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {loadingRecent ? (
            <div className="flex justify-center py-8">
              <div
                className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                style={{
                  borderColor: "#FDE047",
                  borderTopColor: "transparent",
                }}
              />
            </div>
          ) : displayPatients.length > 0 ? (
            <div className="space-y-3">
              {displayPatients.map((patient) => (
                <div
                  key={patient._id}
                  className="p-3 rounded-lg cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: "#CAE7E1",
                    border: "1px solid rgba(253, 224, 71, 0.2)",
                  }}
                  onClick={() => onViewPatientDetails?.(patient)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
                          color: "#115E59",
                        }}
                      >
                        <span className="text-sm font-bold">
                          {patient.firstName?.[0]?.toUpperCase() || "P"}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="font-medium text-sm truncate"
                          style={{ color: "#000000" }}
                        >
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p 
                          className="text-xs truncate" 
                          style={{ color: "#000000", opacity: 0.7 }}
                        >
                          {patient.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full`}
                        style={{
                          background: patient.isActive
                            ? "rgba(34, 197, 94, 0.2)"
                            : "rgba(239, 68, 68, 0.2)",
                          color: "#000000",
                          border: patient.isActive
                            ? "1px solid rgba(34, 197, 94, 0.3)"
                            : "1px solid rgba(239, 68, 68, 0.3)",
                        }}
                      >
                        {patient.isActive ? "Active" : "Inactive"}
                      </span>
                      <p
                        className="text-xs"
                        style={{ color: "#000000", opacity: 0.6 }}
                      >
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p
              className="text-center py-8 text-sm"
              style={{ color: "#A7F3D0", opacity: 0.8 }}
            >
              No recent patients found
            </p>
          )}
        </div>

        {/* Recent Pharmacies */}
        <div
          className="rounded-xl shadow-lg p-6"
          style={{
            backgroundColor: "#256C5C",
            border: "1px solid rgba(253, 224, 71, 0.3)",
            backdropFilter: "blur(10px)",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-lg font-semibold flex items-center gap-2"
              style={{
                color: "#DBF5F0",
                fontFamily: "Playfair Display, serif",
              }}
            >
              <Building className="w-5 h-5" style={{ color: "#000000" }} />
              Recent Pharmacies
            </h3>
            <button
              className="text-sm font-medium hover:underline flex items-center gap-1"
              style={{ color: "#A7F3D0" }}
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {loadingRecent ? (
            <div className="flex justify-center py-8">
              <div
                className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                style={{
                  borderColor: "#FDE047",
                  borderTopColor: "transparent",
                }}
              />
            </div>
          ) : displayPharmacies.length > 0 ? (
            <div className="space-y-3">
              {displayPharmacies.map((pharmacy) => (
                <div
                  key={pharmacy._id}
                  className="p-3 rounded-lg cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: "#CAE7E1",
                    border: "1px solid rgba(253, 224, 71, 0.2)",
                  }}
                  onClick={() => onSelectPharmacy?.(pharmacy)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                          color: "#FFFFFF",
                        }}
                      >
                        <Building className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="font-medium text-sm truncate"
                          style={{ color: "#000000" }}
                        >
                          {pharmacy.pharmacyName}
                        </p>
                        <p
                          className="text-xs flex items-center gap-1 truncate"
                          style={{ color: "#000000", opacity: 0.7 }}
                        >
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span>{pharmacy.address?.city || "Location not provided"}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full`}
                        style={{
                          background: pharmacy.isActive
                            ? "rgba(34, 197, 94, 0.2)"
                            : "rgba(239, 68, 68, 0.2)",
                          color: pharmacy.isActive ? "#16A34A" : "#DC2626",
                          border: pharmacy.isActive
                            ? "1px solid rgba(34, 197, 94, 0.3)"
                            : "1px solid rgba(239, 68, 68, 0.3)",
                        }}
                      >
                        {pharmacy.isActive ? "Active" : "Inactive"}
                      </span>
                      <p
                        className="text-xs"
                        style={{ color: "#000000", opacity: 0.6 }}
                      >
                        {new Date(pharmacy.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p
              className="text-center py-8 text-sm"
              style={{ color: "#A7F3D0", opacity: 0.8 }}
            >
              No recent pharmacies found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;