import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Bell,
  X,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Info,
  Star,
  Navigation,
  Filter,
  Settings,
  Eye,
  Trash2,
  ExternalLink,
  ChevronDown,
  Zap,
  Shield,
  Heart,
  Package,
} from "lucide-react";
import { useAdvancedNotifications } from "../../hooks/useAdvancedNotifications";

const AdvancedNotificationCenter = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [showLocationToggle, setShowLocationToggle] = useState(false);
  const dropdownRef = useRef(null);

  // Memoize notification options to prevent re-renders
  const notificationOptions = useMemo(
    () => ({
      unreadOnly: false,
      enableLocation: true,
      autoRefresh: true,
      refreshInterval: 60000, // 1 minute
    }),
    []
  );

  const {
    notifications,
    loading,
    error,
    counts,
    unreadCount,
    urgentCount,
    locationStatus,
    markAsRead,
    handleNotificationClick,
    dismissNotification,
    updateLocation,
    getNotificationsByType,
    getNotificationsByPriority,
    getUnreadNotifications,
    getUrgentNotifications,
    clearError,
  } = useAdvancedNotifications(notificationOptions);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get icon for notification type
  const getNotificationIcon = (type, priority) => {
    const iconProps = {
      size: 16,
      className: `${
        priority === "urgent" || priority === "critical"
          ? "text-red-500"
          : priority === "high"
          ? "text-orange-500"
          : priority === "medium"
          ? "text-blue-500"
          : "text-gray-500"
      }`,
    };

    switch (type) {
      case "order_status":
        return <Package {...iconProps} />;
      case "pharmacy_nearby":
        return <MapPin {...iconProps} />;
      case "emergency":
        return <AlertTriangle {...iconProps} className="text-red-600" />;
      case "security_alert":
        return <Shield {...iconProps} className="text-red-500" />;
      case "approval":
        return <CheckCircle {...iconProps} />;
      case "chat":
        return <Heart {...iconProps} />;
      case "system_alert":
        return <Zap {...iconProps} />;
      default:
        return <Info {...iconProps} />;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    const badgeStyles = {
      critical: "bg-red-100 text-red-800 border-red-200",
      urgent: "bg-orange-100 text-orange-800 border-orange-200",
      high: "bg-yellow-100 text-yellow-800 border-yellow-200",
      medium: "bg-blue-100 text-blue-800 border-blue-200",
      low: "bg-gray-100 text-gray-600 border-gray-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
          badgeStyles[priority] || badgeStyles.medium
        }`}
      >
        {priority.toUpperCase()}
      </span>
    );
  };

  // Filter notifications based on active filters
  const getFilteredNotifications = () => {
    let filtered = notifications;

    if (activeFilter !== "all") {
      if (activeFilter === "unread") {
        filtered = getUnreadNotifications();
      } else if (activeFilter === "urgent") {
        filtered = getUrgentNotifications();
      } else {
        filtered = getNotificationsByType(activeFilter);
      }
    }

    if (selectedPriority !== "all") {
      filtered = filtered.filter((n) => n.priority === selectedPriority);
    }

    return filtered.sort((a, b) => {
      // Sort by priority first, then by date
      const priorityOrder = {
        critical: 5,
        urgent: 4,
        high: 3,
        medium: 2,
        low: 1,
      };
      const priorityDiff =
        (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      if (priorityDiff !== 0) return priorityDiff;

      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  // Format time ago
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Notifications"
      >
        <Bell size={20} />

        {/* Notification badges */}
        {(unreadCount > 0 || urgentCount > 0) && (
          <div className="absolute -top-1 -right-1 flex flex-col gap-1">
            {urgentCount > 0 && (
              <span className="flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                {urgentCount > 9 ? "9+" : urgentCount}
              </span>
            )}
            {unreadCount > 0 && urgentCount === 0 && (
              <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Location toggle */}
                {locationStatus.supportedByBrowser && (
                  <button
                    onClick={() => setShowLocationToggle(!showLocationToggle)}
                    className={`p-1 rounded-md transition-colors ${
                      locationStatus.enabled
                        ? "text-green-600 hover:bg-green-50"
                        : "text-gray-400 hover:bg-gray-100"
                    }`}
                    title={
                      locationStatus.enabled
                        ? "Location enabled"
                        : "Enable location for nearby notifications"
                    }
                  >
                    <Navigation size={16} />
                  </button>
                )}

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Location status */}
            {showLocationToggle && (
              <div className="mt-2 p-2 bg-white rounded-md border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Location Services:{" "}
                    {locationStatus.enabled ? "Enabled" : "Disabled"}
                  </span>
                  {!locationStatus.enabled && (
                    <button
                      onClick={updateLocation}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Enable
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Filter buttons */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex gap-1">
                {[
                  "all",
                  "unread",
                  "urgent",
                  "order_status",
                  "pharmacy_nearby",
                ].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                      activeFilter === filter
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {filter === "all"
                      ? "All"
                      : filter === "unread"
                      ? "Unread"
                      : filter === "urgent"
                      ? "Urgent"
                      : filter === "order_status"
                      ? "Orders"
                      : filter === "pharmacy_nearby"
                      ? "Nearby"
                      : filter}
                  </button>
                ))}
              </div>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="text-xs border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="critical">Critical</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="px-4 py-2 bg-red-50 border-b border-red-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-600">{error}</span>
                <button
                  onClick={clearError}
                  className="text-red-400 hover:text-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Notifications list */}
          <div className="max-h-64 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            )}

            {!loading && filteredNotifications.length === 0 && (
              <div className="px-4 py-8 text-center">
                <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-500">
                  {activeFilter === "all"
                    ? "No notifications"
                    : `No ${activeFilter} notifications`}
                </p>
              </div>
            )}

            {!loading &&
              filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                    notification.userStatus?.deliveryStatus !== "read"
                      ? "bg-blue-50"
                      : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(
                        notification.type,
                        notification.priority
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                        </div>

                        {/* Priority badge */}
                        <div className="flex-shrink-0">
                          {getPriorityBadge(notification.priority)}
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatTimeAgo(notification.createdAt)}
                          </span>

                          {notification.spatial?.enabled && (
                            <span className="flex items-center gap-1">
                              <MapPin size={12} />
                              Nearby
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          {notification.userStatus?.deliveryStatus !==
                            "read" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification._id);
                              }}
                              className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                              title="Mark as read"
                            >
                              <Eye size={12} />
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissNotification(notification._id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                            title="Dismiss"
                          >
                            <Trash2 size={12} />
                          </button>

                          {notification.content?.actionButton?.url && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(
                                  notification.content.actionButton.url,
                                  "_blank"
                                );
                              }}
                              className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                              title="Open link"
                            >
                              <ExternalLink size={12} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Action button */}
                      {notification.content?.actionButton && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationClick(notification);
                          }}
                          className="mt-2 w-full px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                        >
                          {notification.content.actionButton.text}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Footer */}
          {filteredNotifications.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{filteredNotifications.length} notifications</span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={() => {
                        getUnreadNotifications().forEach((n) =>
                          markAsRead(n._id)
                        );
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedNotificationCenter;
