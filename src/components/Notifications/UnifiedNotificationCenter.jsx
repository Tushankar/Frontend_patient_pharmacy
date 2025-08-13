import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Bell,
  X,
  Check,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  Package,
  MapPin,
  MessageCircle,
  Shield,
  Star,
  Eye,
  Settings,
  Filter,
  ChevronDown,
  ExternalLink,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { useAdvancedNotifications } from "../../hooks/useAdvancedNotifications";

const UnifiedNotificationCenter = ({
  userRole = "patient",
  className = "",
  adminNotifications = [],
  analyticsData = null,
  onMarkAsRead = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState(userRole === "admin" ? "admin" : "standard"); // standard or admin
  const dropdownRef = useRef(null);

  // Add custom CSS for hiding scrollbar
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .notification-scroll::-webkit-scrollbar {
        display: none;
      }
      .notification-scroll {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Initialize notification options based on user role
  const notificationOptions = {
    unreadOnly: false,
    enableLocation: true,
    autoRefresh: true,
    refreshInterval: userRole === "admin" ? 30000 : 60000, // Admins get more frequent updates
    adminMode: userRole === "admin",
  };

  const {
    notifications,
    loading,
    error,
    unreadCount,
    urgentCount,
    markAsRead,
    handleNotificationClick,
    dismissNotification,
    getAllNotifications,
    getNotificationAnalytics,
    clearError,
    refresh,
  } = useAdvancedNotifications(notificationOptions);

  // Admin-specific state
  const [analytics, setAnalytics] = useState(analyticsData);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update analytics when prop changes
  useEffect(() => {
    setAnalytics(analyticsData);
  }, [analyticsData]);



  // Get notification icon based on type
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

    const iconMap = {
      order_status: <Package {...iconProps} />,
      new_order: <Package {...iconProps} />,
      approval: <CheckCircle {...iconProps} />,
      system_alert: <AlertTriangle {...iconProps} />,
      appointment: <Clock {...iconProps} />,
      pharmacy_nearby: <MapPin {...iconProps} />,
      chat: <MessageCircle {...iconProps} />,
      security_alert: <Shield {...iconProps} />,
      emergency: <AlertTriangle {...iconProps} className="text-red-600" />,
    };

    return iconMap[type] || <Info {...iconProps} />;
  };

  // Get priority badge color
  const getPriorityColor = (priority) => {
    const colors = {
      urgent: "#EF4444",
      critical: "#DC2626",
      high: "#F59E0B",
      medium: "#3B82F6",
      low: "#9CA3AF",
    };
    return colors[priority] || colors.medium;
  };

  // Format notification time
  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

  // Get filtered notifications
  const getFilteredNotifications = () => {
    const notificationList =
      viewMode === "admin" ? adminNotifications : notifications;
    
    console.log("UnifiedNotificationCenter - viewMode:", viewMode);
    console.log("UnifiedNotificationCenter - userRole:", userRole);
    console.log("UnifiedNotificationCenter - adminNotifications:", adminNotifications);
    console.log("UnifiedNotificationCenter - notificationList:", notificationList);

    // First filter out read notifications (don't show in bell icon)
    let filteredList = notificationList.filter(n => !n.read);
    
    // Then apply the active filter
    if (activeFilter === "all") return filteredList;
    if (activeFilter === "unread") {
      // For unread filter, we already filtered out read notifications above
      // But also check recipient status for regular users
      return filteredList.filter(
        (n) => n.userStatus?.deliveryStatus !== "read"
      );
    }
    return filteredList.filter((n) => n.type === activeFilter);
  };

  // Render notification item
  const renderNotificationItem = (notification) => {
    const isUnread = !notification.read;
    const isAdmin = viewMode === "admin";

    return (
      <div
        key={notification._id}
        className="p-3 transition-all duration-200 hover:scale-[1.02]"
        style={{
          background: isUnread
            ? "rgba(253, 224, 71, 0.1)"
            : "rgba(15, 23, 42, 0.4)",
          borderBottom: "1px solid rgba(253, 224, 71, 0.2)",
          borderLeft: isUnread ? "4px solid #FDE047" : "4px solid transparent",
        }}
      >
        <div
          className="flex items-start space-x-3 cursor-pointer"
          onClick={(e) => {
            // Only handle click if it's not on a button or interactive element
            if (!e.target.closest("button")) {
              handleNotificationClick(notification);
            }
          }}
        >
          <div className="flex-shrink-0 mt-1">
            {getNotificationIcon(notification.type, notification.priority)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h4
                className={`text-sm font-medium ${
                  isUnread ? "font-semibold" : ""
                }`}
                style={{ color: "#DBF5F0" }}
              >
                {notification.title}
              </h4>
              <div className="flex items-center space-x-2 ml-2">
                <span
                  className="px-2 py-1 text-xs rounded-full font-semibold"
                  style={{
                    background: `${getPriorityColor(notification.priority)}20`,
                    color: getPriorityColor(notification.priority),
                    border: `1px solid ${getPriorityColor(
                      notification.priority
                    )}40`,
                  }}
                >
                  {notification.priority}
                </span>
                <span
                  className="text-xs whitespace-nowrap"
                  style={{ color: "#A7F3D0", opacity: 0.8 }}
                >
                  {formatTime(notification.createdAt)}
                </span>
              </div>
            </div>

            <p
              className="text-sm mt-1 line-clamp-2"
              style={{ color: "#A7F3D0" }}
            >
              {notification.message}
            </p>

            {/* Reference data */}
            {notification.referenceData?.metadata && (
              <div
                className="mt-2 text-xs"
                style={{ color: "#A7F3D0", opacity: 0.7 }}
              >
                {notification.referenceData.metadata.orderNumber && (
                  <span className="mr-3">
                    Order: {notification.referenceData.metadata.orderNumber}
                  </span>
                )}
                {notification.referenceData.metadata.pharmacyName && (
                  <span>
                    Pharmacy: {notification.referenceData.metadata.pharmacyName}
                  </span>
                )}
              </div>
            )}

            {/* Admin view data */}
            {isAdmin && notification.adminView && (
              <div
                className="mt-2 flex items-center space-x-4 text-xs"
                style={{ color: "#A7F3D0", opacity: 0.8 }}
              >
                <span>
                  👥 {notification.adminView.totalRecipients} recipients
                </span>
                <span>✅ {notification.adminView.readCount} read</span>
                <span>📬 {notification.adminView.unreadCount} unread</span>
              </div>
            )}

            {/* Action buttons */}
            <div
              className="mt-2 flex items-center space-x-2"
              onClick={(e) => e.stopPropagation()}
            >
              {!isUnread ? (
                <span
                  className="flex items-center text-xs"
                  style={{ color: "#22C55E" }}
                >
                  <Check size={12} className="mr-1" />
                  Read
                </span>
              ) : (
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(
                      "Mark as read clicked for notification:",
                      notification._id
                    );
                    try {
                      if (userRole === "admin" && onMarkAsRead) {
                        await onMarkAsRead(notification._id);
                      } else {
                        await markAsRead(notification._id);
                      }
                    } catch (error) {
                      console.error("Error marking notification as read:", error);
                    }
                  }}
                  className="text-xs hover:underline transition-colors cursor-pointer bg-transparent border-none p-1 rounded hover:bg-blue-500/20 relative z-10"
                  style={{
                    color: "#60A5FA",
                    minHeight: "24px",
                    minWidth: "80px",
                  }}
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseUp={(e) => e.stopPropagation()}
                >
                  Mark as read
                </button>
              )}

              {notification.content?.actionButton && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(
                      "Action button clicked for notification:",
                      notification._id
                    );
                    handleNotificationClick(notification);
                  }}
                  className="flex items-center text-xs hover:underline transition-colors cursor-pointer bg-transparent border-none p-1 rounded hover:bg-blue-500/20 relative z-10"
                  style={{ color: "#60A5FA", minHeight: "24px" }}
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseUp={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={12} className="mr-1" />
                  {notification.content.actionButton.text}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filteredNotifications = getFilteredNotifications();
  
  // Calculate unread count for admin notifications - properly filter read notifications
  const adminUnreadCount = userRole === "admin" && adminNotifications.length > 0 
    ? adminNotifications.filter(n => {
        // A notification is unread if it's not marked as read
        return !n.read;
      }).length
    : 0;
  
  // Use admin unread count when in admin mode
  const displayUnreadCount = userRole === "admin" ? adminUnreadCount : unreadCount;

  return (
    <div className={`relative z-[99999] ${className}`} ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg transition-all duration-200 hover:scale-105"
        style={{
          color: "#FDE047",
          background: "rgba(253, 224, 71, 0.1)",
          border: "1px solid rgba(253, 224, 71, 0.2)",
        }}
      >
        <Bell size={24} />
        {displayUnreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-pulse"
            style={{
              background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
              boxShadow: "0 2px 4px rgba(239, 68, 68, 0.4)",
            }}
          >
            {displayUnreadCount > 99 ? "99+" : displayUnreadCount}
          </span>
        )}
        {urgentCount > 0 && (
          <span
            className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse font-bold"
            style={{
              background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
              boxShadow: "0 0 8px rgba(220, 38, 38, 0.6)",
            }}
          >
            !
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0"
              style={{ zIndex: 9999998 }}
              onClick={() => setIsOpen(false)}
            />
            <div
              className="fixed w-96 rounded-xl shadow-2xl border"
              style={{
                zIndex: 9999999,
                top: "70px",
                right: "16px",
                background:
                  "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)",
                border: "2px solid rgba(253, 224, 71, 0.4)",
                boxShadow:
                  "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(253, 224, 71, 0.1)",
              }}
            >
              {/* Header */}
              <div
                className="p-4"
                style={{
                  borderBottom: "1px solid rgba(253, 224, 71, 0.3)",
                }}
              >
                <div className="flex items-center justify-between">
                  <h3
                    className="text-lg font-semibold"
                    style={{
                      color: "#DBF5F0",
                      fontFamily: "Playfair Display, serif",
                    }}
                  >
                    Notifications
                    {userRole === "admin" && (
                      <span
                        className="ml-2 text-xs px-2 py-1 rounded"
                        style={{
                          background: "rgba(168, 85, 247, 0.2)",
                          color: "#C084FC",
                          border: "1px solid rgba(168, 85, 247, 0.3)",
                        }}
                      >
                        Admin
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {userRole === "admin" && (
                      <button
                        onClick={() =>
                          setViewMode(
                            viewMode === "admin" ? "standard" : "admin"
                          )
                        }
                        className="text-xs transition-colors hover:underline"
                        style={{ color: "#C084FC" }}
                      >
                        {viewMode === "admin" ? "Personal View" : "Admin View"}
                      </button>
                    )}
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="p-1 rounded transition-colors"
                      style={{ color: "#A7F3D0" }}
                    >
                      <Filter size={16} />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 rounded transition-colors"
                      style={{ color: "#FDE047" }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div
                  className="mt-2 flex items-center space-x-4 text-sm"
                  style={{ color: "#A7F3D0" }}
                >
                  <span>{displayUnreadCount} unread</span>
                  {urgentCount > 0 && (
                    <span className="font-medium" style={{ color: "#FCA5A5" }}>
                      {urgentCount} urgent
                    </span>
                  )}
                  {viewMode === "admin" && (
                    <span>{filteredNotifications.length} showing</span>
                  )}
                </div>

                {/* Filters */}
                {showFilters && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      "all",
                      "unread",
                      "order_status",
                      "new_order",
                      "approval",
                      "system_alert",
                    ].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className="px-3 py-1 text-xs rounded-full transition-all duration-200"
                        style={{
                          background:
                            activeFilter === filter
                              ? "linear-gradient(135deg, rgba(253, 224, 71, 0.2) 0%, rgba(251, 191, 36, 0.2) 100%)"
                              : "rgba(15, 23, 42, 0.4)",
                          color:
                            activeFilter === filter ? "#FDE047" : "#A7F3D0",
                          border:
                            activeFilter === filter
                              ? "1px solid rgba(253, 224, 71, 0.4)"
                              : "1px solid rgba(253, 224, 71, 0.2)",
                        }}
                      >
                        {filter === "all"
                          ? "All"
                          : filter.replace("_", " ").toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Analytics (Admin only) */}
              {userRole === "admin" && viewMode === "admin" && analytics && (
                <div
                  className="p-3"
                  style={{
                    background: "rgba(168, 85, 247, 0.1)",
                    borderBottom: "1px solid rgba(253, 224, 71, 0.3)",
                  }}
                >
                  <h4
                    className="text-sm font-medium mb-2"
                    style={{ color: "#C084FC" }}
                  >
                    Analytics
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {analytics.typeAnalytics?.slice(0, 4).map((stat) => (
                      <div
                        key={stat.type}
                        className="p-2 rounded"
                        style={{
                          background: "rgba(15, 23, 42, 0.6)",
                          border: "1px solid rgba(253, 224, 71, 0.2)",
                        }}
                      >
                        <div
                          className="font-medium"
                          style={{ color: "#DBF5F0" }}
                        >
                          {stat.type.replace("_", " ").toUpperCase()}
                        </div>
                        <div style={{ color: "#A7F3D0" }}>
                          {stat.total} total
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notification List */}
              <div className="max-h-96 overflow-y-auto notification-scroll">
                {loading || loadingAdmin ? (
                  <div className="p-8 text-center">
                    <div
                      className="animate-spin mx-auto mb-2"
                      style={{ color: "#FDE047" }}
                    >
                      <Bell size={24} />
                    </div>
                    <p style={{ color: "#A7F3D0" }}>Loading notifications...</p>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center">
                    <AlertTriangle
                      size={24}
                      className="mx-auto mb-2"
                      style={{ color: "#EF4444" }}
                    />
                    <p className="text-sm" style={{ color: "#FCA5A5" }}>
                      {error}
                    </p>
                    <button
                      onClick={() => {
                        clearError();
                        refresh();
                      }}
                      className="mt-2 text-xs hover:underline transition-colors"
                      style={{ color: "#60A5FA" }}
                    >
                      Try again
                    </button>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell
                      size={24}
                      className="mx-auto mb-2"
                      style={{ color: "#A7F3D0", opacity: 0.5 }}
                    />
                    <p style={{ color: "#A7F3D0" }}>No unread notifications</p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "#A7F3D0", opacity: 0.7 }}
                    >
                      {activeFilter === "all"
                        ? "All notifications have been read!"
                        : `No unread ${activeFilter} notifications`}
                    </p>
                  </div>
                ) : (
                  <div>{filteredNotifications.map(renderNotificationItem)}</div>
                )}
              </div>

              {/* Footer */}
              {filteredNotifications.length > 0 && (
                <div
                  className="p-3"
                  style={{
                    borderTop: "1px solid rgba(253, 224, 71, 0.3)",
                    background: "rgba(15, 23, 42, 0.6)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="flex items-center justify-between"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Mark all as read clicked");
                        // Mark all visible (unread) notifications as read
                        const unreadNotifications = filteredNotifications.filter(n => !n.read);
                        
                        for (const n of unreadNotifications) {
                          try {
                            if (userRole === "admin" && onMarkAsRead) {
                              await onMarkAsRead(n._id);
                            } else {
                              await markAsRead(n._id);
                            }
                          } catch (error) {
                            console.error(`Error marking notification ${n._id} as read:`, error);
                          }
                        }
                      }}
                      className="text-xs hover:underline transition-colors cursor-pointer bg-transparent border-none px-2 py-1 rounded hover:bg-blue-500/20"
                      style={{ color: "#60A5FA", minHeight: "28px" }}
                      type="button"
                      onMouseDown={(e) => e.stopPropagation()}
                      onMouseUp={(e) => e.stopPropagation()}
                    >
                      Mark all as read
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Refresh clicked");
                        refresh();
                      }}
                      className="text-xs hover:underline transition-colors cursor-pointer bg-transparent border-none px-2 py-1 rounded hover:bg-green-500/20"
                      style={{ color: "#A7F3D0", minHeight: "28px" }}
                      type="button"
                      onMouseDown={(e) => e.stopPropagation()}
                      onMouseUp={(e) => e.stopPropagation()}
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>,
          document.body
        )}
    </div>
  );
};

export default UnifiedNotificationCenter;
