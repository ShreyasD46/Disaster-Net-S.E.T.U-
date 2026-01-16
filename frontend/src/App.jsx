import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./App.css";

// Backend URL - can be overridden by query parameter ?backend=http://localhost:PORT
const getBackendURL = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("backend") || "http://localhost:3001";
};

const BACKEND_URL = getBackendURL();

function App() {
  // State management
  const [messages, setMessages] = useState([]); // All chat messages
  const [inputMessage, setInputMessage] = useState(""); // Current input text
  const [connected, setConnected] = useState(false); // Connection status
  const [roomInfo, setRoomInfo] = useState(null); // Room information
  const [peers, setPeers] = useState([]); // Connected peers

  // Refs
  const socketRef = useRef(null); // Socket.IO connection
  const messagesEndRef = useRef(null); // For auto-scrolling

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Setup Socket.IO connection on component mount
  useEffect(() => {
    // Create Socket.IO connection
    socketRef.current = io(BACKEND_URL);

    // Connection established
    socketRef.current.on("connect", () => {
      setConnected(true);
      console.log("Connected to backend");
    });

    // Connection lost
    socketRef.current.on("disconnect", () => {
      setConnected(false);
    });

    // Receive initial messages
    socketRef.current.on("messages", (msgs) => {
      setMessages(msgs);
    });

    // Receive new message
    socketRef.current.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Fetch room info from REST API
    fetch(`${BACKEND_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => setRoomInfo(data))
      .catch(console.error);

    // Fetch peers every 3 seconds
    const peersInterval = setInterval(() => {
      fetch(`${BACKEND_URL}/api/chat/peers`)
        .then((res) => res.json())
        .then((data) => setPeers(data.peers || []))
        .catch(console.error);
    }, 3000);

    // Cleanup on component unmount
    return () => {
      socketRef.current?.disconnect();
      clearInterval(peersInterval);
    };
  }, []);

  // Send message handler
  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Send via Socket.IO
    socketRef.current.emit("sendMessage", inputMessage);
    setInputMessage("");
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>🆘 DisasterNet</h1>
        <p className="subtitle">Offline Emergency Communication</p>
        <div className="status">
          <span className={`dot ${connected ? "online" : "offline"}`}></span>
          {connected ? "Connected" : "Disconnected"}
          {roomInfo && ` • Room: ${roomInfo.room} • You: ${roomInfo.nickname}`}
        </div>
      </header>

      <div className="main-container">
        {/* Sidebar - Connected Peers */}
        <aside className="sidebar">
          <h3>📡 Connected Peers ({peers.length})</h3>
          <ul className="peers-list">
            {peers.length === 0 ? (
              <li className="no-peers">Discovering peers...</li>
            ) : (
              peers.map((peer, i) => (
                <li key={i} className="peer-item">
                  <span className="peer-dot"></span>
                  {peer}
                </li>
              ))
            )}
          </ul>
        </aside>

        {/* Main Chat Area */}
        <main className="chat-container">
          {/* Messages List */}
          <div className="messages">
            {messages.length === 0 ? (
              <div className="no-messages">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={msg.id || i}
                  className={`message ${
                    msg.senderId === roomInfo?.peerId ? "own" : ""
                  }`}
                >
                  <div className="message-header">
                    <span className="sender">{msg.sender}</span>
                    <span className="time">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="message-content">{msg.message}</div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={sendMessage} className="input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your emergency message..."
              disabled={!connected}
            />
            <button type="submit" disabled={!connected}>
              Send
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default App;
