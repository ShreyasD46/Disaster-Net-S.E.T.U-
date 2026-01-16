/**
 * Sets up event listeners for peer discovery and connection
 * @param {Libp2p} node - The libp2p node
 * @param {Function} onPeerDiscovered - Callback when a peer is discovered
 */
export function setupMdnsDiscovery(node, onPeerDiscovered) {
  // Triggered when MDNS discovers a new peer on the network
  node.addEventListener('peer:discovery', (event) => {
    const peerId = event.detail.id.toString();
    console.log(`🔍 Discovered peer: ${peerId.slice(-8)}`);
    
    // Call the callback if provided
    if (onPeerDiscovered) {
      onPeerDiscovered(event.detail);
    }
  });

  // Triggered when successfully connected to a peer
  node.addEventListener('peer:connect', (event) => {
    const peerId = event.detail.toString();
    console.log(`✅ Connected to peer: ${peerId.slice(-8)}`);
  });

  // Triggered when disconnected from a peer
  node.addEventListener('peer:disconnect', (event) => {
    const peerId = event.detail.toString();
    console.log(`❌ Disconnected from peer: ${peerId.slice(-8)}`);
  });
}

/**
 * Get list of currently connected peers
 * @param {Libp2p} node - The libp2p node
 * @returns {Array} Array of peer objects with id and shortId
 */
export function getConnectedPeers(node) {
  const peers = node.getPeers();
  return peers.map(peer => ({
    id: peer.toString(),
    shortId: peer.toString().slice(-8)  // Last 8 chars for display
  }));
}

// SUMMARY
// Listens for peer discovery events
// Logs when peers connect/disconnect
// Provides function to get list of connected peers