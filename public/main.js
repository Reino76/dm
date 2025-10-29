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
  setupRoadmap();

  // Collapsible Cards
  setupCollapsibleCards();

  // Omen Roller
  setupOmenRoller();

  // Guild Selection
  setupGuildSelection();

  // Guild Name Generator
  setupGuildNameGenerator();
});

// --- WebSockets ---
function setupWebSocket() {
  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  ws = new WebSocket(`${wsProtocol}//${window.location.host}`);

  ws.onopen = () => {
    console.log("WebSocket connected.");
    broadcastGameChange(localStorage.getItem("gameSystem") || "Dread Nights");
  };
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "initiative-update") {
      const isNewItem = data.payload.length > initiativeList.length;
      initiativeList = data.payload;
      renderInitiativeList(isNewItem); 
    }
  };
  ws.onclose = () => {
    console.log("WebSocket disconnected. Attempting to reconnect...");
    setTimeout(setupWebSocket, 3000);
  };
}

function broadcastInitiativeList() {
  const currentGame = localStorage.getItem("gameSystem") || "Dread Nights";
  if (currentGame !== "D&D 5e") return;
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "initiative-update", payload: initiativeList }));
  }
}

function broadcastGameChange(gameName) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "game-change", payload: gameName }));
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

  tabs.forEach(btn => btn.addEventListener("click", () => showTab(btn.dataset.tab)));
  showTab("tab-prep");
}

// --- Initiative ---
function setupInitiativeTracker() {
  const addBtn = document.getElementById("add-to-init");
  const sortBtn = document.getElementById("sort-init");
  const clearBtn = document.getElementById("clear-init");
  
  if(addBtn) addBtn.addEventListener("click", addToInitiative);
  if(sortBtn) sortBtn.addEventListener("click", sortInitiative);
  if(clearBtn) clearBtn.addEventListener("click", clearInitiative);
}

