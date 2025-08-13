import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../utils/axiosInstance";

const PharmacyChatModal = ({ threadId, participantName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pollingRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!threadId) return;
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(`/chat/${threadId}`);
        setMessages(res.data.data.messages);
      } catch (err) {
        console.error("Fetch chat history error:", err);
      }
    };
    fetchMessages();
    pollingRef.current = setInterval(fetchMessages, 3000);
    return () => clearInterval(pollingRef.current);
  }, [threadId]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      await axiosInstance.post("/chat/send", { threadId, content: input });
      setInput("");
      const res = await axiosInstance.get(`/chat/${threadId}`);
      setMessages(res.data.data.messages);
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
      style={{ zIndex: 999999 }}
    >
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[90vh] md:max-h-[600px] rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile menu button */}
            <button 
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Avatar and name */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium text-xs sm:text-sm">
                  {participantName ? participantName.charAt(0).toUpperCase() : "P"}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {participantName || "Patient"}
                </h3>
                {/* Online status for mobile */}
                <span className="text-xs text-green-500 sm:hidden">● Online</span>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Hide some buttons on mobile */}
            <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMenuOpen && (
          <div className="absolute top-14 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-10 sm:hidden">
            <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700">Info</span>
            </button>
            <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
              <span className="text-gray-700">More Options</span>
            </button>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.126A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-base sm:text-lg mb-1">No messages yet</p>
              <p className="text-xs sm:text-sm text-gray-400 px-4">
                Start a conversation with {participantName}
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {messages.map((msg, index) => (
                <div key={msg._id}>
                  {/* Date divider */}
                  {index === 0 || new Date(messages[index - 1].createdAt).toDateString() !== new Date(msg.createdAt).toDateString() ? (
                    <div className="flex items-center justify-center my-3 sm:my-4">
                      <span className="text-xs text-gray-500 bg-white px-2 sm:px-3 py-1 rounded-full border border-gray-200">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ) : null}
                  
                  {/* Message */}
                  <div
                    className={`flex ${
                      msg.sender === "pharmacy" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] ${
                        msg.sender === "pharmacy" ? "order-2" : "order-1"
                      }`}
                    >
                      {msg.sender !== "pharmacy" && (
                        <div className="flex items-center mb-1">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-700 rounded-full flex items-center justify-center mr-1.5 sm:mr-2">
                            <span className="text-white text-[10px] sm:text-xs">
                              {participantName ? participantName.charAt(0).toUpperCase() : "P"}
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-gray-700 truncate max-w-[100px] sm:max-w-none">
                            {participantName}
                          </span>
                          <span className="text-[10px] sm:text-xs text-gray-400 ml-1.5 sm:ml-2">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}
                      <div
                        className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl ${
                          msg.sender === "pharmacy"
                            ? "bg-blue-500 text-white ml-auto"
                            : "bg-white border border-gray-200 text-gray-800"
                        }`}
                        style={msg.sender === "pharmacy" ? {
                          borderBottomRightRadius: '4px'
                        } : {
                          borderBottomLeftRadius: '4px'
                        }}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                      </div>
                      {msg.sender === "pharmacy" && (
                        <div className="text-right mt-1">
                          <span className="text-[10px] sm:text-xs text-gray-400">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-white border-t border-gray-200">
          <div className="flex items-end space-x-2 sm:space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-20 sm:pr-24 bg-gray-100 rounded-xl text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                placeholder="Type a message..."
              />
              <div className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 flex items-center space-x-1 sm:space-x-2">
                {/* Attachment button - hide on very small screens */}
                <button className="hidden xs:block p-1 hover:bg-gray-200 rounded transition-colors">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                {/* Emoji button */}
                <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="bg-gray-800 hover:bg-gray-900 text-white p-2.5 sm:p-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyChatModal;