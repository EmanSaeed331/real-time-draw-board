const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
let isDrawing = false;

// WebSocket connection
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
    console.log('Connected to the WebSocket server');
};

ws.onmessage = (message) => {
    console.log('Received message:', message); // Check what is being received
    try {
        const data = JSON.parse(message.data);
        drawFromServer(data);
    } catch (e) {
        console.error('Error parsing JSON:', e);
    }
};

// Start drawing
canvas.addEventListener('mousedown', () => isDrawing = true);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mousemove', draw);

// Draw function
function draw(event) {
    if (!isDrawing) return;

    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;

    // Send drawing data to the server
    const drawingData = { x, y };
    sendDrawingData(drawingData);
    drawOnCanvas(drawingData); // Draw immediately on own canvas
}

// Send drawing data to the server
function sendDrawingData(data) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    }
}

// Draw received data from server
function drawFromServer(data) {
    drawOnCanvas(data);
}

// Helper function to draw on canvas
function drawOnCanvas(data) {
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
}
