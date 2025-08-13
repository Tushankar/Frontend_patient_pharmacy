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
    { value: "system_alert", label: "System Alert", icon: AlertTriangle },
    { value: "appointment", label: "Appointment", icon: Calendar },
    { value: "order_status", label: "Order Status", icon: CheckCircle },
    { value: "pharmacy_nearby", label: "Pharmacy Nearby", icon: MapPin },
    { value: "emergency", label: "Emergency", icon: AlertTriangle },
    { value: "general", label: "General", icon: Info },
  ];

  const priorityLevels = [
    { value: "low", label: "Low", color: "#9CA3AF" },
    { value: "medium", label: "Medium", color: "#3B82F6" },
    { value: "high", label: "High", color: "#F59E0B" },
    { value: "urgent", label: "Urgent", color: "#EF4444" },
    { value: "critical", label: "Critical", color: "#DC2626" },
  ];

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "targeting", label: "Targeting" },
    { id: "scheduling", label: "Scheduling" },
    { id: "content", label: "Content" },
  ];

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const keys = field.split(".");
      const newData = { ...prev };
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
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

      // Prepare notification data
      const notificationData = {
        ...formData,
        // Ensure proper data types
        targeting: {
          ...formData.targeting,
          ageRange: {
            min: parseInt(formData.targeting.ageRange.min) || undefined,
            max: parseInt(formData.targeting.ageRange.max) || undefined,
          },
        },
        spatial: {
          ...formData.spatial,
          radius: parseInt(formData.spatial.radius) || 5000,
        },
        scheduling: {
          ...formData.scheduling,
          recurring: {
            ...formData.scheduling.recurring,
            interval: parseInt(formData.scheduling.recurring.interval) || 1,
          },
        },
      };

      await createNotification(notificationData);
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create notification");
    } finally {
      setLoading(false);
    }
  };

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
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                style={{
                  background:
                    currentTab === tab.id
                      ? "linear-gradient(135deg, rgba(253, 224, 71, 0.2) 0%, rgba(251, 191, 36, 0.2) 100%)"
                      : "rgba(15, 23, 42, 0.4)",
                  color: currentTab === tab.id ? "#FDE047" : "#A7F3D0",
                  border:
                    currentTab === tab.id
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
                <p className="text-sm" style={{ color: "#FCA5A5" }}>
                  {error}
                </p>
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
                            background:
                              formData.type === type.value
                                ? "linear-gradient(135deg, rgba(253, 224, 71, 0.2) 0%, rgba(251, 191, 36, 0.2) 100%)"
                                : "rgba(15, 23, 42, 0.4)",
                            border:
                              formData.type === type.value
                                ? "1px solid rgba(253, 224, 71, 0.4)"
                                : "1px solid rgba(253, 224, 71, 0.2)",
                            color:
                              formData.type === type.value
                                ? "#FDE047"
                                : "#A7F3D0",
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
                  <div className="flex gap-3 flex-wrap">
                    {priorityLevels.map((priority) => (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() =>
                          handleInputChange("priority", priority.value)
                        }
                        className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                        style={{
                          background:
                            formData.priority === priority.value
                              ? `${priority.color}20`
                              : "rgba(15, 23, 42, 0.4)",
                          color:
                            formData.priority === priority.value
                              ? priority.color
                              : "#A7F3D0",
                          border:
                            formData.priority === priority.value
                              ? `1px solid ${priority.color}40`
                              : "1px solid rgba(253, 224, 71, 0.2)",
                        }}
                      >
                        {priority.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{
                      color: "#DBF5F0",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      background: "rgba(15, 23, 42, 0.4)",
                      border: "1px solid rgba(253, 224, 71, 0.3)",
                      color: "#DBF5F0",
                      focusRingColor: "#FDE047",
                    }}
                    placeholder="Enter notification title"
                    maxLength={200}
                    required
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{
                      color: "#DBF5F0",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      background: "rgba(15, 23, 42, 0.4)",
                      border: "1px solid rgba(253, 224, 71, 0.3)",
                      color: "#DBF5F0",
                      focusRingColor: "#FDE047",
                    }}
                    placeholder="Enter notification message"
                    rows={4}
                    maxLength={1000}
                    required
                  />
                </div>
              </div>
            )}

            {/* Quick basic targeting for other tabs - simplified for demo */}
            {currentTab === "targeting" && (
              <div className="space-y-6">
                <div>
                  <label
                    className="block text-sm font-medium mb-3"
                    style={{
                      color: "#DBF5F0",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Target Roles
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {["patient", "pharmacy", "admin"].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleToggle(role)}
                        className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                        style={{
                          background: formData.targeting.roles.includes(role)
                            ? "linear-gradient(135deg, rgba(253, 224, 71, 0.2) 0%, rgba(251, 191, 36, 0.2) 100%)"
                            : "rgba(15, 23, 42, 0.4)",
                          border: formData.targeting.roles.includes(role)
                            ? "1px solid rgba(253, 224, 71, 0.4)"
                            : "1px solid rgba(253, 224, 71, 0.2)",
                          color: formData.targeting.roles.includes(role)
                            ? "#FDE047"
                            : "#A7F3D0",
                        }}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentTab === "scheduling" && (
              <div className="space-y-6">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{
                      color: "#DBF5F0",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Schedule For (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduling.scheduledFor}
                    onChange={(e) =>
                      handleInputChange(
                        "scheduling.scheduledFor",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      background: "rgba(15, 23, 42, 0.4)",
                      border: "1px solid rgba(253, 224, 71, 0.3)",
                      color: "#DBF5F0",
                      focusRingColor: "#FDE047",
                    }}
                  />
                </div>
              </div>
            )}

            {currentTab === "content" && (
              <div className="space-y-6">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{
                      color: "#DBF5F0",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.content.imageUrl}
                    onChange={(e) =>
                      handleInputChange("content.imageUrl", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      background: "rgba(15, 23, 42, 0.4)",
                      border: "1px solid rgba(253, 224, 71, 0.3)",
                      color: "#DBF5F0",
                      focusRingColor: "#FDE047",
                    }}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="px-6 py-4 flex justify-end gap-3"
            style={{
              borderTop: "1px solid rgba(253, 224, 71, 0.3)",
              background: "rgba(15, 23, 42, 0.6)",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200"
              style={{
                background: "rgba(15, 23, 42, 0.6)",
                color: "#A7F3D0",
                border: "1px solid rgba(253, 224, 71, 0.3)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
              style={{
                background: loading
                  ? "rgba(253, 224, 71, 0.5)"
                  : "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
                color: "#115E59",
                border: "1px solid rgba(253, 224, 71, 0.4)",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Create Notification
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationCreator;
