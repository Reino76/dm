const express = require("express");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");
const os = require("os");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const localIp = (() => {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
})();

const publicDir = path.join(__dirname, 'public');

// Serve all static files (html, css, js) from the dm/public directory
app.use(express.static(publicDir));

// Serve the player.html file
app.get("/player", (req, res) => {
  res.sendFile(path.join(publicDir, "player.html"));
});

// WebSocket logic: Broadcast messages to all *other* clients
wss.on("connection", socket => {
  console.log("Client connected.");
  
  socket.on("message", msg => {
    // Convert message to string
    const msgString = msg.toString();
    
    // Broadcast to all other clients
    wss.clients.forEach(client => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(msgString);
      }
    });
  });
  
  socket.on("close", () => {
    console.log("Client disconnected.");
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`✅ DM Screen running on http://localhost:${PORT}`);
  console.log(`Share with players on your network via http://${localIp}:${PORT}/player`);
});

