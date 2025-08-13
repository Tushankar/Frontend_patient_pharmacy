import axiosInstance from "../utils/axiosInstance";

class AdvancedNotificationService {
  constructor() {
    this.notifications = new Map(); // notificationId -> notification
    this.listeners = new Set(); // Callbacks to notify when notifications change
    this.userLocation = null; // For spatial features
    this.isLocationEnabled = false;

    // Cache and throttling
    this.cache = new Map(); // URL -> { data, timestamp }
    this.cacheTimeout = 30000; // 30 seconds cache
    this.lastFetchTime = 0;
    this.minFetchInterval = 5000; // Minimum 5 seconds between fetches
    this.pendingRequests = new Map(); // URL -> Promise
  }

  // Add a listener for notification changes
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback); // Return cleanup function
  }

  // Notify all listeners of changes
  notifyListeners() {
    const notifications = Array.from(this.notifications.values());
    this.listeners.forEach((callback) => callback(notifications));
  }

  // Initialize location services for spatial features
  async initializeLocation() {
    try {
      if ("geolocation" in navigator) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 600000, // 10 minutes instead of 5
          });
        });

        this.userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.isLocationEnabled = true;

        console.log(
          "🌍 [LOCATION] Location services initialized:",
          this.userLocation
        );

        // Only fetch location-based notifications once during initialization
        // Don't call this repeatedly
        await this.fetchLocationBasedNotifications();
      } else {
        console.log("🌍 [LOCATION] Geolocation not supported");
      }
    } catch (error) {
      console.error("🌍 [LOCATION] Error getting location:", error);
      this.isLocationEnabled = false;
    }
  }

  // Fetch all notifications with advanced filtering
  async fetchNotifications(options = {}) {
    try {
      const now = Date.now();

      // Throttle requests - prevent too frequent calls
      if (now - this.lastFetchTime < this.minFetchInterval) {
        console.log(
          "🔔 [ADVANCED-NOTIFICATIONS] Throttling request - too frequent"
        );
        return {
          notifications: Array.from(this.notifications.values()),
          pagination: {},
        };
      }

      console.log(
        "🔔 [ADVANCED-NOTIFICATIONS] Fetching notifications with options:",
        options
      );

      const token = localStorage.getItem("token");
      if (!token) {
        console.log("🔔 No authentication token found");
        return { notifications: [], pagination: {} };
      }

      const params = new URLSearchParams();
      if (options.type) params.append("type", options.type);
      if (options.priority) params.append("priority", options.priority);
      if (options.unreadOnly) params.append("unreadOnly", options.unreadOnly);
      if (options.limit) params.append("limit", options.limit);
      if (options.page) params.append("page", options.page);
      if (options.includeExpired)
        params.append("includeExpired", options.includeExpired);

      const url = `/notifications?${params}`;

      // Check cache first
      const cached = this.cache.get(url);
      if (cached && now - cached.timestamp < this.cacheTimeout) {
        console.log("🔔 [ADVANCED-NOTIFICATIONS] Using cached data");
        return cached.data;
      }

      // Check if there's already a pending request for this URL
      if (this.pendingRequests.has(url)) {
        console.log(
          "🔔 [ADVANCED-NOTIFICATIONS] Request already pending, waiting..."
        );
        return await this.pendingRequests.get(url);
      }

      // Create new request
      const requestPromise = this._makeNotificationRequest(url);
      this.pendingRequests.set(url, requestPromise);

      try {
        const result = await requestPromise;
        this.lastFetchTime = now;

        // Cache the result
        this.cache.set(url, {
          data: result,
          timestamp: now,
        });

        return result;
      } finally {
        this.pendingRequests.delete(url);
      }
    } catch (error) {
      console.error(
        "🔔 [ADVANCED-NOTIFICATIONS] Error fetching notifications:",
        error
      );
      return { notifications: [], pagination: {} };
    }
  }

  // Private method to make the actual request
  async _makeNotificationRequest(url) {
    try {
      const response = await axiosInstance.get(url);

      if (response.data.success) {
        const { data: notifications, pagination } = response.data;

        // Update local cache
        notifications.forEach((notification) => {
          this.notifications.set(notification._id, notification);
        });

        this.notifyListeners();

        console.log(
          "🔔 [ADVANCED-NOTIFICATIONS] Fetched",
          notifications.length,
          "notifications"
        );
        return { notifications, pagination };
      }

      return { notifications: [], pagination: {} };
    } catch (error) {
      console.error("🔔 [ADVANCED-NOTIFICATIONS] Backend error:", error);
      return { notifications: [], pagination: {} };
    }
  }



  // Fetch location-based notifications
  async fetchLocationBasedNotifications() {
    try {
      if (!this.isLocationEnabled || !this.userLocation) {
        console.log(
          "🌍 [LOCATION] Location not available for spatial notifications"
        );
        return;
      }

      const { latitude, longitude } = this.userLocation;
      const url = `/notifications/location?latitude=${latitude}&longitude=${longitude}&radius=5000`;

      // Check cache first
      const now = Date.now();
      const cached = this.cache.get(url);
      if (cached && now - cached.timestamp < this.cacheTimeout) {
        console.log("🌍 [LOCATION] Using cached location data");
        return;
      }

      // Check if there's already a pending request
      if (this.pendingRequests.has(url)) {
        console.log(
          "🌍 [LOCATION] Location request already pending, waiting..."
        );
        return await this.pendingRequests.get(url);
      }

      const requestPromise = axiosInstance.get(url);
      this.pendingRequests.set(url, requestPromise);

      try {
        const response = await requestPromise;

        if (response.data.success) {
          const locationNotifications = response.data.data;

          locationNotifications.forEach((notification) => {
            this.notifications.set(notification._id, notification);
          });

          this.notifyListeners();

          // Cache the result
          this.cache.set(url, {
            data: locationNotifications,
            timestamp: now,
          });

          console.log(
            "🌍 [LOCATION] Fetched",
            locationNotifications.length,
            "location-based notifications"
          );
        }
      } finally {
        this.pendingRequests.delete(url);
      }
    } catch (error) {
      console.error(
        "🌍 [LOCATION] Error fetching location-based notifications:",
        error
      );
    }
  }

  // Create a new notification (admin/pharmacy only)
  async createNotification(notificationData) {
    try {
      console.log(
        "🔔 [ADVANCED-NOTIFICATIONS] Creating notification:",
        notificationData
      );

      const response = await axiosInstance.post(
        "/notifications",
        notificationData
      );

      if (response.data.success) {
        console.log(
          "🔔 [ADVANCED-NOTIFICATIONS] Notification created successfully"
        );
        await this.fetchNotifications(); // Refresh notifications
        return response.data.data;
      }
    } catch (error) {
      console.error(
        "🔔 [ADVANCED-NOTIFICATIONS] Error creating notification:",
        error
      );
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      console.log(
        "🔔 [ADVANCED-NOTIFICATIONS] Marking notification as read:",
        notificationId
      );

      const response = await axiosInstance.post(
        `/notifications/${notificationId}/read`
      );

      console.log("Mark as read response:", response.data);
      
      if (response.data.success) {
        // Update local state
        const notification = this.notifications.get(notificationId);
        if (notification) {
          notification.read = true;
          notification.userStatus = notification.userStatus || {};
          notification.userStatus.deliveryStatus = "read";
          notification.userStatus.readAt = new Date().toISOString();
          
          // Update adminView counts if present
          if (notification.adminView) {
            notification.adminView.readCount = (notification.adminView.readCount || 0) + 1;
            notification.adminView.unreadCount = Math.max(0, (notification.adminView.unreadCount || 1) - 1);
          }
          
          this.notifyListeners();
        }

        // Clear cache to ensure fresh data on next fetch
        this.cache.clear();
        
        console.log("🔔 [ADVANCED-NOTIFICATIONS] Notification marked as read");
        return true;
      } else {
        console.error("Failed to mark as read:", response.data);
        return false;
      }
    } catch (error) {
      console.error(
        "🔔 [ADVANCED-NOTIFICATIONS] Error marking notification as read:",
        error
      );
      return false;
    }
  }

  // Track notification action
  async trackAction(notificationId, action) {
    try {
      console.log("🔔 [ADVANCED-NOTIFICATIONS] Tracking action:", {
        notificationId,
        action,
      });

      const response = await axiosInstance.post(
        `/notifications/${notificationId}/action`,
        {
          action,
        }
      );

      if (response.data.success) {
        // Update local state
        const notification = this.notifications.get(notificationId);
        if (notification) {
          notification.userStatus.actionTaken = action;
          notification.userStatus.actionAt = new Date().toISOString();
          this.notifyListeners();
        }

        console.log("🔔 [ADVANCED-NOTIFICATIONS] Action tracked successfully");
        return true;
      }
    } catch (error) {
      console.error(
        "🔔 [ADVANCED-NOTIFICATIONS] Error tracking action:",
        error
      );
      return false;
    }
  }

  // Get all notifications (admin only)
  async getAllNotifications(options = {}) {
    try {
      console.log("👑 [ADMIN] Fetching all notifications...");

      // Build query parameters
      const params = new URLSearchParams();
      if (options.type) params.append("type", options.type);
      if (options.priority) params.append("priority", options.priority);
      if (options.unreadOnly)
        params.append("unreadOnly", options.unreadOnly.toString());
      if (options.page) params.append("page", options.page.toString());
      if (options.limit) params.append("limit", options.limit.toString());

      const url = `/notifications/admin?${params.toString()}`;
      const response = await axiosInstance.get(url);

      if (response.data.success) {
        const notifications = response.data.data;
        
        console.log(
          `👑 [ADMIN] Fetched ${notifications.length} notifications`
        );
        return { ...response.data, data: notifications };
      }

      return { data: [], pagination: {}, success: true };
    } catch (error) {
      console.error("👑 [ADMIN] Error fetching all notifications:", error);
      throw error;
    }
  }

  // Get notification analytics (admin only)
  async getNotificationAnalytics() {
    try {
      console.log("📊 [ANALYTICS] Fetching notification analytics...");

      const response = await axiosInstance.get("/notifications/analytics");

      if (response.data.success) {
        console.log("📊 [ANALYTICS] Analytics fetched successfully");
        return response.data.data;
      }

      return null;
    } catch (error) {
      console.error("📊 [ANALYTICS] Error fetching analytics:", error);
      throw error;
    }
  }

  // Get notification counts by type and priority
  getNotificationCounts() {
    const notifications = Array.from(this.notifications.values());
    const unread = notifications.filter(
      (n) => n.userStatus?.deliveryStatus !== "read"
    );

    const counts = {
      total: unread.length,
      byType: {},
      byPriority: {},
      urgent: 0,
      recent: 0, // Last 24 hours
    };

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    unread.forEach((notification) => {
      // Count by type
      counts.byType[notification.type] =
        (counts.byType[notification.type] || 0) + 1;

      // Count by priority
      counts.byPriority[notification.priority] =
        (counts.byPriority[notification.priority] || 0) + 1;

      // Count urgent notifications
      if (["urgent", "critical"].includes(notification.priority)) {
        counts.urgent++;
      }

      // Count recent notifications
      if (new Date(notification.createdAt) > oneDayAgo) {
        counts.recent++;
      }
    });

    return counts;
  }

  // Get notifications by type
  getNotificationsByType(type) {
    const notifications = Array.from(this.notifications.values());
    return notifications.filter((n) => n.type === type);
  }

  // Get notifications by priority
  getNotificationsByPriority(priority) {
    const notifications = Array.from(this.notifications.values());
    return notifications.filter((n) => n.priority === priority);
  }

  // Get unread notifications
  getUnreadNotifications() {
    const notifications = Array.from(this.notifications.values());
    return notifications.filter((n) => n.userStatus?.deliveryStatus !== "read");
  }

  // Get recent notifications (last 24 hours)
  getRecentNotifications() {
    const notifications = Array.from(this.notifications.values());
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return notifications.filter((n) => new Date(n.createdAt) > oneDayAgo);
  }

  // Clear all notifications from local cache
  clearCache() {
    this.notifications.clear();
    this.notifyListeners();
  }

  // Dismiss notification (mark as read and remove from view)
  async dismissNotification(notificationId) {
    await this.markAsRead(notificationId);
    this.notifications.delete(notificationId);
    this.notifyListeners();
  }

  // Handle notification click/interaction
  async handleNotificationClick(notification) {
    // Track the click action
    await this.trackAction(notification._id, "clicked");

    // Mark as read
    await this.markAsRead(notification._id);

    // Handle action button if present
    if (notification.content?.actionButton) {
      const { action, url } = notification.content.actionButton;

      if (action === "navigate" && url) {
        // Navigate to the specified URL
        window.location.href = url;
      }
    }
  }

  // Get spatial/location-based features status
  getLocationStatus() {
    return {
      enabled: this.isLocationEnabled,
      location: this.userLocation,
      supportedByBrowser: "geolocation" in navigator,
    };
  }

  // Update user location and refresh location-based notifications
  async updateLocation() {
    await this.initializeLocation();
  }

  // Clear cache (useful for force refresh)
  clearCache() {
    this.cache.clear();
    console.log("🔔 [CACHE] Cache cleared");
  }

  // Get cache status
  getCacheStatus() {
    return {
      size: this.cache.size,
      cacheTimeout: this.cacheTimeout,
      minFetchInterval: this.minFetchInterval,
    };
  }
}

// Create singleton instance
const advancedNotificationService = new AdvancedNotificationService();

// Initialize location services on load (only once)
if (localStorage.getItem("token")) {
  advancedNotificationService.initializeLocation();
}

export default advancedNotificationService;
