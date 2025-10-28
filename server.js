
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
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
}

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/ip", (req, res) => {
  const localIp = getLocalIp();
  res.json({ ip: localIp });
});

app.get("/player", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "player.html"));
});

wss.on("connection", socket => {
  socket.on("message", msg => {
    wss.clients.forEach(client => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(msg.toString());
      }
    });
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`✅ DM Screen running on http://localhost:${PORT}`);
});
