import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../utils/axiosInstance";

const ChatWithPharmacy = ({ pharmacyId, onClose }) => {
  const [threadId, setThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const pollingRef = useRef(null);

  // Initialize or fetch chat thread
  useEffect(() => {
    const initThread = async () => {
      try {
        const res = await axiosInstance.post("/chat/init", { pharmacyId });
        setThreadId(res.data.data.threadId);
      } catch (err) {
        console.error("Failed to init chat thread:", err);
      }
    };
    initThread();
  }, [pharmacyId]);

  // Poll messages
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
    // initial load
    fetchMessages();
    // polling every 3s
    pollingRef.current = setInterval(fetchMessages, 3000);
    return () => clearInterval(pollingRef.current);
  }, [threadId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      await axiosInstance.post("/chat/send", { threadId, content: input });
      setInput("");
      // refresh immediately
      const res = await axiosInstance.get(`/chat/${threadId}`);
      setMessages(res.data.data.messages);
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Chat with Pharmacy</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            X
          </button>
        </div>
        <div className="h-64 overflow-y-auto border p-2 mb-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={msg.sender === "patient" ? "text-right" : "text-left"}
            >
              <p className="inline-block px-2 py-1 rounded bg-gray-200 mb-1">
                {msg.content}
              </p>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border p-2 rounded-l"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="px-4 bg-blue-600 text-white rounded-r hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWithPharmacy;
