// --- State ---
let initiativeList = [];
let ws;

// --- DOM Elements ---
document.addEventListener("DOMContentLoaded", () => {
  // WebSocket Setup
  setupWebSocket();

  // Tab Logic
  setupTabs();

  // Initiative Tracker Logic
  setupInitiativeTracker();

  // Player Link Logic
  setupPlayerLink();
  setupPlayerLinkModal(); 
  
  // Settings Logic
  setupSettings();
  
  // Prep Roadmap Logic
  setupRoadmap(); // <!-- NEW
});

// --- WebSockets ---
function setupWebSocket() {
  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  ws = new WebSocket(`${wsProtocol}//${window.location.host}`);

  ws.onopen = () => console.log("WebSocket connected.");
  ws.onmessage = (event) => {
    // We only expect initiative lists
    const data = JSON.parse(event.data);
    if (data.type === "initiative-update") {
      // Check if a new item was added
      const isNewItem = data.payload.length > initiativeList.length;
      initiativeList = data.payload;
      // Pass the animation flag to the renderer
      renderInitiativeList(isNewItem); 
    }
  };
  ws.onclose = () => {
    console.log("WebSocket disconnected. Attempting to reconnect...");
    setTimeout(setupWebSocket, 3000); // Reconnect every 3 seconds
  };
}

function broadcastInitiativeList() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: "initiative-update",
      payload: initiativeList
    }));
  }
}

// --- Tabs ---
function setupTabs() {
  const tabs = document.querySelectorAll(".tab-button");
  const contents = document.querySelectorAll(".tab-content");

  function showTab(tabId) {
    contents.forEach(c => c.classList.remove('active'));
    tabs.forEach(b => b.classList.remove('active'));

    const content = document.getElementById(tabId);
    const tab = document.querySelector(`[data-tab="${tabId}"]`);
    
    if (content) content.classList.add('active');
    if (tab) tab.classList.add('active');
  }

  tabs.forEach(btn => btn.addEventListener("click", () => {
    showTab(btn.dataset.tab);
  }));

  // Show the first tab by default
  showTab("tab-prep");
}

// --- Initiative ---
function setupInitiativeTracker() {
  const addBtn = document.getElementById("add-to-init");
  const sortBtn = document.getElementById("sort-init");
  const clearBtn = document.getElementById("clear-init");
  
  addBtn.addEventListener("click", addToInitiative);
  sortBtn.addEventListener("click", sortInitiative);
  clearBtn.addEventListener("click", clearInitiative);
}

function addToInitiative() {
  const nameEl = document.getElementById("init-name");
  const rollEl = document.getElementById("init-roll");
  // Get the new class icon dropdown
  const classEl = document.getElementById("init-class");

  const name = nameEl.value.trim();
  const roll = parseInt(rollEl.value, 10);
  // Get the selected icon class name (e.g., "fas fa-gavel")
  const iconClass = classEl.value;

  if (name && !isNaN(roll)) {
    // Add the iconClass to our state object
    initiativeList.push({ name, roll, iconClass });
    nameEl.value = "";
    rollEl.value = "";
    renderInitiativeList(true); // Animate the new item
    broadcastInitiativeList();
  }
}

function sortInitiative() {
  initiativeList.sort((a, b) => b.roll - a.roll);
  renderInitiativeList(false);
  broadcastInitiativeList();
}

function clearInitiative() {
  initiativeList = [];
  renderInitiativeList(false);
  broadcastInitiativeList();
}

