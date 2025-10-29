/**
 * main.js
 *
 * Core logic for the DM Screen application.
 * This file is structured to be modular, efficient, and maintainable.
 *
 * 1. Waits for DOM to load.
 * 2. Caches all DOM elements into a single 'DOM' object.
 * 3. Initializes all application modules (Tabs, WebSockets, Generators, etc.).
 * 4. Uses a 'state' object to manage application state (initiativeList, ws).
 */

// Wait for the DOM to be fully loaded before running any script
document.addEventListener("DOMContentLoaded", () => {
  
  // Application state container
  const state = {
    initiativeList: [],
    ws: null,
    merchantMode: localStorage.getItem("merchantModeActive") === "true",
  };

  // Centralized DOM element references
  const DOM = cacheDOMElements();

  // Initialize all application components
  initApp(DOM, state);
});

/**
 * Caches all required DOM elements for the application.
 * This prevents repeated, inefficient DOM queries.
 * @returns {object} An object containing all cached DOM elements.
 */
function cacheDOMElements() {
  return {
    // Global
    gameSelect: document.getElementById("game-select"),
    openPlayerBtn: document.getElementById("open-player-window-btn"),
    merchant: {
      indicator: document.getElementById("merchant-mode-indicator"),
      enableBtn: document.getElementById("enable-merchant-mode-btn"),
      disableBtn: document.getElementById("disable-merchant-mode"),
    },
    // Tabs
    tabsContainer: document.querySelector(".tabs"),
    tabContents: document.querySelectorAll(".tab-content"),
    // DM Screen
    dndTracker: document.getElementById("dnd-initiative-tracker"),
    dreadNightsScreen: document.getElementById("dread-nights-active-screen"),
    // Initiative
    init: {
      form: document.getElementById("initiative-form"),
      name: document.getElementById("init-name"),
      roll: document.getElementById("init-roll"),
      class: document.getElementById("init-class"),
      list: document.getElementById("initiative-list"),
      sortBtn: document.getElementById("sort-init"),
      clearBtn: document.getElementById("clear-init"),
    },
    // Prep Roadmap
    prep: {
      container: document.querySelector(".prep-layout"),
      roadmapSteps: document.querySelectorAll(".prep-roadmap-step"),
      contentSteps: document.querySelectorAll(".prep-content-step"),
      guildCards: document.querySelectorAll(".guild-card"),
      merchantCard: document.querySelector("[data-guild='Merchant']"),
    },
    // Generators
    generators: {
      guildName: {
        input1: document.getElementById("guild-name-input-1"),
        input2: document.getElementById("guild-name-input-2"),
        result: document.getElementById("guild-name-result"),
      },
      charName: {
        input: document.getElementById("char-name-input"),
        result: document.getElementById("char-name-result"),
      },
      occupation: {
        input: document.getElementById("occupation-input"),
        result: document.getElementById("occupation-result-display"),
        rerollSection: document.getElementById("occupation-reroll-section"),
        reroll1: document.getElementById("occupation-reroll-1"),
        reroll2: document.getElementById("occupation-reroll-2"),
        rerollResult1: document.getElementById("reroll-result-display-1"),
        rerollResult2: document.getElementById("reroll-result-display-2"),
      },
      virtue: {
        input: document.getElementById("virtue-input"),
        result: document.getElementById("virtue-result-display"),
      },
      vice: {
        input: document.getElementById("vice-input"),
        result: document.getElementById("vice-result-display"),
      },
    },
    // Omen
    omen: {
      rollBtn: document.getElementById("roll-omen"),
      resultEl: document.querySelector("#omen-result span"),
    },
    // Modals
    modals: {
      guildName: {
        trigger: document.getElementById("toggle-name-tables-modal"),
        modal: document.getElementById("name-tables-modal"),
        close: document.getElementById("close-name-tables-modal"),
        content: document.getElementById("name-tables-content-modal"),
      },
      charName: {
        trigger: document.getElementById("toggle-char-name-table-modal"),
        modal: document.getElementById("char-name-table-modal"),
        close: document.getElementById("close-char-name-table-modal"),
        content: document.getElementById("char-name-table-content-modal"),
      },
      occupation: {
        trigger: document.getElementById("toggle-occupation-table-modal"),
        modal: document.getElementById("occupation-table-modal"),
        close: document.getElementById("close-occupation-table-modal"),
        content: document.getElementById("occupation-table-content-modal"),
      },
    }
  };
}

