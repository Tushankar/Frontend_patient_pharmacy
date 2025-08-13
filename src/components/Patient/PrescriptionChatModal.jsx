import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  FileText,
  Clock,
  User,
  Building2,
  MessageCircle,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const PrescriptionChatModal = ({
  isOpen,
  onClose,
  threadId,
  pharmacyName,
  prescriptionId,
  prescriptionDetails,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && threadId) {
      fetchMessages();
      // Start polling for new messages
      pollingRef.current = setInterval(fetchMessages, 3000);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [isOpen, threadId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!threadId) return;

    try {
      setLoading(true);
      const res = await axiosInstance.get(`/chat/${threadId}`);
      setMessages(res.data.data.messages);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      await axiosInstance.post("/chat/send", {
        threadId,
        content: newMessage.trim(),
      });
      setNewMessage("");
      // Refresh messages immediately
      await fetchMessages();
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Chat with {pharmacyName}
              </h3>
            </div>
            {prescriptionId && (
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <FileText className="w-4 h-4" />
                <span>Prescription #{prescriptionId.slice(-8)}</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Prescription Context */}
        {prescriptionDetails && (
          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">
                  Prescription from{" "}
                  {new Date(prescriptionDetails.createdAt).toLocaleDateString()}
                </span>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  prescriptionDetails.status === "accepted"
                    ? "bg-green-100 text-green-800"
                    : prescriptionDetails.status === "processing"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {prescriptionDetails.status}
              </span>
            </div>
            {prescriptionDetails.description && (
              <p className="text-sm text-gray-600 mt-1">
                {prescriptionDetails.description}
              </p>
            )}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageCircle className="w-12 h-12 mb-2" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "patient" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === "patient"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <div className="flex items-center space-x-1 mb-1">
                    {message.sender === "patient" ? (
                      <User className="w-3 h-3" />
                    ) : (
                      <Building2 className="w-3 h-3" />
                    )}
                    <span className="text-xs opacity-75">
                      {message.sender === "patient" ? "You" : pharmacyName}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender === "patient"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-gray-200"
        >
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionChatModal;