function addToInitiative() {
  const nameEl = document.getElementById("init-name");
  const rollEl = document.getElementById("init-roll");
  const classEl = document.getElementById("init-class");
  const name = nameEl.value.trim();
  const roll = parseInt(rollEl.value, 10);
  const iconClass = classEl.value;

  if (name && !isNaN(roll)) {
    initiativeList.push({ name, roll, iconClass });
    nameEl.value = "";
    rollEl.value = "";
    renderInitiativeList(true);
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
  if(!listEl) return;
  listEl.innerHTML = "";

  initiativeList.forEach((item, index) => {
    const li = document.createElement("li");
    const infoDiv = document.createElement("div");
    infoDiv.className = "init-info";
    const icon = document.createElement("i");
    icon.className = item.iconClass;
    infoDiv.appendChild(icon);
    const nameSpan = document.createElement("span");
    nameSpan.className = "init-name";
    nameSpan.textContent = item.name;
    infoDiv.appendChild(nameSpan);
    li.appendChild(infoDiv);
    const rollSpan = document.createElement("span");
    rollSpan.className = "init-roll";
    rollSpan.textContent = item.roll;
    li.appendChild(rollSpan);

    if (animateNew && index === initiativeList.length - 1) {
      li.classList.add("new-item-pop");
      setTimeout(() => li.classList.remove("new-item-pop"), 600);
      const sparkleContainer = document.createElement("div");
      sparkleContainer.className = "sparkle-container";
      for (let i = 0; i < 5; i++) {
        const spark = document.createElement("span");
        spark.className = "spark";
        spark.style.transform = `rotate(${i * 72}deg)`; 
        sparkleContainer.appendChild(spark);
      }
      infoDiv.appendChild(sparkleContainer);
      setTimeout(() => sparkleContainer.remove(), 1000);
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

  showBtn.addEventListener("click", () => modal.classList.add("active"));
  closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });
}

// --- Player Link ---
async function setupPlayerLink() {
  const copyBtn = document.getElementById("copy-link-btn");
  const statusEl = document.getElementById("ipStatus");
  const linkEl = document.getElementById("playerLink");

  if(!copyBtn || !statusEl || !linkEl) return;

  copyBtn.addEventListener("click", copyPlayerLink);

  try {
    const res = await fetch("/api/ip");
    const data = await res.json();
    const link = `http://${data.ip}:8080/player`;
    linkEl.value = link;
    statusEl.innerText = data.ip === "localhost" ? "⚠ Wi-Fi not detected — players must join via browser" : `✅ Network Active: ${data.ip}`;
    statusEl.className = data.ip === "localhost" ? "status-warn" : "status-ok";
  } catch {
    statusEl.innerText = "❌ Cannot detect network";
    statusEl.className = "status-error";
  }
}

function copyPlayerLink() {
  const input = document.getElementById("playerLink");
  navigator.clipboard.writeText(input.value).then(() => {
    const copyBtn = document.getElementById("copy-link-btn");
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "Copied!";
    setTimeout(() => { copyBtn.textContent = originalText; }, 1500);
  }).catch(err => console.error("Failed to copy link: ", err));
}

// --- Settings ---
function setupSettings() {
  const gameSelect = document.getElementById("game-select");
  if(!gameSelect) return;

  const currentGame = localStorage.getItem("gameSystem") || "Dread Nights";
  gameSelect.value = currentGame;
  updateDmScreen(currentGame);

  gameSelect.addEventListener("change", () => {
    const selectedGame = gameSelect.value;
    localStorage.setItem("gameSystem", selectedGame);
    updateDmScreen(selectedGame);
    broadcastGameChange(selectedGame);
    if (selectedGame !== "D&D 5e") {
      clearInitiative();
    }
  });
}

function updateDmScreen(gameName) {
  const dndTracker = document.getElementById("dnd-initiative-tracker");
  const dreadNightsScreen = document.getElementById("dread-nights-active-screen");

  if(!dndTracker || !dreadNightsScreen) return;

  if (gameName === "D&D 5e") {
    dndTracker.style.display = "block";
    dreadNightsScreen.style.display = "none";
  } else {
    dndTracker.style.display = "none";
    dreadNightsScreen.style.display = "block";
  }
}

// --- NEW: Prep Roadmap ---
function setupRoadmap() {
    const roadmapSteps = document.querySelectorAll(".prep-roadmap-step");
    const contentSteps = document.querySelectorAll(".prep-content-step");
    const nextButtons = document.querySelectorAll(".prep-nav .btn-next-step");
    const prevButtons = document.querySelectorAll(".prep-nav .btn-prev-step");
    const resetButton = document.getElementById("reset-roadmap-new");

    function activateStep(stepId) {
        const id = parseInt(stepId, 10);

        roadmapSteps.forEach(step => {
            const currentStepId = parseInt(step.dataset.step, 10);
            step.classList.toggle('active', currentStepId === id);
            step.classList.toggle('completed', currentStepId < id);
        });

        contentSteps.forEach(content => {
            content.classList.toggle('active', content.dataset.stepContent === stepId);
        });
    }

    roadmapSteps.forEach(step => {
        step.addEventListener("click", () => {
            activateStep(step.dataset.step);
        });
    });

    nextButtons.forEach(button => {
        button.addEventListener("click", () => {
            activateStep(button.dataset.next);
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener("click", () => {
            activateStep(button.dataset.prev);
        });
    });
    
    if(resetButton){
        resetButton.addEventListener("click", () => activateStep("1"));
    }

    activateStep("1");
}

function setupCollapsibleCards() {
  const cardHeaders = document.querySelectorAll(".card-header");
  cardHeaders.forEach(header => {
    header.addEventListener("click", () => {
      const card = header.parentElement;
      card.classList.toggle("collapsed");
    });
  });
}

// --- Omen Roller ---
function setupOmenRoller() {
  const rollBtn = document.getElementById("roll-omen");
  const resultEl = document.querySelector("#omen-result span");

  if (!rollBtn || !resultEl) return;

  rollBtn.addEventListener("click", () => {
    rollBtn.classList.add("rolling");
    setTimeout(() => rollBtn.classList.remove("rolling"), 500);
    const result = Math.floor(Math.random() * 2) + 1;
    setTimeout(() => {
        resultEl.textContent = result;
        resultEl.parentElement.classList.add('tada');
        setTimeout(() => resultEl.parentElement.classList.remove('tada'), 700);
    }, 250);
  });
}

// --- Guild Selection ---
function setupGuildSelection() {
  const guildCards = document.querySelectorAll(".guild-card");
  if (guildCards.length === 0) return;
  guildCards.forEach(card => {
    card.addEventListener("click", () => {
      guildCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
    });
  });
}

// --- Guild Name Generator ---
const guildNamePart1 = [
  "The Bow", "The Legged", "The Dusty", "The Cossack", "The Crypt", "The Beast", "The Wet", "The Small", "The Tidy", "The Left",
  "The Right", "The Lockwith", "The Bay", "The Angels", "The Red", "The Blue", "The Green", "The Immature", "The Poor", "The Wise",
  "The Dead", "The Dense", "The Wednesday", "The Diabolical", "The Heavy", "The Panda", "The Penny", "The Dog", "The Cat", "The Dodo",
  "The Police", "The Faith", "The Hidden", "The Silly", "The Hog", "The Dice", "The Terrible", "The Awful", "The Beautiful", "The Appalling",
  "The Fearful", "The Grim", "The Silent", "The Long", "The Shocking", "The Harrowing", "The Shocking", "The Bloodless", "The Unspeakable", "The Stern",
  "The Cynical", "The Ghastly", "The Bright", "The Dark", "The Cruel", "The Kind", "The Dingy", "The Bleak", "The Raven", "The Poe",
  "The Dismal", "The Vicious", "The Savage", "The Broken", "The Fatalistic", "The Comedy", "The Neutral", "The Nameless", "The Sexy", "The Macabre",
  "The Concerning", "The Worried", "The Morbid", "The Happy", "The Swell", "The Down", "The Up", "The Savage", "The Brutal", "The Pig",
  "The Hatter", "The Mirthless", "The Mirthful", "The Harsh", "The Slack", "The Dutch", "The Unseen", "The Fresh", "The Breaded", "The Baked",
  "The Crusty", "The Grumpy", "The Austere", "The Barbarous", "The Surely", "The Scowling", "The Sulky", "The Sour", "The Cold", "The Grave"
];

const guildNamePart2 = [
  "Gang", "Crew", "Team", "Company", "Rooster", "Posse", "Corps", "Squad", "Crowd", "Collective",
  "Force", "Herd", "Pack", "Tables", "Party", "Band", "Horde", "Throng", "Mob", "Detachment",
  "Troop", "Faction", "Division", "Society", "Club", "League", "Circle", "Union", "Squares", "Box",
  "Association", "Inc.", "Ring", "Set", "Coterie", "Section", "Partnership", "Cooperative", "Consortium", "Pub",
  "Clique", "Batch", "Classification", "Class", "Category", "Guild", "Caucus", "Bloc", "Cabal", "Confederacy",
  "Junta", "Cell", "Sect", "Clan", "Fellowship", "Fraternity", "Sorority", "Community", "Syndicate", "Nucleus",
  "Commerce", "Society", "Lodge", "Affiliation", "Alliance", "Order", "Nation", "Federation", "Body", "College",
  "School", "Relation", "Family", "Connection", "Link", "Amalgamation", "Trust", "Charity", "Business", "Private Entity",
  "Cooperative", "Organization", "Structure", "Warband", "Administration", "Government", "Method", "System", "Operation", "Criminals",
  "Prison", "Firm", "Film", "Fast", "Zoo", "Click", "Balance", "Streets", "Ghosts", "Demons"
];

function setupGuildNameGenerator() {
    const input1 = document.getElementById("d100-input-1");
    const input2 = document.getElementById("d100-input-2");
    const resultEl = document.getElementById("guild-name-result"); // Corrected selector
    const modal = document.getElementById("name-tables-modal");
    const showModalBtn = document.getElementById("toggle-name-tables-modal");
    const closeModalBtn = document.getElementById("close-name-tables-modal");
    const tablesContainer = document.getElementById("name-tables-content-modal");

    if (!input1 || !input2 || !resultEl || !modal || !showModalBtn || !closeModalBtn || !tablesContainer) return;

    populateNameTables(tablesContainer);
    
    function generateName() {
        const roll1 = parseInt(input1.textContent, 10);
        const roll2 = parseInt(input2.textContent, 10);

        if (roll1 >= 1 && roll1 <= 100 && roll2 >= 1 && roll2 <= 100) {
            const name1 = guildNamePart1[roll1 - 1];
            const name2 = guildNamePart2[roll2 - 1];
            resultEl.innerHTML = `<span>${name1} ${name2}</span>`; // Use innerHTML
        } else {
            resultEl.innerHTML = "<span>-</span>"; // Use innerHTML
        }
    }

    input1.addEventListener("input", generateName);
    input2.addEventListener("input", generateName);

    showModalBtn.addEventListener("click", () => modal.classList.add("active"));
    closeModalBtn.addEventListener("click", () => modal.classList.remove("active"));
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
    });
}

function populateNameTables(container) {
  const table1 = createTableHtml(guildNamePart1, "Table 1");
  const table2 = createTableHtml(guildNamePart2, "Table 2 (Red)");
  container.innerHTML = `
    <div class="name-table-wrapper">${table1}</div>
    <div class="name-table-wrapper">${table2}</div>
  `;
}

function createTableHtml(data, caption) {
  let rows = data.map((name, index) => `<tr><td>${index + 1}</td><td>${name}</td></tr>`).join("");
  return `
    <table>
      <caption>${caption}</caption>
      <thead>
        <tr>
          <th>d100</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}