function renderInitiativeList(animateNew) {
  const listEl = document.getElementById("initiative-list");
  listEl.innerHTML = ""; // Clear existing list

  initiativeList.forEach((item, index) => {
    const li = document.createElement("li");

    // --- NEW: Icon + Name Container ---
    const infoDiv = document.createElement("div");
    infoDiv.className = "init-info";

    // Create the icon
    const icon = document.createElement("i");
    icon.className = item.iconClass; // e.g., "fas fa-gavel"
    infoDiv.appendChild(icon);

    // Create the name
    const nameSpan = document.createElement("span");
    nameSpan.className = "init-name";
    nameSpan.textContent = item.name;
    infoDiv.appendChild(nameSpan);

    li.appendChild(infoDiv);
    // --- End of new container ---

    const rollSpan = document.createElement("span");
    rollSpan.className = "init-roll";
    rollSpan.textContent = item.roll;
    li.appendChild(rollSpan);

    // --- UPDATED ANIMATION ---
    if (animateNew && index === initiativeList.length - 1) {
      // 1. The card pop-in animation
      li.classList.add("new-item-pop");
      setTimeout(() => li.classList.remove("new-item-pop"), 600);
      
      // 2. The new "Sparkle Burst" animation
      const sparkleContainer = document.createElement("div");
      sparkleContainer.className = "sparkle-container";
      
      // Create 5 sparks
      for (let i = 0; i < 5; i++) {
        const spark = document.createElement("span");
        spark.className = "spark";
        // Each spark is rotated to fly in a different direction
        spark.style.transform = `rotate(${i * 72}deg)`; 
        sparkleContainer.appendChild(spark);
      }
      
      // Add container to the icon
      infoDiv.appendChild(sparkleContainer);

      // Remove the sparkle container after animation
      setTimeout(() => {
        sparkleContainer.remove();
      }, 1000);
    }

    listEl.appendChild(li);
  });
}

// --- Player Link Modal ---  
function setupPlayerLinkModal() {
  const modal = document.getElementById("player-link-modal");
  const showBtn = document.getElementById("show-player-link-btn");
  const closeBtn = document.getElementById("close-modal-btn");

  if (!modal || !showBtn || !closeBtn) return;

  showBtn.addEventListener("click", () => {
    modal.classList.add("active");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  // Close modal if user clicks on the overlay
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
}

// --- Player Link ---
async function setupPlayerLink() {
  const copyBtn = document.getElementById("copy-link-btn");
  const statusEl = document.getElementById("ipStatus");
  const linkEl = document.getElementById("playerLink");

  copyBtn.addEventListener("click", copyPlayerLink);

  try {
    const res = await fetch("/api/ip");
    const data = await res.json();
    const link = `http://${data.ip}:8080/player`;
    linkEl.value = link;
    
    if (data.ip === "localhost") {
      statusEl.innerText = "⚠ Wi-Fi not detected — players must join via browser";
      statusEl.className = "status-warn";
    } else {
      statusEl.innerText = `✅ Network Active: ${data.ip}`;
      statusEl.className = "status-ok";
    }
  } catch {
    statusEl.innerText = "❌ Cannot detect network";
    statusEl.className = "status-error";
  }
}

function copyPlayerLink() {
  const input = document.getElementById("playerLink");
  // Use modern clipboard API
  navigator.clipboard.writeText(input.value).then(() => {
    const copyBtn = document.getElementById("copy-link-btn");
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 1500);
  }).catch(err => {
    console.error("Failed to copy link: ", err);
  });
}

// --- Settings ---
function setupSettings() {
  const gameSelect = document.getElementById("game-select");
  const gameTitle = document.getElementById("game-title");
  
  // Set the game to "Dread Nights" as it's the only option
  const currentGame = "Dread Nights";
  gameSelect.value = currentGame;
  gameTitle.textContent = currentGame;
  localStorage.setItem("gameSystem", currentGame); // Ensure it's saved

  // Event listener is no longer needed as the dropdown is disabled
  // gameSelect.addEventListener("change", () => {
  //   const selectedGame = gameSelect.value;
  //   gameTitle.textContent = selectedGame;
  //   localStorage.setItem("gameSystem", selectedGame);
  // });
}

// --- NEW: Prep Roadmap ---
function setupRoadmap() {
  const nextButtons = document.querySelectorAll(".btn-next-step");
  const resetButton = document.getElementById("reset-roadmap");
  
  nextButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      const currentStep = e.target.closest('.roadmap-step');
      const nextStepId = e.target.dataset.next;
      
      if (currentStep) {
        currentStep.classList.remove('active');
        currentStep.classList.add('completed');
      }
      
      if (nextStepId) {
        const nextStep = document.querySelector(`.roadmap-step[data-step="${nextStepId}"]`);
        if (nextStep) {
          nextStep.classList.add('active');
        }
      }
    });
  });

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      const allSteps = document.querySelectorAll('.roadmap-step');
      allSteps.forEach(step => {
        step.classList.remove('active', 'completed');
      });
      // Activate the first step
      const firstStep = document.querySelector('.roadmap-step[data-step="1"]');
      if (firstStep) {
        firstStep.classList.add('active');
      }
    });
  }
}

