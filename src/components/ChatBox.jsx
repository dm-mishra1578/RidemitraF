import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// 🔥 SOCKET OUTSIDE COMPONENT (IMPORTANT)
const socket = io("http://localhost:5000", {
  transports: ["websocket"],   // stable connection
});

export default function ChatBox({ chatId, disabled }) {

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!chatId) return;

    // 🔹 JOIN ROOM
    socket.emit("join", chatId);

    // 🔹 RECEIVE MESSAGE
    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", handleMessage);

    // 🔹 CLEANUP
    return () => {
      socket.off("receiveMessage", handleMessage);
    };

  }, [chatId]);

  // 🔹 SEND MESSAGE
  const send = () => {
    if (!text || disabled) return;

    socket.emit("sendMessage", {
      chatId,
      text,
    });

    // 🔹 OPTIONAL: local update
    setMessages((prev) => [...prev, { text }]);

    setText("");
  };

  return (
    <div className="border p-3 rounded mt-2 bg-gray-50">

      {/* MESSAGES */}
      <div className="h-40 overflow-y-auto mb-2">
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm">No messages</p>
        )}

        {messages.map((m, i) => (
          <p key={i} className="text-sm bg-white p-1 mb-1 rounded shadow">
            {m.text}
          </p>
        ))}
      </div>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          placeholder="Type message..."
          className="border p-2 flex-1 rounded"
        />

        <button
          onClick={send}
          disabled={disabled}
          className="bg-blue-600 text-white px-3 rounded"
        >
          Send
        </button>
      </div>

      {/* STATUS */}
      {disabled && (
        <p className="text-red-500 text-xs mt-1">
          Chat disabled (ride started)
        </p>
      )}

    </div>
  );
}