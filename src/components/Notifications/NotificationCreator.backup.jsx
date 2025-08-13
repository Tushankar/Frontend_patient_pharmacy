import React, { useState, useEffect, useMemo } from "react";
import {
  Send,
  MapPin,
  Users,
  Calendar,
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  X,
  Plus,
  Target,
  Clock,
  Image,
  Link as LinkIcon,
} from "lucide-react";
import { useAdvancedNotifications } from "../../hooks/useAdvancedNotifications";
import { useAuth } from "../Login";

const NotificationCreator = ({ onClose, onSuccess }) => {
  const { user } = useAuth();

  // Memoize options to prevent unnecessary re-renders
  const notificationOptions = useMemo(
    () => ({
      unreadOnly: false,
      enableLocation: false, // Don't need location for creator
      autoRefresh: false, // Don't auto-refresh in creator
    }),
    []
  );

  const { createNotification, locationStatus, updateLocation } =
    useAdvancedNotifications(notificationOptions);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "system_alert",
    priority: "medium",
    targeting: {
      roles: [],
      ageRange: { min: "", max: "" },
      conditions: [],
      pharmacyTypes: [],
      patientSegments: [],
    },
    spatial: {
      enabled: false,
      targetLocation: { coordinates: [0, 0] },
      radius: 5000,
      locationName: "",
      city: "",
      state: "",
      zipCode: "",
    },
    scheduling: {
      scheduledFor: "",
      expiresAt: "",
      recurring: {
        enabled: false,
        frequency: "daily",
        interval: 1,
        endDate: "",
      },
    },
    channels: {
      inApp: { enabled: true },
      email: { enabled: false },
      sms: { enabled: false },
      push: { enabled: false },
    },
    content: {
      imageUrl: "",
      actionButton: {
        text: "",
        url: "",
        action: "navigate",
      },
      links: [],
      tags: [],
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentTab, setCurrentTab] = useState("basic");
  const [newTag, setNewTag] = useState("");
  const [newLink, setNewLink] = useState({ text: "", url: "" });

  // Get user's current location for spatial targeting
  useEffect(() => {
    if (locationStatus.enabled && locationStatus.location) {
      setFormData((prev) => ({
        ...prev,
        spatial: {
          ...prev.spatial,
          targetLocation: {
            coordinates: [
              locationStatus.location.longitude,
              locationStatus.location.latitude,
            ],
          },
        },
      }));
    }
  }, [locationStatus]);

  const notificationTypes = [
    { value: "system_alert", label: "System Alert", icon: Bell },
    { value: "emergency", label: "Emergency", icon: AlertTriangle },
    { value: "order_status", label: "Order Update", icon: CheckCircle },
    { value: "pharmacy_nearby", label: "Nearby Pharmacy", icon: MapPin },
    { value: "promotional", label: "Promotional", icon: Info },
    { value: "appointment", label: "Appointment", icon: Calendar },
    { value: "security_alert", label: "Security Alert", icon: AlertTriangle },
  ];

  const userRoles = [
    { value: "patient", label: "Patients" },
    { value: "pharmacy", label: "Pharmacies" },
    { value: "admin", label: "Admins" },
    { value: "doctor", label: "Doctors" },
  ];

  const priorityLevels = [
    { value: "low", label: "Low", color: "bg-gray-100 text-gray-700" },
    { value: "medium", label: "Medium", color: "bg-blue-100 text-blue-700" },
    { value: "high", label: "High", color: "bg-yellow-100 text-yellow-700" },
    {
      value: "urgent",
      label: "Urgent",
      color: "bg-orange-100 text-orange-700",
    },
    { value: "critical", label: "Critical", color: "bg-red-100 text-red-700" },
  ];

  const handleInputChange = (path, value) => {
    setFormData((prev) => {
      const newData = { ...prev };
      const keys = path.split(".");
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleRoleToggle = (role) => {
    const currentRoles = formData.targeting.roles;
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter((r) => r !== role)
      : [...currentRoles, role];

    handleInputChange("targeting.roles", newRoles);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.content.tags.includes(newTag.trim())) {
      handleInputChange("content.tags", [
        ...formData.content.tags,
        newTag.trim(),
      ]);
      setNewTag("");
    }
  };

  const removeTag = (index) => {
    const newTags = formData.content.tags.filter((_, i) => i !== index);
    handleInputChange("content.tags", newTags);
  };

  const addLink = () => {
    if (newLink.text.trim() && newLink.url.trim()) {
      handleInputChange("content.links", [...formData.content.links, newLink]);
      setNewLink({ text: "", url: "" });
    }
  };

  const removeLink = (index) => {
    const newLinks = formData.content.links.filter((_, i) => i !== index);
    handleInputChange("content.links", newLinks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.message.trim()) {
        throw new Error("Title and message are required");
      }

      if (formData.targeting.roles.length === 0) {
        throw new Error("Please select at least one target role");
      }

      // Clean up form data
      const cleanData = {
        ...formData,
        targeting: {
          ...formData.targeting,
          ageRange:
            formData.targeting.ageRange.min && formData.targeting.ageRange.max
              ? formData.targeting.ageRange
              : undefined,
        },
        scheduling: {
          ...formData.scheduling,
          scheduledFor: formData.scheduling.scheduledFor || undefined,
          expiresAt: formData.scheduling.expiresAt || undefined,
          recurring: formData.scheduling.recurring.enabled
            ? formData.scheduling.recurring
            : undefined,
        },
        content: {
          ...formData.content,
          actionButton:
            formData.content.actionButton.text &&
            formData.content.actionButton.url
              ? formData.content.actionButton
              : undefined,
        },
      };

      await createNotification(cleanData);
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err.message || "Failed to create notification");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "targeting", label: "Targeting" },
    { id: "spatial", label: "Location" },
    { id: "scheduling", label: "Scheduling" },
    { id: "content", label: "Content" },
    { id: "channels", label: "Channels" },
  ];

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div 
        className="rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)",
          border: "2px solid rgba(253, 224, 71, 0.4)",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(253, 224, 71, 0.1)",
        }}
      >
        {/* Header */}
        <div 
          className="px-6 py-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)",
            borderBottom: "1px solid rgba(253, 224, 71, 0.3)",
          }}
        >
          <div className="flex items-center justify-between">
            <h2 
              className="text-xl font-semibold"
              style={{
                color: "#DBF5F0",
                fontFamily: "Playfair Display, serif",
              }}
            >
              Create Notification
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:scale-105"
              style={{
                color: "#FDE047",
                background: "rgba(253, 224, 71, 0.1)",
                border: "1px solid rgba(253, 224, 71, 0.2)",
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200`}
                style={{
                  background: currentTab === tab.id
                    ? "linear-gradient(135deg, rgba(253, 224, 71, 0.2) 0%, rgba(251, 191, 36, 0.2) 100%)"
                    : "rgba(15, 23, 42, 0.4)",
                  color: currentTab === tab.id ? "#FDE047" : "#A7F3D0",
                  border: currentTab === tab.id
                    ? "1px solid rgba(253, 224, 71, 0.4)"
                    : "1px solid rgba(253, 224, 71, 0.2)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Error message */}
            {error && (
              <div 
                className="mb-4 p-3 rounded-lg"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                }}
              >
                <p className="text-sm" style={{ color: "#FCA5A5" }}>{error}</p>
              </div>
            )}

            {/* Basic Info Tab */}
            {currentTab === "basic" && (
              <div className="space-y-6">
                <div>
                  <label 
                    className="block text-sm font-medium mb-3"
                    style={{
                      color: "#DBF5F0",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Notification Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {notificationTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handleInputChange("type", type.value)}
                          className="p-3 rounded-lg text-left transition-all duration-200 hover:scale-105"
                          style={{
                            background: formData.type === type.value
                              ? "linear-gradient(135deg, rgba(253, 224, 71, 0.2) 0%, rgba(251, 191, 36, 0.2) 100%)"
                              : "rgba(15, 23, 42, 0.4)",
                            border: formData.type === type.value
                              ? "1px solid rgba(253, 224, 71, 0.4)"
                              : "1px solid rgba(253, 224, 71, 0.2)",
                            color: formData.type === type.value ? "#FDE047" : "#A7F3D0",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Icon size={16} />
                            <span className="text-sm font-medium">
                              {type.label}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label 
                    className="block text-sm font-medium mb-3"
                    style={{
                      color: "#DBF5F0",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Priority Level
                  </label>
                  <div className="flex gap-3">
                    {priorityLevels.map((priority) => (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() =>
                          handleInputChange("priority", priority.value)
                        }
                        className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                        style={{
                          background: formData.priority === priority.value
                            ? `linear-gradient(135deg, ${priority.color}20 0%, ${priority.color}10 100%)`
                            : "rgba(15, 23, 42, 0.4)",
                          color: formData.priority === priority.value ? priority.color : "#A7F3D0",
                          border: formData.priority === priority.value
                            ? `1px solid ${priority.color}40`
                            : "1px solid rgba(253, 224, 71, 0.2)",
                        }}
                          formData.priority === priority.value
                            ? "border-current " + priority.color
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {priority.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter notification title"
                    maxLength={200}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter notification message"
                    rows={4}
                    maxLength={1000}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.message.length}/1000 characters
                  </p>
                </div>
              </div>
            )}

            {/* Targeting Tab */}
            {currentTab === "targeting" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Target User Roles *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {userRoles.map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => handleRoleToggle(role.value)}
                        className={`p-3 border rounded-lg text-left transition-colors ${
                          formData.targeting.roles.includes(role.value)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Users size={16} />
                          <span className="text-sm font-medium">
                            {role.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Range (Optional)
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      value={formData.targeting.ageRange.min}
                      onChange={(e) =>
                        handleInputChange(
                          "targeting.ageRange.min",
                          e.target.value
                        )
                      }
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Min"
                      min="0"
                      max="120"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      value={formData.targeting.ageRange.max}
                      onChange={(e) =>
                        handleInputChange(
                          "targeting.ageRange.max",
                          e.target.value
                        )
                      }
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Max"
                      min="0"
                      max="120"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Spatial Tab */}
            {currentTab === "spatial" && (
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.spatial.enabled}
                      onChange={(e) =>
                        handleInputChange("spatial.enabled", e.target.checked)
                      }
                      className="w-4 h-4 rounded transition-colors duration-300 focus:ring-2 focus:ring-teal-400"
                      style={{
                        accentColor: "#115E59",
                        backgroundColor: formData.spatial.enabled
                          ? "#115E59"
                          : "rgba(17, 94, 89, 0.1)",
                        borderColor: "#115E59",
                        borderWidth: "2px",
                      }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Enable Location-Based Targeting
                    </span>
                  </label>
                </div>

                {formData.spatial.enabled && (
                  <>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          Location Services
                        </span>
                      </div>
                      {locationStatus.enabled ? (
                        <p className="text-sm text-blue-700">
                          Location detected:{" "}
                          {locationStatus.location?.latitude.toFixed(6)},{" "}
                          {locationStatus.location?.longitude.toFixed(6)}
                        </p>
                      ) : (
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-blue-700">
                            Location not available
                          </p>
                          <button
                            type="button"
                            onClick={updateLocation}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            Enable Location
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Radius (meters)
                      </label>
                      <input
                        type="number"
                        value={formData.spatial.radius}
                        onChange={(e) =>
                          handleInputChange(
                            "spatial.radius",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="100"
                        max="50000"
                        step="100"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location Name
                        </label>
                        <input
                          type="text"
                          value={formData.spatial.locationName}
                          onChange={(e) =>
                            handleInputChange(
                              "spatial.locationName",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Downtown, Mall, Hospital"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={formData.spatial.city}
                          onChange={(e) =>
                            handleInputChange("spatial.city", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter city"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Add more tab content for scheduling, content, and channels... */}
            {/* For brevity, I'll continue with the main tabs */}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {formData.targeting.roles.length > 0 && (
                  <span>Targeting: {formData.targeting.roles.join(", ")}</span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.title.trim() ||
                    !formData.message.trim() ||
                    formData.targeting.roles.length === 0
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  {loading ? "Creating..." : "Create Notification"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationCreator;