/**
 * Initializes all application functionality.
 * @param {object} DOM - The cached DOM elements object.
 * @param {object} state - The application state object.
 */
function initApp(DOM, state) {
  // Networking
  state.ws = setupWebSocket(state, DOM);
  
  // Core UI
  setupTabs(DOM);
  setupSettings(DOM, state);
  setupCollapsibleCards(DOM);
  setupMerchantMode(DOM, state);
  DOM.openPlayerBtn.addEventListener("click", () => window.open('player.html', '_blank'));

  // Prep Roadmap
  setupRoadmap(DOM);
  setupGuildSelection(DOM, state);
  
  // Generators
  setupGuildNameGenerator(DOM.generators.guildName);
  setupOccupationGenerator(DOM.generators.occupation);
  setupOmenRoller(DOM.omen);

  // Reusable generator setups
  const cardRenderer = (item) => `<div class="occupation-result-card"><h3>${item.virtue || item.vice}</h3><p>${item.description}</p></div>`;
  setupSimpleGenerator(DOM.generators.charName.input, DOM.generators.charName.result, characterNames, item => `<span>${item}</span>`);
  setupSimpleGenerator(DOM.generators.virtue.input, DOM.generators.virtue.result, virtues, cardRenderer);
  setupSimpleGenerator(DOM.generators.vice.input, DOM.generators.vice.result, vices, cardRenderer);

  // Modals
  setupModal(DOM.modals.guildName.trigger, DOM.modals.guildName.modal, DOM.modals.guildName.close);
  setupModal(DOM.modals.charName.trigger, DOM.modals.charName.modal, DOM.modals.charName.close);
  setupModal(DOM.modals.occupation.trigger, DOM.modals.occupation.modal, DOM.modals.occupation.close);

  // DM Screen
  setupInitiativeTracker(DOM, state);

  // Populate dynamic content
  populateGeneratorTables(DOM.modals);
}

// --- NETWORK FUNCTIONS ---

function setupWebSocket(state, DOM) {
  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const ws = new WebSocket(`${wsProtocol}//${window.location.host}`);

  ws.onopen = () => {
    console.log("WebSocket connected.");
    broadcastGameChange(ws, localStorage.getItem("gameSystem") || "Dread Nights");
  };
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "initiative-update") {
      const isNewItem = data.payload.length > state.initiativeList.length;
      state.initiativeList = data.payload;
      renderInitiativeList(state.initiativeList, DOM.init.list, isNewItem); 
    }
  };
  ws.onclose = () => {
    console.log("WebSocket disconnected. Attempting to reconnect...");
    setTimeout(() => setupWebSocket(state, DOM), 3000);
  };
  return ws;
}

function broadcastInitiativeList(state) {
  const currentGame = localStorage.getItem("gameSystem") || "Dread Nights";
  if (currentGame !== "D&D 5e") return;
  if (state.ws && state.ws.readyState === WebSocket.OPEN) {
    state.ws.send(JSON.stringify({ type: "initiative-update", payload: state.initiativeList }));
  }
}

function broadcastGameChange(ws, gameName) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "game-change", payload: gameName }));
  }
}

// --- CORE UI FUNCTIONS ---

function setupTabs(DOM) {
  DOM.tabsContainer.addEventListener("click", (e) => {
    const clickedTab = e.target.closest(".tab-button");
    if (!clickedTab) return;

    const tabId = clickedTab.dataset.tab;
    
    // Update tab buttons
    DOM.tabsContainer.querySelectorAll(".tab-button").forEach(btn => {
      btn.classList.toggle("active", btn === clickedTab);
    });

    // Update tab content
    DOM.tabContents.forEach(content => {
      content.classList.toggle("active", content.id === tabId);
    });
  });
}

function setupSettings(DOM, state) {
  if (!DOM.gameSelect) return;

  const currentGame = localStorage.getItem("gameSystem") || "Dread Nights";
  DOM.gameSelect.value = currentGame;
  updateDmScreen(DOM, currentGame);

  DOM.gameSelect.addEventListener("change", () => {
    const selectedGame = DOM.gameSelect.value;
    localStorage.setItem("gameSystem", selectedGame);
    updateDmScreen(DOM, selectedGame);
    broadcastGameChange(state.ws, selectedGame);
    if (selectedGame !== "D&D 5e") {
      clearInitiative(state, DOM);
    }
  });
}

