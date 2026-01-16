import { fromString, toString } from "uint8arrays";

/**
 * ChatRoom class - manages a pub/sub chat room
 */
export class ChatRoom {
  constructor(node, roomName, nickname) {
    this.node = node; // libp2p node
    this.roomName = roomName; // Room name (e.g., "emergency-room")
    this.nickname = nickname; // User's display name
    this.topic = `disasternet-room-${roomName}`; // Pub/sub topic
    this.messages = []; // Store all messages
    this.messageHandlers = []; // Callbacks for new messages
    this.peersInRoom = new Map(); // Track peer ID -> nickname mapping
  }

  /**
   * Subscribe to the chat room topic
   */
  async subscribe() {
    const pubsub = this.node.services.pubsub;

    // Subscribe to the topic
    pubsub.subscribe(this.topic);
    console.log(`📢 Subscribed to room: ${this.roomName}`);

    // Add ourselves to the peers map
    const peerId = this.node.peerId.toString().slice(-8);
    this.peersInRoom.set(peerId, this.nickname);

    // Listen for incoming messages
    pubsub.addEventListener("message", (event) => {
      // Only process messages for our topic
      if (event.detail.topic === this.topic) {
        try {
          // Convert binary data to string and parse JSON
          const messageData = JSON.parse(toString(event.detail.data));

          // Track the sender in peers map
          this.peersInRoom.set(messageData.senderId, messageData.sender);

          // Store message
          this.messages.push(messageData);

          // Notify all registered handlers
          this.messageHandlers.forEach((handler) => {
            handler(messageData);
          });

          // Log to console
          console.log(`💬 [${messageData.sender}]: ${messageData.message}`);
        } catch (err) {
          console.error("Error parsing message:", err);
        }
      }
    });
  }

  /**
   * Send a message to the chat room
   * @param {string} message - The message text
   * @returns {Object} The message data object
   */
  async sendMessage(message) {
    const pubsub = this.node.services.pubsub;

    // Create message object
    const messageData = {
      id: Date.now().toString(), // Unique ID
      sender: this.nickname, // Display name
      senderId: this.node.peerId.toString().slice(-8), // Short peer ID
      message: message, // Message text
      timestamp: new Date().toISOString(), // ISO timestamp
    };

    // Convert to binary format
    const data = fromString(JSON.stringify(messageData));

    // Broadcast to all subscribers
    await pubsub.publish(this.topic, data);

    return messageData;
  }

  /**
   * Register a callback for new messages
   * @param {Function} handler - Callback function
   */
  onMessage(handler) {
    this.messageHandlers.push(handler);
  }

  /**
   * Get all messages in the room
   * @returns {Array} Array of message objects
   */
  getMessages() {
    return this.messages;
  }

  /**
   * Get list of peers in this room with their nicknames
   * @returns {Array} Array of peer nicknames
   */
  getPeersInRoom() {
    return Array.from(this.peersInRoom.values());
  }
}
// SUMMARY :
// Creates a chat room using GossipSub
// Handles subscribing to topics
// Sends and receives messages
// Stores message history
