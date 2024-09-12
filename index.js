const WebSocket = require('ws');
const wws = new WebSocket.Server({port: 8080});

let clients = [];

wws.on('connection', (ws) => {
    clients.push(ws);
    console.log('new Client Connected');

   // server.js
   ws.on('message', (message) => {
    try {
        // Assuming message is a JSON string
        const data = JSON.parse(message); 
        // Broadcast the parsed object back as a JSON string
        const jsonString = JSON.stringify(data);
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(jsonString);
            }
        });
    } catch (e) {
        console.error('Error parsing message:', e);
    }
});
    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
    });
});
console.log('WebSocket Server Running on Port 8080');