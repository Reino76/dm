const express = require("express");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");
const os = require("os");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Check for IPv4 and non-internal addresses
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
}

// --- Optimization ---
// Define the path to the public directory
// This now correctly joins the current directory (__dirname) with 'public'
const publicDir = path.join(__dirname, 'public');

// Serve all static files (html, css, js) from the dm/public directory
app.use(express.static(publicDir));

// Serve index.html as the root
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

// API endpoint to get the local IP
app.get("/api/ip", (req, res) => {
  const localIp = getLocalIp();
  res.json({ ip: localIp });
});

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
  console.log(`Share with players on your network via http://${getLocalIp()}:${PORT}/player`);
});

