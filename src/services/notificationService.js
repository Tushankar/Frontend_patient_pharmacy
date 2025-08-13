import axiosInstance from "../utils/axiosInstance";

class NotificationService {
  constructor() {
    this.chatUnreadCounts = new Map(); // orderId -> { count, threadId, lastMessage }
    this.approvalNotifications = new Map(); // prescriptionId -> { status, count }
    this.orderStatusNotifications = new Map(); // orderId -> { status, updateTime }
    this.listeners = new Set(); // Callbacks to notify when notifications change
  }

  // Add a listener for notification changes
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback); // Return cleanup function
  }

  // Notify all listeners of changes
  notifyListeners() {
    const notifications = {
      chatUnreadCounts: this.chatUnreadCounts,
      approvalNotifications: this.approvalNotifications,
      orderStatusNotifications: this.orderStatusNotifications,
    };
    this.listeners.forEach((callback) => callback(notifications));
  }

  // Fetch all notifications from server
  async fetchAllNotifications() {
    try {
      console.log(
        "🔔 NotificationService: Starting fetch all notifications..."
      );

      // Check if user is authenticated
      const token = localStorage.getItem("token");
      if (!token) {
        console.log(
          "🔔 No authentication token found, skipping notification fetch"
        );
        return {};
      }

      // Get user info for better debugging
      const userInfo = JSON.parse(localStorage.getItem("user") || "{}");
      console.log(
        `🔔 Fetching notifications for user type: ${userInfo.role || "unknown"}`
      );

      // Fetch chat unread counts
      await this.fetchChatUnreadCounts();

      // Fetch approval notifications (for admins)
      await this.fetchApprovalNotifications();

      // Fetch order status notifications (for patients)
      await this.fetchOrderStatusNotifications();

      return {
        success: true,
        chatUnreadCounts: Object.fromEntries(this.chatUnreadCounts),
        approvalNotifications: Object.fromEntries(this.approvalNotifications),
        orderStatusNotifications: Object.fromEntries(
          this.orderStatusNotifications
        ),
      };
    } catch (error) {
      console.error("🔔 Error fetching notifications:", error);
      return { success: false, error: error.message };
    }
  }

  // Fetch chat unread message counts
  async fetchChatUnreadCounts() {
    try {
      const response = await axiosInstance.get("/chat/unread-counts");

      if (response.data.success) {
        const newCounts = response.data.data;
        console.log("🔔 Received chat unread counts:", newCounts);

        // Update internal state
        this.chatUnreadCounts.clear();
        Object.entries(newCounts).forEach(([orderId, data]) => {
          this.chatUnreadCounts.set(orderId, data);
        });

        this.notifyListeners();
        return newCounts;
      }
    } catch (error) {
      console.error("🔔 Error fetching chat unread counts:", error);
    }
    return {};
  }

  // Fetch approval notifications (for admins)
  async fetchApprovalNotifications() {
    try {
      const response = await axiosInstance.get("/notifications/approvals");

      if (response.data.success) {
        const approvals = response.data.data;
        console.log("🔔 Received approval notifications:", approvals);

        this.approvalNotifications.clear();
        Object.entries(approvals).forEach(([prescriptionId, data]) => {
          this.approvalNotifications.set(prescriptionId, data);
        });

        this.notifyListeners();
        return approvals;
      }
    } catch (error) {
      // Handle different error types
      if (error.response?.status === 403) {
        // 403 is expected for non-admin users - this is normal behavior
        console.log(
          "🔔 Approval notifications: User is not an admin (403 - expected)"
        );
      } else if (error.response?.status === 401) {
        // 401 means not authenticated
        console.log("🔔 Approval notifications: User not authenticated (401)");
      } else {
        // Other errors should be logged
        console.error("🔔 Error fetching approval notifications:", error);
      }
    }
    return {};
  }

  // Fetch order status notifications (for patients)
  async fetchOrderStatusNotifications() {
    try {
      const response = await axiosInstance.get("/notifications/order-status");

      if (response.data.success) {
        const orderNotifications = response.data.data;
        console.log(
          "🔔 Received order status notifications:",
          orderNotifications
        );

        this.orderStatusNotifications.clear();
        Object.entries(orderNotifications).forEach(([orderId, data]) => {
          this.orderStatusNotifications.set(orderId, data);
        });

        this.notifyListeners();
        return orderNotifications;
      }
    } catch (error) {
      // Handle different error types
      if (error.response?.status === 403) {
        // 403 is expected for users without patient access
        console.log(
          "🔔 Order status notifications: User access restricted (403 - expected)"
        );
      } else if (error.response?.status === 401) {
        // 401 means not authenticated
        console.log(
          "🔔 Order status notifications: User not authenticated (401)"
        );
      } else {
        // Other errors should be logged
        console.error("🔔 Error fetching order status notifications:", error);
      }
    }
    return {};
  }

  // Mark chat messages as read
  async markChatMessagesAsRead(orderId) {
    try {
      const response = await axiosInstance.post("/chat/mark-as-read", {
        orderId,
      });

      if (response.data.success) {
        // Update local state
        this.chatUnreadCounts.delete(orderId);
        this.notifyListeners();
        return true;
      }
    } catch (error) {
      console.error("🔔 Error marking chat messages as read:", error);
    }
    return false;
  }

  // Mark approval notification as read
  async markApprovalAsRead(prescriptionId) {
    try {
      const response = await axiosInstance.post(
        "/notifications/mark-approval-read",
        { prescriptionId }
      );

      if (response.data.success) {
        this.approvalNotifications.delete(prescriptionId);
        this.notifyListeners();
        return true;
      }
    } catch (error) {
      console.error("🔔 Error marking approval as read:", error);
    }
    return false;
  }

  // Mark order status notification as read
  async markOrderStatusAsRead(orderId) {
    try {
      const response = await axiosInstance.post(
        "/notifications/mark-order-status-read",
        { orderId }
      );

      if (response.data.success) {
        this.orderStatusNotifications.delete(orderId);
        this.notifyListeners();
        return true;
      }
    } catch (error) {
      console.error("🔔 Error marking order status as read:", error);
    }
    return false;
  }

  // Get total notification count
  getTotalNotificationCount() {
    const chatCount = Array.from(this.chatUnreadCounts.values()).reduce(
      (sum, data) => sum + (data.count || 0),
      0
    );
    const approvalCount = this.approvalNotifications.size;
    const orderStatusCount = this.orderStatusNotifications.size;

    return chatCount + approvalCount + orderStatusCount;
  }

  // Get counts by type
  getNotificationCounts() {
    const chatCount = Array.from(this.chatUnreadCounts.values()).reduce(
      (sum, data) => sum + (data.count || 0),
      0
    );
    const approvalCount = this.approvalNotifications.size;
    const orderStatusCount = this.orderStatusNotifications.size;

    return {
      chat: chatCount,
      approvals: approvalCount,
      orderStatus: orderStatusCount,
      total: chatCount + approvalCount + orderStatusCount,
    };
  }

  // Mark approval notification as read
  async markApprovalAsRead(prescriptionId) {
    try {
      console.log("🔔 Marking approval notification as read:", prescriptionId);
      const response = await axiosInstance.post(
        `/notifications/mark-approval-read/${prescriptionId}`
      );

      if (response.data.success) {
        // Remove from local state
        this.approvalNotifications.delete(prescriptionId);
        this.notifyListeners();
        console.log("🔔 Approval notification marked as read");
        return true;
      }
    } catch (error) {
      console.error("🔔 Error marking approval as read:", error);
      return false;
    }
  }

  // Mark order status notification as read
  async markOrderStatusAsRead(orderId) {
    try {
      console.log("🔔 Marking order status notification as read:", orderId);
      const response = await axiosInstance.post(
        `/notifications/mark-order-status-read/${orderId}`
      );

      if (response.data.success) {
        // Remove from local state
        this.orderStatusNotifications.delete(orderId);
        this.notifyListeners();
        console.log("🔔 Order status notification marked as read");
        return true;
      }
    } catch (error) {
      console.error("🔔 Error marking order status as read:", error);
      return false;
    }
  }

  // Mark chat notification as read
  async markChatAsRead(orderId) {
    try {
      console.log("🔔 Marking chat notification as read:", orderId);
      const response = await axiosInstance.post(
        `/notifications/mark-chat-read/${orderId}`
      );

      if (response.data.success) {
        // Remove from local state
        this.chatUnreadCounts.delete(orderId);
        this.notifyListeners();
        console.log("🔔 Chat notification marked as read");
        return true;
      }
    } catch (error) {
      console.error("🔔 Error marking chat as read:", error);
      return false;
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService();

// Auto-refresh notifications every 30 seconds
setInterval(() => {
  if (localStorage.getItem("token")) {
    notificationService.fetchAllNotifications();
  }
}, 30000);

export default notificationService;
