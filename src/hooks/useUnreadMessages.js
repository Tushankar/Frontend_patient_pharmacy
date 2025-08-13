import { useState, useEffect } from "react";
import { useAuth } from "../components/Login";
import unreadMessageService from "../services/unreadMessageService";

// React hook for using the unread message service
export const useUnreadMessages = () => {
  const { user } = useAuth(); // Get authentication status
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    // Only fetch if user is authenticated
    if (!user) {
      console.log(
        "useUnreadMessages: User not authenticated, skipping unread message fetching"
      );
      return;
    }

    // Initial fetch
    unreadMessageService.fetchUnreadCounts();

    // Subscribe to updates
    const unsubscribe = unreadMessageService.addListener((counts) => {
      setUnreadCounts(Object.fromEntries(counts));
    });

    // Set up periodic refresh every 30 seconds
    const interval = setInterval(() => {
      unreadMessageService.fetchUnreadCounts();
    }, 30000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [user]); // Re-run when user authentication changes

  return {
    unreadCounts,
    getUnreadCount: (orderId) => unreadMessageService.getUnreadCount(orderId),
    markAsRead: (threadId, orderId) =>
      unreadMessageService.markAsRead(threadId, orderId),
    refresh: () => unreadMessageService.fetchUnreadCounts(),
  };
};
