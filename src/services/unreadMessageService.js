import axiosInstance from "../utils/axiosInstance";

class UnreadMessageService {
  constructor() {
    this.unreadCounts = new Map(); // orderId -> { count, threadId, lastMessage }
    this.listeners = new Set(); // Callbacks to notify when counts change
  }

  // Add a listener for unread count changes
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback); // Return cleanup function
  }

  // Notify all listeners of changes
  notifyListeners() {
    this.listeners.forEach((callback) => callback(this.unreadCounts));
  }

  // Fetch unread message counts from server
  async fetchUnreadCounts() {
    try {
      console.log("🔍 UnreadMessageService: Starting fetch unread counts...");

      // Check if user is authenticated
      const token = localStorage.getItem("token");
      if (!token) {
        console.log(
          "🔍 No authentication token found, skipping unread count fetch"
        );
        return {};
      }

      console.log("🔍 Token exists, making API request to /chat/unread-counts");

      const response = await axiosInstance.get("/chat/unread-counts");

      console.log("🔍 API Response received:", response.data);

      if (response.data.success) {
        const newCounts = response.data.data;
        console.log("🔍 Received unread counts:", newCounts);

        // Update internal state
        this.unreadCounts.clear();
        Object.entries(newCounts).forEach(([orderId, data]) => {
          console.log(`🔍 Setting count for order ${orderId}:`, data);
          this.unreadCounts.set(orderId, data);
        });

        // Notify listeners
        console.log("🔍 Notifying listeners with updated counts");
        this.notifyListeners();

        return newCounts;
      } else {
        console.log("🔍 API response was not successful:", response.data);
      }
    } catch (error) {
      console.error("🔍 Error fetching unread counts:", error);

      // Log more details about the error
      if (error.response) {
        console.error("🔍 Response status:", error.response.status);
        console.error("🔍 Response data:", error.response.data);
        console.error("🔍 Response headers:", error.response.headers);
      } else if (error.request) {
        console.error(
          "🔍 Request made but no response received:",
          error.request
        );
      } else {
        console.error("Error setting up request:", error.message);
      }

      return {};
    }
  }

  // Mark messages as read for a specific thread
  async markAsRead(threadId, orderId) {
    try {
      console.log("Marking messages as read:", { threadId, orderId });
      const response = await axiosInstance.put(
        `/chat/thread/${threadId}/mark-read`
      );

      if (response.data.success) {
        // Remove the unread count for this order
        this.unreadCounts.delete(orderId);
        this.notifyListeners();

        console.log("Messages marked as read successfully");
        return true;
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
      return false;
    }
  }

  // Get unread count for a specific order
  getUnreadCount(orderId) {
    const data = this.unreadCounts.get(orderId);
    return data ? data.count : 0;
  }

  // Get all unread counts
  getAllUnreadCounts() {
    return Object.fromEntries(this.unreadCounts);
  }

  // Clear all unread counts (useful for logout)
  clearAll() {
    this.unreadCounts.clear();
    this.notifyListeners();
  }

  // Update a specific order's unread count locally
  updateCount(orderId, count, threadId, lastMessage) {
    if (count > 0) {
      this.unreadCounts.set(orderId, { count, threadId, lastMessage });
    } else {
      this.unreadCounts.delete(orderId);
    }
    this.notifyListeners();
  }
}

// Create singleton instance
const unreadMessageService = new UnreadMessageService();

export default unreadMessageService;