function updateDmScreen(DOM, gameName) {
  if (!DOM.dndTracker || !DOM.dreadNightsScreen) return;
  
  const isDnd = (gameName === "D&D 5e");
  DOM.dndTracker.classList.toggle("hidden", !isDnd);
  DOM.dreadNightsScreen.classList.toggle("hidden", isDnd);
}

function setupCollapsibleCards(DOM) {
  // Use event delegation on a common ancestor if possible, e.g., document
  // For simplicity, we'll attach to all headers if they are dynamic.
  // Assuming they are static as per the HTML:
  const cardHeaders = document.querySelectorAll(".card-header");
  cardHeaders.forEach(header => {
    header.addEventListener("click", () => {
      const card = header.parentElement;
      card.classList.toggle("collapsed");
    });
  });
}

/**
 * Sets up a generic modal toggle.
 * @param {HTMLElement} trigger - The button that opens the modal.
 * @param {HTMLElement} modal - The modal overlay element.
 * @param {HTMLElement} close - The button that closes the modal.
 */
function setupModal(trigger, modal, close) {
  if (!trigger || !modal || !close) return;
  
  trigger.addEventListener("click", () => modal.classList.add("active"));
  close.addEventListener("click", () => modal.classList.remove("active"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
}

// --- INITIATIVE TRACKER FUNCTIONS ---

function setupInitiativeTracker(DOM, state) {
  if (!DOM.init.form) return;

  DOM.init.form.addEventListener("submit", (e) => {
    e.preventDefault();
    addToInitiative(state, DOM);
  });
  
  DOM.init.sortBtn.addEventListener("click", () => sortInitiative(state, DOM));
  DOM.init.clearBtn.addEventListener("click", () => clearInitiative(state, DOM));
}

function addToInitiative(state, DOM) {
  const name = DOM.init.name.value.trim();
  const roll = parseInt(DOM.init.roll.value, 10);
  const iconClass = DOM.init.class.value;

  if (name && !isNaN(roll)) {
    state.initiativeList.push({ name, roll, iconClass });
    DOM.init.name.value = "";
    DOM.init.roll.value = "";
    renderInitiativeList(state.initiativeList, DOM.init.list, true);
    broadcastInitiativeList(state);
  }
}

function sortInitiative(state, DOM) {
  state.initiativeList.sort((a, b) => b.roll - a.roll);
  renderInitiativeList(state.initiativeList, DOM.init.list, false);
  broadcastInitiativeList(state);
}

function clearInitiative(state, DOM) {
  state.initiativeList = [];
  renderInitiativeList(state.initiativeList, DOM.init.list, false);
  broadcastInitiativeList(state);
}

function renderInitiativeList(initiativeList, listEl, animateNew) {
  if (!listEl) return;
  listEl.innerHTML = "";

  initiativeList.forEach((item, index) => {
    const li = document.createElement("li");
    
    const infoDiv = document.createElement("div");
    infoDiv.className = "init-info";
    const icon = document.createElement("i");
    icon.className = item.iconClass;
    const nameSpan = document.createElement("span");
    nameSpan.className = "init-name";
    nameSpan.textContent = item.name;
    infoDiv.append(icon, nameSpan);
    
    const rollSpan = document.createElement("span");
    rollSpan.className = "init-roll";
    rollSpan.textContent = item.roll;
    
    li.append(infoDiv, rollSpan);

    if (animateNew && index === initiativeList.length - 1) {
      li.classList.add("new-item-pop");
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
      setTimeout(() => li.classList.remove("new-item-pop"), 600);
    }
    listEl.appendChild(li);
  });
}

// --- PREP ROADMAP FUNCTIONS ---

function setupRoadmap(DOM) {
  if (!DOM.prep.container) return;

  const activateStep = (stepId) => {
    const id = parseInt(stepId, 10);

    DOM.prep.roadmapSteps.forEach(step => {
      const currentStepId = parseInt(step.dataset.step, 10);
      step.classList.toggle('active', currentStepId === id);
      step.classList.toggle('completed', currentStepId < id);
    });

    DOM.prep.contentSteps.forEach(content => {
      content.classList.toggle('active', content.dataset.stepContent === stepId);
    });
  };

  // Use event delegation
  DOM.prep.container.addEventListener("click", (e) => {
    const nextBtn = e.target.closest(".btn-next-step");
    if (nextBtn) {
      activateStep(nextBtn.dataset.next);
      return;
    }

    const prevBtn = e.target.closest(".btn-prev-step");
    if (prevBtn) {
      activateStep(prevBtn.dataset.prev);
      return;
    }

    const roadmapStep = e.target.closest(".prep-roadmap-step");
    if (roadmapStep) {
      activateStep(roadmapStep.dataset.step);
      return;
    }

    const resetBtn = e.target.closest("#reset-roadmap-new");
    if (resetBtn) {
      activateStep("1");
      return;
    }
  });

  // Initial setup
  activateStep("1");
}

function setupGuildSelection(DOM, state) {
  if (DOM.prep.guildCards.length === 0) return;

  DOM.prep.guildCards.forEach(card => {
    // Non-merchant cards
    if (card.dataset.guild !== "Merchant") {
      card.addEventListener("click", () => {
        DOM.prep.guildCards.forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        setMerchantMode(DOM, state, false);
      });
    }
  });

  // Merchant card button
  if (DOM.merchant.enableBtn) {
    DOM.merchant.enableBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent card click from firing
      DOM.prep.guildCards.forEach(c => c.classList.remove("selected"));
      if (DOM.prep.merchantCard) DOM.prep.merchantCard.classList.add("selected");
      setMerchantMode(DOM, state, true);
    });
  }
}

