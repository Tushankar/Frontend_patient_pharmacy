import { useNotification } from "../contexts/NotificationContext";

class ChatNotificationService {
  constructor() {
    this.activeChatSessions = new Map(); // threadId -> { orderId, orderNumber, participants }
    this.lastMessageCounts = new Map(); // threadId -> messageCount
    this.notificationCallback = null;
  }

  setNotificationCallback(callback) {
    this.notificationCallback = callback;
  }

  // Register an active chat session
  registerChatSession(threadId, orderId, orderNumber, participants) {
    console.log("Registering chat session:", {
      threadId,
      orderId,
      orderNumber,
      participants,
    });
    this.activeChatSessions.set(threadId, {
      orderId,
      orderNumber,
      participants,
      registeredAt: new Date(),
    });
  }

  // Unregister a chat session (when modal closes)
  unregisterChatSession(threadId) {
    console.log("Unregistering chat session:", threadId);
    this.activeChatSessions.delete(threadId);
    this.lastMessageCounts.delete(threadId);
  }

  // Update message count for a thread
  updateMessageCount(threadId, messageCount) {
    const lastCount = this.lastMessageCounts.get(threadId) || 0;
    console.log(
      `Message count update for thread ${threadId}: ${lastCount} -> ${messageCount}`
    );
    this.lastMessageCounts.set(threadId, messageCount);
    return messageCount > lastCount;
  }

  // Check for new messages and trigger notifications
  checkForNewMessages(threadId, messages, currentUser) {
    if (!this.activeChatSessions.has(threadId)) {
      console.log("Thread not in active sessions, skipping notification check");
      return false;
    }

    const session = this.activeChatSessions.get(threadId);
    const lastCount = this.lastMessageCounts.get(threadId) || 0;
    const currentCount = messages.length;

    console.log("Checking for new messages:", {
      threadId,
      lastCount,
      currentCount,
      currentUserRole: currentUser?.role,
    });

    if (currentCount > lastCount) {
      // Find the new messages
      const newMessages = messages.slice(lastCount);
      console.log("New messages detected:", newMessages);

      // Check if any new messages are from other users
      const messagesFromOthers = newMessages.filter(
        (msg) => msg.sender !== currentUser?.role
      );

      console.log("Messages from others:", messagesFromOthers);

      if (messagesFromOthers.length > 0 && this.notificationCallback) {
        // Get the latest message from others
        const latestMessage = messagesFromOthers[messagesFromOthers.length - 1];
        const senderName =
          latestMessage.sender === "patient" ? "Patient" : "Pharmacy";

        console.log("Triggering notification for message:", latestMessage);
        this.notificationCallback(
          latestMessage.content,
          session.orderNumber,
          senderName,
          session.orderId
        );
      }

      this.lastMessageCounts.set(threadId, currentCount);
      return true;
    }

    return false;
  }

  // Get all active sessions
  getActiveSessions() {
    return Array.from(this.activeChatSessions.entries()).map(
      ([threadId, session]) => ({
        threadId,
        ...session,
      })
    );
  }

  // Clear all sessions (useful for logout)
  clearAllSessions() {
    console.log("Clearing all chat sessions");
    this.activeChatSessions.clear();
    this.lastMessageCounts.clear();
  }
}

// Create a singleton instance
const chatNotificationService = new ChatNotificationService();

// Custom hook for using the chat notification service
export const useChatNotifications = () => {
  const { addChatNotification } = useNotification();

  // Set up the notification callback
  chatNotificationService.setNotificationCallback(addChatNotification);

  return {
    registerChatSession: (threadId, orderId, orderNumber, participants) =>
      chatNotificationService.registerChatSession(
        threadId,
        orderId,
        orderNumber,
        participants
      ),

    unregisterChatSession: (threadId) =>
      chatNotificationService.unregisterChatSession(threadId),

    checkForNewMessages: (threadId, messages, currentUser) =>
      chatNotificationService.checkForNewMessages(
        threadId,
        messages,
        currentUser
      ),

    updateMessageCount: (threadId, messageCount) =>
      chatNotificationService.updateMessageCount(threadId, messageCount),

    getActiveSessions: () => chatNotificationService.getActiveSessions(),

    clearAllSessions: () => chatNotificationService.clearAllSessions(),
  };
};

export default chatNotificationService;
