import { useEffect, useRef } from "react";
import { useChatNotifications } from "../services/chatNotificationService";
import { useAuth } from "../components/Login";
import axiosInstance from "../utils/axiosInstance";

// Global chat watcher that monitors all active chats for new messages
export const useGlobalChatWatcher = () => {
  const { user: currentUser } = useAuth();
  const { getActiveSessions, checkForNewMessages } = useChatNotifications();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;

    console.log("Global Chat Watcher: Starting for user:", currentUser.role);

    // Check for new messages every 5 seconds across all active sessions
    intervalRef.current = setInterval(async () => {
      const activeSessions = getActiveSessions();
      console.log(
        "Global Chat Watcher: Checking active sessions:",
        activeSessions.length
      );

      for (const session of activeSessions) {
        try {
          console.log(
            "Global Chat Watcher: Checking session:",
            session.threadId
          );

          // Fetch messages for this thread
          const response = await axiosInstance.get(`/chat/${session.threadId}`);
          const messages = response.data.data.messages || [];

          // Check for new messages and trigger notifications
          checkForNewMessages(session.threadId, messages, currentUser);
        } catch (error) {
          console.error(
            "Global Chat Watcher: Error checking messages for thread",
            session.threadId,
            error
          );
        }
      }
    }, 5000); // Check every 5 seconds

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        console.log("Global Chat Watcher: Cleaning up");
        clearInterval(intervalRef.current);
      }
    };
  }, [currentUser, getActiveSessions, checkForNewMessages]);

  return null; // This is a side-effect only hook
};

// Component wrapper for the global chat watcher
export const GlobalChatWatcher = () => {
  useGlobalChatWatcher();
  return null;
};
