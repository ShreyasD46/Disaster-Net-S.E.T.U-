import { createLibp2p } from 'libp2p';
import { tcp } from '@libp2p/tcp';
import { webSockets } from '@libp2p/websockets';
import { mdns } from '@libp2p/mdns';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { identify } from '@libp2p/identify';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';

/**
 * Creates a libp2p node (peer) that can connect to other peers
 * @param {number} port - Port number to listen on
 * @param {string} serviceTag - MDNS service tag for discovery
 * @returns {Promise<Libp2p>} The created libp2p node
 */
export async function createHost(port, serviceTag) {
  const node = await createLibp2p({
    // Network addresses to listen on
    addresses: {
      listen: [
        `/ip4/0.0.0.0/tcp/${port}`,           // TCP on specified port
        `/ip4/0.0.0.0/tcp/${port + 1}/ws`     // WebSocket on port+1
      ]
    },
    
    // Transport protocols (how to connect)
    transports: [
      tcp(),        // Standard TCP connections
      webSockets()  // WebSocket connections
    ],
    
    // Encryption for secure communication
    connectionEncryption: [noise()],
    
    // Stream multiplexing (multiple streams over one connection)
    streamMuxers: [yamux()],
    
    // Peer discovery mechanisms
    peerDiscovery: [
      mdns({
        interval: 1000,      // Check for peers every second
        serviceTag: serviceTag // Only discover peers with same tag
      })
    ],
    
    // Services running on this node
    services: {
      identify: identify(),  // Identify protocol for peer info
      pubsub: gossipsub({    // Messaging protocol
        allowPublishToZeroPeers: true,  // Allow sending even with no peers
        emitSelf: true                  // Receive own messages (for testing)
      })
    }
  });

  return node;
}
// SUMMARY:
// Creates a libp2p peer that can connect to other peers
// Sets up TCP and WebSocket transports
// Configures MDNS for automatic peer discovery
// Enables GossipSub for message broadcasting

