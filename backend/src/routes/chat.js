import express from 'express';

/**
 * Creates Express router with chat API endpoints
 * @param {ChatRoom} chatRoom - The ChatRoom instance
 * @returns {Router} Express router
 */
export function createChatRoutes(chatRoom) {
  const router = express.Router();

  // GET /api/chat/messages - Get all messages
  router.get('/messages', (req, res) => {
    res.json({
      success: true,
      messages: chatRoom.getMessages()
    });
  });

  // POST /api/chat/send - Send a new message
  router.post('/send', async (req, res) => {
    try {
      const { message } = req.body;
      
      // Validate message
      if (!message || !message.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Message is required'
        });
      }

      // Send via P2P
      const sentMessage = await chatRoom.sendMessage(message);
      
      res.json({
        success: true,
        message: sentMessage
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // GET /api/chat/peers - Get connected peers
  router.get('/peers', (req, res) => {
    res.json({
      success: true,
      peers: chatRoom.getPeersInRoom()
    });
  });

  // GET /api/chat/info - Get room information
  router.get('/info', (req, res) => {
    res.json({
      success: true,
      room: chatRoom.roomName,
      nickname: chatRoom.nickname,
      peerId: chatRoom.node.peerId.toString().slice(-8),
      peersCount: chatRoom.getPeersInRoom().length
    });
  });

  return router;
}
// SUMMARY
// Creates REST API endpoints for the frontend
// /messages - Get all messages
// /send - Send new message
// /peers - Get connected peers
// /info - Get room info