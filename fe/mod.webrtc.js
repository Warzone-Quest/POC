// Mod side - Only receiving streams

const streamsContainer = document.getElementById('streamsContainer');
const statusText = document.getElementById('status');

// TODO: Update the WebSocket URL for production if necessary
const socket = new WebSocket('ws://localhost:8080/ws');

// Store multiple peer connections (one for each player)
let peerConnections = {};

// When WebSocket is connected
socket.onopen = () => {
  console.log('Connected to WebSocket signaling server');
  statusText.textContent = 'Waiting for players...';
};

// Listen for messages from the server (handling offers and ICE candidates)
socket.onmessage = (message) => {
  const data = JSON.parse(message.data);

  if (data.type === 'offer' && data.playerId) {
    handleOffer(data.offer, data.playerId);  // Handle the offer from the player
  }
};

// Handle WebRTC offer from the player
function handleOffer(offer, playerId) {
  const peerConnection = new RTCPeerConnection();  // No ICE servers

  // Store the peer connection by player ID
  peerConnections[playerId] = peerConnection;

  // Set the remote description (the offer from the player)
  peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
    .then(() => {
      return peerConnection.createAnswer();  // Create an answer
    })
    .then(answer => {
      return peerConnection.setLocalDescription(answer);  // Set the local description
    })
    .then(() => {
      // Send the answer back to the player via WebSocket
      socket.send(JSON.stringify({
        type: 'answer',
        answer: peerConnection.localDescription,
        playerId: playerId
      }));
    });

  // When a video stream is received from the player, display it
  peerConnection.ontrack = (event) => {
    const videoElement = document.createElement('video');
    videoElement.srcObject = event.streams[0];
    videoElement.autoplay = true;
    videoElement.playsInline = true;

    // Append the video element to the container
    streamsContainer.appendChild(videoElement);
  };
}
