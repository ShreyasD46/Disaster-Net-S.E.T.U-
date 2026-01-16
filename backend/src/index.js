import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";

// Import our modules
import { createHost } from "./p2p/host.js";
import { setupMdnsDiscovery, getConnectedPeers } from "./p2p/mdns.js";
import { ChatRoom } from "./p2p/pubsub.js";
import { createChatRoutes } from "./routes/chat.js";
import { logMessage } from "./utils/logger.js";

// Load environment variables from .env file
dotenv.config();

// Configuration from environment variables
const PORT = parseInt(process.env.PORT) || 9000;
const HTTP_PORT = parseInt(process.env.HTTP_PORT) || 3001;
const ROOM_NAME = process.env.ROOM || "emergency-room";
// Generate a unique nickname if not provided
const NICKNAME =
  process.env.NICK ||
  `User-${Math.random().toString(36).substring(7).toUpperCase()}`;
const SERVICE_TAG = process.env.SERVICE_TAG || "disasternet-mdns";

console.log(`\n⚙️  Configuration:`);
console.log(`   P2P Port: ${PORT}`);
console.log(`   HTTP Port: ${HTTP_PORT}`);
console.log(`   User: ${NICKNAME}`);
console.log(`   Room: ${ROOM_NAME}\n`);

async function main() {
  console.log("🚀 Starting DisasterNet...\n");

  // ============ Step 1: Create P2P Node ============
  console.log("📡 Creating P2P node...");
  const node = await createHost(PORT, SERVICE_TAG);
  await node.start();

  console.log(`✅ Node started with ID: ${node.peerId.toString().slice(-8)}`);
  console.log(`📍 Listening on port: ${PORT}`);

  // Print all network addresses
  console.log("\n📬 Multiaddresses:");
  node.getMultiaddrs().forEach((addr) => {
    console.log(`   ${addr.toString()}`);
  });

  // ============ Step 2: Setup MDNS Discovery ============
  console.log("\n🔍 Setting up MDNS discovery...");
  setupMdnsDiscovery(node, (peerInfo) => {
    // Automatically try to connect to discovered peers
    node.dial(peerInfo.id).catch((err) => {
      console.log(`Could not dial peer: ${err.message}`);
    });
  });

  // ============ Step 3: Create Chat Room ============
  console.log(`\n💬 Joining room: ${ROOM_NAME} as "${NICKNAME}"`);
  const chatRoom = new ChatRoom(node, ROOM_NAME, NICKNAME);
  await chatRoom.subscribe();

  // Log all messages to file
  chatRoom.onMessage((msg) => {
    logMessage(msg);
  });

  // ============ Step 4: Setup Express Server ============
  const app = express();
  const server = http.createServer(app);

  // Middleware
  app.use(cors()); // Allow cross-origin requests
  app.use(express.json()); // Parse JSON request bodies

  // API Routes
  app.use("/api/chat", createChatRoutes(chatRoom));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "online",
      peerId: node.peerId.toString().slice(-8),
      room: ROOM_NAME,
      nickname: NICKNAME,
      peers: getConnectedPeers(node).length,
    });
  });

  // ============ Step 5: Setup Socket.IO for Real-time ============
  const io = new Server(server, {
    cors: { origin: "*" }, // Allow all origins (for development)
  });

  io.on("connection", (socket) => {
    console.log("🔌 Frontend connected via WebSocket");

    // Send existing messages to newly connected client
    socket.emit("messages", chatRoom.getMessages());

    // Handle messages from frontend
    socket.on("sendMessage", async (message) => {
      try {
        await chatRoom.sendMessage(message);
      } catch (err) {
        socket.emit("error", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔌 Frontend disconnected");
    });
  });

  // Forward P2P messages to all connected frontends
  chatRoom.onMessage((msg) => {
    io.emit("newMessage", msg);
  });

  // ============ Step 6: Start HTTP Server ============
  server.listen(HTTP_PORT, () => {
    console.log(`\n🌐 HTTP API running on http://localhost:${HTTP_PORT}`);
    console.log("\n============================================");
    console.log("DisasterNet is ready! Start chatting...");
    console.log("============================================\n");
  });
}

// Run the main function and catch any errors
main().catch(console.error);

// SUMMARY:
// Brings everything together - This is the heart of your backend
// Creates P2P node and starts it
// Sets up peer discovery
// Creates chat room
// Starts Express API server
// Sets up WebSocket connections for real-time updates
