import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../components/Login";
import advancedNotificationService from "../services/advancedNotificationService";

// React hook for advanced notifications
export const useAdvancedNotifications = (options = {}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [locationStatus, setLocationStatus] = useState({
    enabled: false,
    location: null,
    supportedByBrowser: false,
  });

  // Memoize options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(
    () => ({
      unreadOnly: false,
      autoRefresh: true,
      enableLocation: true,
      refreshInterval: 60000, // 1 minute as requested
      ...options,
    }),
    [
      options.unreadOnly,
      options.autoRefresh,
      options.enableLocation,
      options.refreshInterval,
    ]
  );

  // Fetch notifications with current options
  const fetchNotifications = useCallback(
    async (fetchOptions = {}) => {
      // For demo purposes, allow fetching even without user
      setLoading(true);
      setError(null);

      try {
        const result = await advancedNotificationService.fetchNotifications({
          ...memoizedOptions,
          ...fetchOptions,
        });

        setNotifications(result.notifications || []);
        setPagination(result.pagination || {});
      } catch (err) {
        setError(err.message);
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    },
    [memoizedOptions]
  );

  // Initialize and setup listeners
  useEffect(() => {
    // Subscribe to notification updates
    const unsubscribe = advancedNotificationService.addListener(
      (updatedNotifications) => {
        setNotifications(updatedNotifications);
      }
    );

    // Initial fetch (works with demo data if no backend)
    fetchNotifications();

    // Initialize location if enabled
    if (memoizedOptions.enableLocation) {
      advancedNotificationService.initializeLocation().then(() => {
        setLocationStatus(advancedNotificationService.getLocationStatus());
      });
    }

    // Setup auto-refresh
    let interval;
    if (memoizedOptions.autoRefresh && memoizedOptions.refreshInterval > 0) {
      interval = setInterval(() => {
        fetchNotifications({ unreadOnly: true });
      }, memoizedOptions.refreshInterval);
    }

    return () => {
      unsubscribe();
      if (interval) clearInterval(interval);
    };
  }, [
    fetchNotifications,
    memoizedOptions.autoRefresh,
    memoizedOptions.enableLocation,
    memoizedOptions.refreshInterval,
  ]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      const success = await advancedNotificationService.markAsRead(
        notificationId
      );
      if (success) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === notificationId
              ? {
                  ...notification,
                  userStatus: {
                    ...notification.userStatus,
                    deliveryStatus: "read",
                    readAt: new Date().toISOString(),
                  },
                }
              : notification
          )
        );
      }
      return success;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  // Track notification action
  const trackAction = useCallback(async (notificationId, action) => {
    try {
      return await advancedNotificationService.trackAction(
        notificationId,
        action
      );
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  // Handle notification click
  const handleNotificationClick = useCallback(async (notification) => {
    try {
      await advancedNotificationService.handleNotificationClick(notification);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Dismiss notification
  const dismissNotification = useCallback(async (notificationId) => {
    try {
      await advancedNotificationService.dismissNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Create notification (admin/pharmacy only)
  const createNotification = useCallback(
    async (notificationData) => {
      try {
        setError(null);
        const result = await advancedNotificationService.createNotification(
          notificationData
        );
        await fetchNotifications(); // Refresh after creation
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [fetchNotifications]
  );

  // Refresh notifications manually
  const refresh = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Update location and fetch location-based notifications
  const updateLocation = useCallback(async () => {
    try {
      await advancedNotificationService.updateLocation();
      setLocationStatus(advancedNotificationService.getLocationStatus());
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Get notification counts and analytics
  const getNotificationCounts = useCallback(() => {
    return advancedNotificationService.getNotificationCounts();
  }, [notifications]);

  // Filter notifications by type
  const getNotificationsByType = useCallback(
    (type) => {
      return notifications.filter((n) => n.type === type);
    },
    [notifications]
  );

  // Filter notifications by priority
  const getNotificationsByPriority = useCallback(
    (priority) => {
      return notifications.filter((n) => n.priority === priority);
    },
    [notifications]
  );

  // Get unread notifications
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter((n) => n.userStatus?.deliveryStatus !== "read");
  }, [notifications]);

  // Get urgent notifications
  const getUrgentNotifications = useCallback(() => {
    return notifications.filter((n) =>
      ["urgent", "critical"].includes(n.priority)
    );
  }, [notifications]);

  // Get recent notifications (last 24 hours)
  const getRecentNotifications = useCallback(() => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return notifications.filter((n) => new Date(n.createdAt) > oneDayAgo);
  }, [notifications]);

  // Get all notifications (admin only)
  const getAllNotifications = useCallback(
    async (options = {}) => {
      // For demo purposes, allow admin access without strict user check
      try {
        setLoading(true);
        return await advancedNotificationService.getAllNotifications(options);
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Get notification analytics (admin only)
  const getNotificationAnalytics = useCallback(async () => {
    // For demo purposes, allow analytics access without strict user check
    try {
      return await advancedNotificationService.getNotificationAnalytics();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    // Data
    notifications,
    loading,
    error,
    pagination,
    locationStatus,

    // Counts and analytics
    counts: getNotificationCounts(),
    unreadCount: getUnreadNotifications().length,
    urgentCount: getUrgentNotifications().length,
    recentCount: getRecentNotifications().length,

    // Actions
    markAsRead,
    trackAction,
    handleNotificationClick,
    dismissNotification,
    createNotification,
    refresh,
    updateLocation,

    // Admin functions
    getAllNotifications,
    getNotificationAnalytics,

    // Fetch with options
    fetchNotifications,

    // Filtered getters
    getNotificationsByType,
    getNotificationsByPriority,
    getUnreadNotifications,
    getUrgentNotifications,
    getRecentNotifications,

    // Utility
    clearError: () => setError(null),
  };
};

export default useAdvancedNotifications;
