import { useState, useEffect } from "react";
import { useAuth } from "../components/Login";
import notificationService from "../services/notificationService";

// React hook for using the notification service
export const useNotifications = () => {
  const { user } = useAuth(); // Get authentication status
  const [notifications, setNotifications] = useState({
    chatUnreadCounts: new Map(),
    approvalNotifications: new Map(),
    orderStatusNotifications: new Map(),
  });

  useEffect(() => {
    // Only fetch if user is authenticated
    if (!user) {
      console.log(
        "useNotifications: User not authenticated, skipping notification fetching"
      );
      return;
    }

    // Initial fetch
    notificationService.fetchAllNotifications();

    // Subscribe to updates
    const unsubscribe = notificationService.addListener((newNotifications) => {
      setNotifications(newNotifications);
    });

    // Set up periodic refresh every 30 seconds
    const interval = setInterval(() => {
      notificationService.fetchAllNotifications();
    }, 30000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [user]); // Re-run when user authentication changes

  // Convert Maps to objects for easier use in components
  const chatUnreadCounts = Object.fromEntries(notifications.chatUnreadCounts);
  const approvalNotifications = Object.fromEntries(
    notifications.approvalNotifications
  );
  const orderStatusNotifications = Object.fromEntries(
    notifications.orderStatusNotifications
  );

  return {
    // Raw data
    chatUnreadCounts,
    approvalNotifications,
    orderStatusNotifications,

    // Helper functions
    getChatUnreadCount: (orderId) => chatUnreadCounts[orderId]?.count || 0,
    getApprovalCount: () => Object.keys(approvalNotifications).length,
    getOrderStatusCount: () => Object.keys(orderStatusNotifications).length,
    getTotalCount: () => notificationService.getTotalNotificationCount(),
    getNotificationCounts: () => notificationService.getNotificationCounts(),

    // Actions
    markChatAsRead: (orderId) => notificationService.markChatAsRead(orderId),
    markApprovalAsRead: (prescriptionId) =>
      notificationService.markApprovalAsRead(prescriptionId),
    markOrderStatusAsRead: (orderId) =>
      notificationService.markOrderStatusAsRead(orderId),

    // Service reference for advanced usage
    notificationService,
  };
};

export default useNotifications;
