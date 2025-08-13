import React, { useState, useEffect, useRef } from "react";
import {
  XCircle,
  Send,
  MessageCircle,
  User,
  Package,
  Phone,
  Clock,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { useChatNotifications } from "../../services/chatNotificationService";
import unreadMessageService from "../../services/unreadMessageService";

const OrderChatModal = ({ isOpen, onClose, order, currentUser }) => {
  console.log("OrderChatModal: Component rendered with props:", {
    isOpen,
    order: !!order,
    currentUser: !!currentUser,
  });

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const intervalRef = useRef(null);

  // Chat notification service
  const { registerChatSession, unregisterChatSession, checkForNewMessages } =
    useChatNotifications();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log("OrderChatModal: isOpen changed:", isOpen, "order:", !!order);
    if (isOpen && order) {
      console.log("OrderChatModal: Initializing chat...");
      initializeChat();
    } else if (!isOpen && threadId) {
      // Unregister chat session when modal closes
      console.log("OrderChatModal: Unregistering chat session:", threadId);
      unregisterChatSession(threadId);
    }

    // Cleanup interval when modal closes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (threadId && !isOpen) {
        unregisterChatSession(threadId);
      }
    };
  }, [isOpen, order, threadId]);

  // Auto-refresh messages every 3 seconds when threadId is available
  useEffect(() => {
    if (threadId && isOpen) {
      console.log(
        "OrderChatModal: Setting up auto-refresh for thread:",
        threadId
      );

      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Set up new interval for message refresh
      intervalRef.current = setInterval(() => {
        console.log("OrderChatModal: Auto-refreshing messages...");
        fetchMessages(threadId);
      }, 3000); // Refresh every 3 seconds

      // Cleanup interval on unmount or threadId change
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [threadId, isOpen]);

  const fetchMessages = async (currentThreadId) => {
    try {
      console.log("=== FETCH MESSAGES DEBUG ===");
      console.log(
        "OrderChatModal: Fetching messages for thread:",
        currentThreadId
      );
      console.log("OrderChatModal: Current order ID:", order?._id);
      console.log("OrderChatModal: Current user:", {
        id: currentUser?._id,
        role: currentUser?.role,
        name: `${currentUser?.firstName} ${currentUser?.lastName}`,
      });

      const historyResponse = await axiosInstance.get(
        `/chat/${currentThreadId}`
      );
      console.log("OrderChatModal: Raw API response:", historyResponse.data);

      const newMessages = historyResponse.data.data.messages || [];
      console.log("OrderChatModal: Extracted messages:", newMessages);
      console.log(
        "OrderChatModal: Message details:",
        newMessages.map((msg, index) => ({
          index,
          sender: msg.sender,
          content: msg.content,
          createdAt: msg.createdAt,
          isOwnMessage: currentUser && msg.sender === currentUser.role,
        }))
      );

      // Only update if messages have changed (to avoid unnecessary re-renders)
      setMessages((prevMessages) => {
        console.log("OrderChatModal: Comparing messages...");
        console.log(
          "OrderChatModal: Previous messages count:",
          prevMessages.length
        );
        console.log("OrderChatModal: New messages count:", newMessages.length);

        // Check for new messages and trigger notifications
        if (currentThreadId && currentUser) {
          checkForNewMessages(currentThreadId, newMessages, currentUser);
        }

        if (JSON.stringify(prevMessages) !== JSON.stringify(newMessages)) {
          console.log("OrderChatModal: Messages changed - updating state");
          console.log("OrderChatModal: Updated messages:", newMessages);
          return newMessages;
        } else {
          console.log("OrderChatModal: No message changes detected");
        }
        return prevMessages;
      });
    } catch (error) {
      console.error("OrderChatModal: Failed to fetch messages:", error);
    }
  };

  const initializeChat = async () => {
    try {
      setLoading(true);
      console.log("=== ORDER CHAT MODAL INIT ===");
      console.log("OrderChatModal: initializeChat called");
      console.log("OrderChatModal: order received:", order);
      console.log("OrderChatModal: currentUser:", currentUser);

      // Check if we have a valid currentUser
      if (!currentUser) {
        console.error("OrderChatModal: No current user available");
        setMessages([
          {
            content:
              "Unable to load chat. Please refresh the page and try again.",
            sender: "system",
            createdAt: new Date().toISOString(),
          },
        ]);
        return;
      }

      // Initialize chat thread for this order
      const initData = {
        orderId: order._id,
        pharmacyId:
          currentUser.role === "patient" ? order.pharmacyId?._id : undefined,
        patientId:
          currentUser.role === "pharmacy" ? order.patientId?._id : undefined,
      };

      console.log("OrderChatModal: Sending init request with data:", initData);
      console.log("OrderChatModal: Order structure analysis:", {
        orderId: order._id,
        orderNumber: order.orderNumber,
        pharmacyId: order.pharmacyId,
        patientId: order.patientId,
        currentUserRole: currentUser.role,
      });

      const initResponse = await axiosInstance.post(
        "/chat/init-order",
        initData
      );
      console.log("OrderChatModal: Init response:", initResponse.data);

      const { threadId: newThreadId } = initResponse.data.data;
      console.log("OrderChatModal: New thread ID:", newThreadId);
      setThreadId(newThreadId);

      // Register this chat session for notifications
      console.log("OrderChatModal: Registering chat session for notifications");
      registerChatSession(newThreadId, order._id, order.orderNumber, [
        order.patientId,
        order.pharmacyId,
      ]);

      // Fetch existing messages using the new fetchMessages function
      await fetchMessages(newThreadId);

      // Mark messages as read when opening chat
      try {
        await unreadMessageService.markAsRead(newThreadId, order._id);
        console.log(
          "OrderChatModal: Marked messages as read for order:",
          order._id
        );
      } catch (error) {
        console.error(
          "OrderChatModal: Failed to mark messages as read:",
          error
        );
      }
    } catch (error) {
      console.error("OrderChatModal: Failed to initialize chat:", error);
      console.error(
        "OrderChatModal: Error details:",
        error.response?.data || error.message
      );

      // Set an error message for the user
      setMessages([
        {
          content:
            "Failed to load chat. Please check your connection and try again.",
          sender: "system",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !threadId || sending) return;

    // Check if user is authenticated
    if (!currentUser) {
      console.error(
        "OrderChatModal: Cannot send message - user not authenticated"
      );
      return;
    }

    try {
      setSending(true);
      console.log("=== SEND MESSAGE DEBUG ===");
      console.log("OrderChatModal: Sending message:", newMessage.trim());
      console.log("OrderChatModal: Thread ID:", threadId);
      console.log("OrderChatModal: Current user:", {
        id: currentUser._id,
        role: currentUser.role,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
      });
      console.log("OrderChatModal: Order ID:", order._id);

      const messageData = {
        threadId,
        content: newMessage.trim(),
      };
      console.log("OrderChatModal: Message data being sent:", messageData);

      const response = await axiosInstance.post("/chat/send", messageData);
      console.log("OrderChatModal: Send message API response:", response.data);

      const sentMessage = response.data.data.message;
      console.log("OrderChatModal: Sent message details:", sentMessage);

      // Refresh all messages to stay in sync with server
      console.log("OrderChatModal: Refreshing messages after send...");
      await fetchMessages(threadId);
      setNewMessage("");
    } catch (error) {
      console.error("OrderChatModal: Failed to send message:", error);
      console.error(
        "OrderChatModal: Send error details:",
        error.response?.data || error.message
      );

      // Add an error message to the chat
      setMessages((prev) => [
        ...prev,
        {
          content: "Failed to send message. Please try again.",
          sender: "system",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOtherParticipant = () => {
    if (!currentUser) {
      return {
        name: "Unknown",
        role: "unknown",
      };
    }

    if (currentUser.role === "patient") {
      return {
        name: order.pharmacyId?.profile?.name || "Pharmacy",
        role: "pharmacy",
      };
    } else {
      return {
        name:
          `${order.patientId?.firstName || ""} ${
            order.patientId?.lastName || ""
          }`.trim() || "Patient",
        role: "patient",
      };
    }
  };

  if (!isOpen) return null;

  const otherParticipant = getOtherParticipant();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{ zIndex: 999999 }}
    >
      <div className="bg-white rounded-lg w-full max-w-2xl h-[80vh] flex flex-col m-4">
        {/* Header */}
        <div className="p-4 border-b bg-gray-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Chat with {otherParticipant.name}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Package className="w-4 h-4" />
                  <span>Order #{order.orderNumber}</span>
                  <span className="text-gray-400">•</span>
                  <span className="capitalize">
                    {order.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="ml-2 text-gray-600">Loading chat...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No messages yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Start a conversation about order #{order.orderNumber}
              </p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwnMessage =
                currentUser && message.sender === currentUser.role;
              const isSystemMessage = message.sender === "system";
              return (
                <div
                  key={index}
                  className={`flex ${
                    isSystemMessage
                      ? "justify-center"
                      : isOwnMessage
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isSystemMessage
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : isOwnMessage
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {!isSystemMessage && (
                      <div className="flex items-center justify-between mt-1">
                        <span
                          className={`text-xs ${
                            isOwnMessage ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {isOwnMessage ? "You" : otherParticipant.name}
                        </span>
                        <span
                          className={`text-xs ${
                            isOwnMessage ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-gray-50">
          {!currentUser ? (
            <div className="text-center py-4">
              <p className="text-red-600 text-sm">
                Authentication required. Please refresh the page and try again.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message ${otherParticipant.name}...`}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    disabled={sending || !threadId}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending || !threadId}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderChatModal;
