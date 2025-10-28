
async function updatePlayerLink() {
  try {
    const res = await fetch("/api/ip");
    const data = await res.json();
    const link = `http://${data.ip}:8080/player`;
    document.getElementById("playerLink").value = link;
    document.getElementById("ipStatus").innerText =
      data.ip === "localhost"
        ? "⚠ Wi-Fi not detected — players must join via your browser"
        : `✅ Network Active: ${data.ip}`;
  } catch {
    document.getElementById("ipStatus").innerText = "❌ Cannot detect network";
  }
}

function copyPlayerLink() {
  const input = document.getElementById("playerLink");
  input.select();
  document.execCommand("copy");
}

updatePlayerLink();
setInterval(updatePlayerLink, 3000);