function setupMerchantMode(DOM, state) {
  // Set initial state from localStorage
  if (state.merchantMode) {
    DOM.merchant.indicator.classList.remove("hidden");
    if (DOM.prep.merchantCard) DOM.prep.merchantCard.classList.add("selected");
    applyDiscounts(true);
  }

  // Disable button
  if (DOM.merchant.disableBtn) {
    DOM.merchant.disableBtn.addEventListener("click", () => {
      setMerchantMode(DOM, state, false);
      if (DOM.prep.merchantCard) DOM.prep.merchantCard.classList.remove("selected");
    });
  }
}

function setMerchantMode(DOM, state, isActive) {
  state.merchantMode = isActive;
  localStorage.setItem("merchantModeActive", isActive ? "true" : "false");
  DOM.merchant.indicator.classList.toggle("hidden", !isActive);
  applyDiscounts(isActive);
}

function applyDiscounts(active) {
  // This is a placeholder function. 
  // When the shop is implemented, this function should be updated.
  if (active) {
    console.log("Merchant mode activated. Applying 25% discount.");
  } else {
    console.log("Merchant mode deactivated. Removing discount.");
  }
}

// --- GENERATOR FUNCTIONS ---

/**
 * Populates all generator tables in their modals.
 * @param {object} modalDOM - The modal part of the DOM cache.
 */
function populateGeneratorTables(modalDOM) {
  if (modalDOM.guildName.content) {
    const table1 = createSimpleNameTable(guildNamePart1, "Table 1");
    const table2 = createSimpleNameTable(guildNamePart2, "Table 2 (Red)");
    modalDOM.guildName.content.innerHTML = `
      <div class="name-table-wrapper">${table1}</div>
      <div class="name-table-wrapper">${table2}</div>
    `;
  }
  if (modalDOM.charName.content) {
    modalDOM.charName.content.innerHTML = `<div class="name-table-wrapper">${createSimpleNameTable(characterNames, "Hahmon Nimet")}</div>`;
  }
  if (modalDOM.occupation.content) {
    modalDOM.occupation.content.innerHTML = createOccupationTableHtml(occupations);
  }
}

/**
 * Sets up a simple generator with one input, one result, and a data array.
 * @param {HTMLElement} inputEl - The <input> element.
 * @param {HTMLElement} resultEl - The element to display the result in.
 * @param {Array<string|object>} dataArray - The source data array.
 * @param {Function} renderFn - A function that takes a data item and returns HTML.
 */
