# 🆘 DisasterNet - P2P Emergency Communication System

[![GitHub](https://img.shields.io/badge/GitHub-ShreyasD46-blue?style=flat-square&logo=github)](https://github.com/ShreyasD46/Disaster-Net-S.E.T.U-)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Node](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue?style=flat-square&logo=react)](https://react.dev/)

> **A decentralized, peer-to-peer emergency communication platform that works offline and enables disaster-resilient messaging between multiple users without relying on centralized servers.**

---

## 🎯 Problem Statement

In disaster scenarios, traditional centralized communication infrastructure (cellular networks, internet) often fails. Affected communities need a **resilient, decentralized communication system** that:
- ✅ Works **without internet connectivity**
- ✅ Requires **no central server** to operate
- ✅ **Self-discovers** nearby peers automatically
- ✅ **Scales** across multiple devices in a local network

**DisasterNet solves this** by leveraging peer-to-peer networking and mesh communication patterns.

---

## ✨ Key Features

### 🔗 **Decentralized Architecture**
- No central server required - every node is equal
- Gossip-based pub/sub messaging (GossipSub)
- Automatic peer discovery using mDNS
- Network resilient - works with any topology

### 💬 **Real-Time Messaging**
- Socket.IO for instant frontend-backend communication
- GossipSub protocol for P2P message broadcasting
- Message history persistence
- Multi-room support

### 🔍 **Peer Discovery**
- Automatic peer detection via mDNS (Multicast DNS)
- Live peer list with user nicknames
- Connected peers visible in real-time UI
- Service tag-based network segmentation

### 🎨 **Modern UI**
- React + Vite for fast development
- Responsive dark-themed chat interface
- Real-time connection status indicator
- Auto-scrolling message feed with animations

### 🛡️ **Security**
- Noise protocol for encrypted peer connections
- Secure communication between nodes
- Stream multiplexing with Yamux

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Chat UI | Connection Status | Peer List | Messages │   │
│  └──────────────┬──────────────────────────────────────┘   │
│                 │                                            │
│            Socket.IO (WebSocket)                            │
│                 │                                            │
├─────────────────┼──────────────────────────────────────────┤
│        BACKEND (Node.js + libp2p)                           │
│  ┌─────────────┴──────────────┐                            │
│  │   Express Server + Socket.IO│                           │
│  │   REST API + WebSocket      │                           │
│  └─────────────┬──────────────┘                            │
│                │                                            │
│  ┌─────────────▼──────────────────────────────────────┐   │
│  │         P2P Network Layer (libp2p)                  │   │
│  │                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │ GossipSub    │  │ mDNS         │               │   │
│  │  │ Messaging    │  │ Discovery    │               │   │
│  │  └──────────────┘  └──────────────┘               │   │
│  │                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │ Noise        │  │ Yamux        │               │   │
│  │  │ Encryption   │  │ Multiplexing │               │   │
│  │  └──────────────┘  └──────────────┘               │   │
│  │                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │ TCP Transport│  │ WebSocket    │               │   │
│  │  │              │  │ Transport    │               │   │
│  │  └──────────────┘  └──────────────┘               │   │
│  └─────────────┬──────────────────────────────────────┘   │
│                │                                            │
│                ├──────────────────────────────────────────┐│
│                │ P2P Network (mesh topology)              ││
│                │                                          ││
│         ┌──────▼─────┐              ┌──────────────┐    ││
│         │  Node 1    │◄────P2P───────► Node 2      │    ││
│         │ (Alice)    │  (gossipsub)  │ (Bob)       │    ││
│         └────────────┘              └──────────────┘    ││
│                                                          ││
│                                        ┌────────────┐   ││
│                                        │  Node 3    │   ││
│                                        │ (Charlie)  │   ││
│                                        └────────────┘   ││
│                                                          ││
└──────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **Vite** | Lightning-fast build tool |
| **Socket.IO Client** | Real-time communication |
| **CSS3** | Responsive styling |

### **Backend**
| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime |
| **Express.js** | REST API server |
| **Socket.IO** | WebSocket server |
| **libp2p** | P2P networking |
| **GossipSub** | Distributed pub/sub messaging |
| **mDNS** | Automatic peer discovery |
| **Noise** | Encrypted connections |
| **Yamux** | Stream multiplexing |

---

## 📁 Project Structure

```
DISASTERNET/
├── backend/                          # P2P node 1
│   ├── src/
│   │   ├── index.js                 # Main entry point
│   │   ├── p2p/
│   │   │   ├── host.js              # libp2p node creation
│   │   │   ├── mdns.js              # Peer discovery
│   │   │   └── pubsub.js            # GossipSub chat room
│   │   ├── routes/
│   │   │   └── chat.js              # REST API endpoints
│   │   └── utils/
│   │       └── logger.js            # Message logging
│   ├── logs/
│   │   └── messages.txt             # Message history
│   ├── .env                         # Configuration
│   └── package.json
│
├── backend2/                         # P2P node 2 (for testing)
│   └── [Same structure as backend/]
│
├── frontend/                         # React app
│   ├── src/
│   │   ├── App.jsx                  # Main component
│   │   ├── App.css                  # Styling
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── public/                      # Static assets
│   ├── index.html                   # HTML template
│   ├── vite.config.js               # Vite configuration
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

---

## 🚀 Quick Start

### **Prerequisites**
- **Node.js** 18+ and npm
- **Git**

### **Installation**

```bash
# Clone the repository
git clone https://github.com/ShreyasD46/Disaster-Net-S.E.T.U-.git
cd DISASTERNET

# Install dependencies
cd backend && npm install
cd ../backend2 && npm install
cd ../frontend && npm install
cd ..
```

### **Running Multi-User Demo**

Open **3 separate terminal windows** at the project root:

**Terminal 1 - Backend Instance 1 (Alice):**
```bash
cd backend
PORT=9000 HTTP_PORT=3001 NICK="Alice" npm start
```
Wait for: `✅ DisasterNet is ready!`

**Terminal 2 - Backend Instance 2 (Bob):**
```bash
cd backend2
PORT=9001 HTTP_PORT=3002 NICK="Bob" npm start
```
Wait for: `✅ DisasterNet is ready!`

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```
Wait for: `➜ Local: http://localhost:5173/`

### **Open Browser Tabs**

- **Alice's Chat:** `http://localhost:5173/?backend=http://localhost:3001`
- **Bob's Chat:** `http://localhost:5173/?backend=http://localhost:3002`

### **Test It**
- Alice and Bob should see each other in "Connected Peers"
- Send messages between tabs in real-time
- Messages persist across page reloads

---

## 📊 How It Works

### **Peer Discovery Flow**
```
Backend 1 (Port 9000)
    ↓ mDNS broadcast
    └─→ "disasternet-mdns" service discovered
        ↓
Backend 2 (Port 9001)
    ↓ mDNS broadcast
    └─→ Services synchronized
        ↓
    Both nodes are now connected!
```

### **Message Broadcasting**
```
User sends message in Alice's Chat
    ↓
Socket.IO → Backend 1 (Alice)
    ↓
GossipSub publishes to topic: "disasternet-room-emergency-room"
    ↓
All subscribed nodes receive (Backend 2, Backend 1)
    ↓
Backend 2 notifies Bob's frontend via Socket.IO
    ↓
Message appears in Bob's Chat UI
```

---

## 🎓 Learning Outcomes

This project demonstrates expertise in:

### **Distributed Systems**
- ✅ Peer-to-peer networking architecture
- ✅ Gossip protocols and epidemic broadcasting
- ✅ Decentralized consensus without central coordinator
- ✅ Network resilience and fault tolerance

### **System Design**
- ✅ Microservices communication (REST + WebSocket)
- ✅ Real-time message propagation
- ✅ Service discovery patterns
- ✅ Multi-tier architecture (Frontend → Backend → P2P)

### **Security**
- ✅ Encrypted peer connections (Noise protocol)
- ✅ Secure communication channels
- ✅ Network isolation via service tags

### **Full-Stack Development**
- ✅ Modern React frontend with Vite
- ✅ Node.js backend with Express
- ✅ Real-time communication with Socket.IO
- ✅ API design (REST endpoints)

### **DevOps & Deployment**
- ✅ Multi-instance orchestration
- ✅ Environment-based configuration
- ✅ Container-ready architecture

---

## 🔧 API Endpoints

### **REST API**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server status & node info |
| `GET` | `/api/chat/messages` | Fetch message history |
| `POST` | `/api/chat/send` | Send a message |
| `GET` | `/api/chat/peers` | Get connected peers |
| `GET` | `/api/chat/info` | Room information |

### **Socket.IO Events**

| Event | Direction | Payload |
|-------|-----------|---------|
| `connect` | Client → Server | - |
| `disconnect` | Client → Server | - |
| `sendMessage` | Client → Server | `{message: string}` |
| `messages` | Server → Client | `[{id, sender, message, timestamp}]` |
| `newMessage` | Server → Client | `{id, sender, message, timestamp}` |

---

## 📈 Scalability

This architecture can scale to:
- **Local Networks:** 10-50 nodes (residential/small community)
- **Campus/Organization:** 100+ nodes with proper network segmentation
- **Large Deployment:** 1000+ nodes with multiple service tag zones

---

## 🚀 Future Enhancements

- [ ] **End-to-End Encryption** - Message-level encryption between users
- [ ] **File Sharing** - P2P file transfer during disasters
- [ ] **Mobile Apps** - React Native for iOS/Android
- [ ] **Offline Storage** - SQLite for message persistence
- [ ] **Voice/Video** - WebRTC integration
- [ ] **Blockchain Verification** - Message authenticity via blockchain
- [ ] **Web3 Integration** - Decentralized identity management
- [ ] **Dashboard** - Network visualization and monitoring

---

## 🐛 Troubleshooting

### **"Connected Peers: 0" on both sides**
- Ensure both backend instances are running
- Check they have the same `SERVICE_TAG` in `.env`
- Verify ports 9000-9001 are not blocked by firewall

### **Messages not appearing**
- Check WebSocket connection (DevTools → Network → WS)
- Verify backend is receiving messages (check console logs)
- Ensure both instances are on the same local network

### **Port already in use**
```bash
# Windows: Find and kill process on port
netstat -ano | findstr :9000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :9000
kill -9 <PID>
```

---

## 📝 Environment Variables

### **Backend Configuration** (`.env`)
```
PORT=9000                  # P2P network port
HTTP_PORT=3001             # Express server port
ROOM=emergency-room        # Chat room name
NICK=Rescuer1              # User nickname
SERVICE_TAG=disasternet-mdns # Network identifier
```

---

## 📚 References

- [libp2p Documentation](https://docs.libp2p.io/)
- [GossipSub Protocol](https://github.com/libp2p/specs/tree/master/pubsub/gossipsub)
- [mDNS Specification](https://datatracker.ietf.org/doc/html/rfc6762)
- [Noise Protocol Framework](https://noiseprotocol.org/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [React Documentation](https://react.dev/)

---

## 👨‍💻 Author

**Shreyas D**
- GitHub: [@ShreyasD46](https://github.com/ShreyasD46)
- LinkedIn: [Shreyas D](https://linkedin.com/in/shreyas-d)

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

## ⭐ Show Your Support

If this project helped you or you find it interesting:
- **Star** ⭐ the repository
- **Fork** 🍴 and contribute
- **Share** 🚀 with others interested in distributed systems

---

**Built with ❤️ for resilient emergency communication**
