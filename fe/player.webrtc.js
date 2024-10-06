// Player side - Only sending the stream

const shareScreenBtn = document.getElementById('shareScreenBtn');
const statusText = document.getElementById('status');

// TODO: Update the WebSocket URL for production if necessary
const socket = new WebSocket('ws://localhost:8080/ws');

// WebRTC peer connection (no ICE servers as per your requirements)
let peerConnection = new RTCPeerConnection();

// When WebSocket is connected
socket.onopen = () => {
  console.log('Connected to WebSocket signaling server');
};

// Listen for messages from the server (for handling answers or ICE candidates)
socket.onmessage = (message) => {
  const data = JSON.parse(message.data);

  if (data.type === 'answer') {
    handleAnswer(data.answer);  // Handle the answer from the mod
  }
};

// Function to start screen sharing
async function startScreenSharing() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false
    });

    // Add the screen stream to the peer connection
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

    // Create an offer and send it to the signaling server (WebSocket)
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Send the offer to the mod via WebSocket
    socket.send(JSON.stringify({
      type: 'offer',
      offer: peerConnection.localDescription
    }));

    statusText.textContent = "Screen sharing started...";
    console.log("Offer sent to WebSocket");

  } catch (error) {
    console.error("Error sharing screen: ", error);
    statusText.textContent = "Error sharing screen.";
  }
}

// Handle the WebRTC answer from the mod
function handleAnswer(answer) {
  peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

// Add click listener to the "Share Screen" button
shareScreenBtn.addEventListener('click', startScreenSharing);