function setupSimpleGenerator(inputEl, resultEl, dataArray, renderFn) {
  if (!inputEl || !resultEl) return;

  inputEl.addEventListener("input", () => {
    const roll = parseInt(inputEl.value, 10);
    if (roll >= 1 && roll <= dataArray.length) {
      const item = dataArray[roll - 1];
      resultEl.innerHTML = renderFn(item);
    } else {
      resultEl.innerHTML = "";
    }
  });
}

function setupGuildNameGenerator(dom) {
  if (!dom.input1 || !dom.input2 || !dom.result) return;

  const generateName = () => {
    const roll1 = parseInt(dom.input1.value, 10);
    const roll2 = parseInt(dom.input2.value, 10);

    if (roll1 >= 1 && roll1 <= 100 && roll2 >= 1 && roll2 <= 100) {
      const name1 = guildNamePart1[roll1 - 1];
      const name2 = guildNamePart2[roll2 - 1];
      dom.result.innerHTML = `<span>${name1} ${name2}</span>`;
    } else {
      dom.result.innerHTML = "<span>-</span>";
    }
  };

  dom.input1.addEventListener("input", generateName);
  dom.input2.addEventListener("input", generateName);
}

function setupOccupationGenerator(dom) {
  if (!dom.input || !dom.result || !dom.rerollSection) return;

  const getOccupationCardHtml = (roll) => {
    const occupationRoll = Math.ceil(roll / 2);
    if (occupationRoll >= 1 && occupationRoll <= 50) {
      const item = occupations[occupationRoll - 1];
      return `<div class="occupation-result-card"><h3>${item.occupation}</h3><p>${item.benefit}</p></div>`;
    }
    return "";
  };

  dom.input.addEventListener("input", () => {
    const d100roll = parseInt(dom.input.value, 10);
    const occupationRoll = Math.ceil(d100roll / 2);

    if (d100roll >= 1 && d100roll <= 100) {
      const item = occupations[occupationRoll - 1];
      dom.result.innerHTML = `<div class="occupation-result-card"><h3>${item.occupation}</h3><p>${item.benefit}</p></div>`;
      dom.rerollSection.classList.toggle("hidden", occupationRoll !== 50);
    } else {
      dom.result.innerHTML = "";
      dom.rerollSection.classList.add("hidden");
    }
  });

  dom.reroll1.addEventListener("input", () => {
    const d100roll = parseInt(dom.reroll1.value, 10);
    dom.rerollResult1.innerHTML = getOccupationCardHtml(d100roll);
  });

  dom.reroll2.addEventListener("input", () => {
    const d100roll = parseInt(dom.reroll2.value, 10);
    dom.rerollResult2.innerHTML = getOccupationCardHtml(d100roll);
  });
}

function setupOmenRoller(dom) {
  if (!dom.rollBtn || !dom.resultEl) return;

  dom.rollBtn.addEventListener("click", () => {
    dom.rollBtn.classList.add("rolling");
    setTimeout(() => dom.rollBtn.classList.remove("rolling"), 500);
    
    const result = Math.floor(Math.random() * 2) + 1;
    
    setTimeout(() => {
      dom.resultEl.textContent = result;
      dom.resultEl.parentElement.classList.add('tada');
      setTimeout(() => dom.resultEl.parentElement.classList.remove('tada'), 700);
    }, 250);
  });
}

// --- UTILITY FUNCTIONS ---

/**
 * Creates an HTML table for a simple 1-column name list.
 * @param {Array<string>} data - The array of names.
 * @param {string} caption - The table caption.
 * @returns {string} The HTML string for the table.
 */
function createSimpleNameTable(data, caption) {
  let rows = data.map((name, index) => `<tr><td>${index + 1}</td><td>${name}</td></tr>`).join("");
  return `
    <table>
      <caption>${caption}</caption>
      <thead>
        <tr>
          <th>d${data.length}</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

/**
 * Creates a specific HTML table for the occupations data.
 * @param {Array<object>} data - The occupations array.
 * @returns {string} The HTML string for the table.
 */
function createOccupationTableHtml(data) {
  let rows = data.map((item, index) => `<tr><td>${index + 1}</td><td>${item.occupation}</td><td>${item.benefit}</td></tr>`).join("");
  return `
    <table>
      <caption>Työnkuvat</caption>
      <thead>
        <tr>
          <th>d50</th>
          <th>Ammetti</th>
          <th>Hyöty</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}