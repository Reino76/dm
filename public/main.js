/**
 * main.js
 *
 * Core logic for the DM Screen application.
 * This file is structured to be modular, efficient, and maintainable.
 */

// Wait for the DOM to be fully loaded before running any script
document.addEventListener("DOMContentLoaded", () => {
  
  // Application state container
  const state = {
    initiativeList: [],
    ws: null,
    merchantMode: localStorage.getItem("merchantModeActive") === "true",
    grid: null, // To hold the GridStack instance
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
  const dom = {
    // Global
    gameSelect: document.getElementById("game-select"),
    openPlayerBtn: document.getElementById("open-player-window-btn"),
    toggleMapBtn: document.getElementById("toggle-map-btn"),
    merchant: {
      indicator: document.getElementById("merchant-mode-indicator"),
      enableBtn: document.getElementById("enable-merchant-mode-btn"),
      disableBtn: document.getElementById("disable-merchant-mode"),
    },
    // Tabs
    tabsContainer: document.querySelector(".tabs"),
    tabContents: document.querySelectorAll(".tab-content"),
    prepTabButton: document.querySelector('[data-tab="tab-prep"]'),
    prepTabContent: document.getElementById('tab-prep'),
    dmScreenTabButton: document.querySelector('[data-tab="tab-dm-screen"]'),
    dmScreenTabContent: document.getElementById('tab-dm-screen'),
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
        // --- CRITICAL BUG FIX: These were missing ---
        rerollResult1: document.getElementById("reroll-result-display-1"),
        rerollResult2: document.getElementById("reroll-result-display-2"),
        // ------------------------------------------
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
      virtue: {
        trigger: document.querySelector(".toggle-virtue-table"),
        modal: document.getElementById("virtue-table-modal"),
        close: document.getElementById("close-virtue-table-modal"),
        content: document.getElementById("virtue-table-content-modal"),
      },
      vice: {
        trigger: document.querySelector(".toggle-vice-table"),
        modal: document.getElementById("vice-table-modal"),
        close: document.getElementById("close-vice-table-modal"),
        content: document.getElementById("vice-table-content-modal"),
      },
    },
    // Table Map
    map: {
        window: document.getElementById('table-map-window'),
        header: document.querySelector('.map-header'),
        content: document.querySelector('.map-content'),
        area: document.querySelector('.map-area'),
        nameInput: document.getElementById('map-token-name'),
        addBtn: document.getElementById('add-map-token-btn'),
        collapseBtn: document.getElementById('map-collapse-btn'),
        meToken: document.querySelector('.map-token.me')
    },
    // Widget Dashboard
    dashboard: {
      grid: document.querySelector('.grid-stack'),
      lockBtn: document.getElementById('lock-layout-btn'),
      addBtn: document.getElementById('add-widget-btn'),
      quickRoller: {
        buttons: document.getElementById('quick-roller-buttons'),
        result: document.getElementById('quick-roller-result'),
      },
      quickGen: {
        select: document.getElementById('quick-gen-select'),
        btn: document.getElementById('quick-gen-btn'),
        result: document.getElementById('quick-gen-result'),
      }
    }
  };

  // Robustness check: Replace missing elements with null
  for (const key in dom) {
    if (dom[key] === null) {
      console.warn(`DOM element not found: ${key}`);
    } else if (typeof dom[key] === 'object' && dom[key] !== null) { // Check for null object
      for (const subKey in dom[key]) {
        if (dom[key][subKey] === null) {
          console.warn(`DOM element not found: ${key}.${subKey}`);
        }
      }
    }
  }
  
  return dom;
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
  setupMerchantMode(DOM, state);
  setupCollapsibleCards(); // <-- BUG FIX: Re-added this function call
  if (DOM.openPlayerBtn) DOM.openPlayerBtn.addEventListener("click", () => window.open('player.html', '_blank'));
  if (DOM.toggleMapBtn) DOM.toggleMapBtn.addEventListener("click", () => {
    if(DOM.map.window) { 
      DOM.map.window.classList.toggle("hidden");
      // Open collapsed by default
      if (!DOM.map.window.classList.contains("hidden") && !DOM.map.window.classList.contains("collapsed")) {
        DOM.map.window.classList.add("collapsed");
        const icon = DOM.map.collapseBtn.querySelector('i');
        if(icon) {
          icon.classList.remove('fa-chevron-down');
          icon.classList.add('fa-chevron-up');
        }
      }
    }
  });

  // Prep Roadmap
  setupRoadmap(DOM);
  setupGuildSelection(DOM, state);
  
  // Generators
  setupGuildNameGenerator(DOM.generators.guildName);
  setupCharacterNameGenerator(DOM.generators.charName);
  setupOccupationGenerator(DOM.generators.occupation);
  setupVirtueGenerator(DOM.generators.virtue);
  setupViceGenerator(DOM.generators.vice);
  // stats allocation UI removed per request; keep function in file for future but do not initialize now
  setupOmenRoller(DOM.omen);

  // Modals
  setupModal(DOM.modals.guildName.trigger, DOM.modals.guildName.modal, DOM.modals.guildName.close);
  setupModal(DOM.modals.charName.trigger, DOM.modals.charName.modal, DOM.modals.charName.close);
  setupModal(DOM.modals.occupation.trigger, DOM.modals.occupation.modal, DOM.modals.occupation.close);
  setupModal(DOM.modals.virtue.trigger, DOM.modals.virtue.modal, DOM.modals.virtue.close);
  setupModal(DOM.modals.vice.trigger, DOM.modals.vice.modal, DOM.modals.vice.close);

  // DM Screen
  setupInitiativeTracker(DOM, state);
  setupTableMap(DOM.map);
  setupWidgetDashboard(DOM, state);

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
  if (!DOM.tabsContainer) return;
  DOM.tabsContainer.addEventListener("click", (e) => {
    const clickedTab = e.target.closest(".tab-button");
    if (!clickedTab || clickedTab.classList.contains('hidden')) return; 

    const tabId = clickedTab.dataset.tab;
    
    DOM.tabsContainer.querySelectorAll(".tab-button").forEach(btn => {
      btn.classList.toggle("active", btn === clickedTab);
    });

    DOM.tabContents.forEach(content => {
      content.classList.toggle("active", content.id === tabId);
    });
  });
}

function setupSettings(DOM, state) {
  if (!DOM.gameSelect) return;

  const currentGame = localStorage.getItem("gameSystem") || "Dread Nights";
  DOM.gameSelect.value = currentGame;
  updateGameUI(DOM, currentGame);

  DOM.gameSelect.addEventListener("change", () => {
    const selectedGame = DOM.gameSelect.value;
    localStorage.setItem("gameSystem", selectedGame);
    updateGameUI(DOM, selectedGame);
    broadcastGameChange(state.ws, selectedGame);
    if (selectedGame !== "D&D 5e") {
      clearInitiative(state, DOM);
    }
  });
}

function updateGameUI(DOM, gameName) {
  if (!DOM.dndTracker || !DOM.dreadNightsScreen || !DOM.prepTabButton || !DOM.prepTabContent || !DOM.openPlayerBtn) return;
  
  const isDnd = (gameName === "D&D 5e");

  DOM.dndTracker.classList.toggle("hidden", !isDnd);
  DOM.openPlayerBtn.classList.toggle("hidden", !isDnd);
  DOM.dreadNightsScreen.classList.toggle("hidden", isDnd);
  DOM.prepTabButton.classList.toggle("hidden", isDnd);
  DOM.prepTabContent.classList.toggle("hidden", isDnd);

  if (isDnd && DOM.prepTabButton.classList.contains('active')) {
    DOM.prepTabButton.classList.remove('active');
    DOM.prepTabContent.classList.remove('active');
    DOM.dmScreenTabButton.classList.add('active');
    DOM.dmScreenTabContent.classList.add('active');
  } else if (!isDnd && (DOM.dmScreenTabButton.classList.contains('active') || !DOM.prepTabButton.classList.contains('active'))) {
     // If switching to Dread Nights, make Prep Tab the default
     DOM.dmScreenTabButton.classList.remove('active');
     DOM.dmScreenTabContent.classList.remove('active');
     DOM.prepTabButton.classList.add('active');
     DOM.prepTabContent.classList.add('active');
  }
}

// BUG FIX: Added this function back
function setupCollapsibleCards() {
  document.addEventListener("click", (e) => {
    // Find the closest card-header
    const header = e.target.closest('.card-header');
    if (!header) return; 
    
    // Make sure it's NOT a widget header
    if (e.target.closest('.widget-header')) return; 

    const card = header.parentElement;
    // Only collapse guild-cards in the prep tab
    if (card && card.classList.contains('guild-card')) {
      card.classList.toggle("collapsed");
    }
  });
}

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
  
  if(DOM.init.sortBtn) DOM.init.sortBtn.addEventListener("click", () => sortInitiative(state, DOM));
  if(DOM.init.clearBtn) DOM.init.clearBtn.addEventListener("click", () => clearInitiative(state, DOM));
}

function addToInitiative(state, DOM) {
  if (!DOM.init.name || !DOM.init.roll || !DOM.init.class || !DOM.init.list) return;
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
  if(DOM.init.list) renderInitiativeList(state.initiativeList, DOM.init.list, false);
  broadcastInitiativeList(state);
}

function clearInitiative(state, DOM) {
  state.initiativeList = [];
  if(DOM.init.list) renderInitiativeList(state.initiativeList, DOM.init.list, false);
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
    if(!stepId) return;
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

  // Keyboard navigation for roadmap: ArrowRight = next, ArrowLeft = previous
  document.addEventListener('keydown', (e) => {
    // Only handle when prep tab is active
    const prepTab = document.getElementById('tab-prep');
    const prepActive = prepTab && prepTab.classList.contains('active');
    if (!prepActive) return;
    const activeStepEl = Array.from(DOM.prep.roadmapSteps).find(s => s.classList.contains('active'));
    if (!activeStepEl) return;
    const current = parseInt(activeStepEl.dataset.step, 10);
    if (e.key === 'ArrowRight') {
      // find next step element
      const next = Array.from(DOM.prep.roadmapSteps).find(s => parseInt(s.dataset.step,10) === current + 1);
      if (next) activateStep(next.dataset.step);
    } else if (e.key === 'ArrowLeft') {
      const prev = Array.from(DOM.prep.roadmapSteps).find(s => parseInt(s.dataset.step,10) === current - 1);
      if (prev) activateStep(prev.dataset.step);
    }
  });

  activateStep("1");
}

function setupGuildSelection(DOM, state) {
  if (DOM.prep.guildCards.length === 0) return;

  DOM.prep.guildCards.forEach(card => {
    if (card.dataset.guild !== "Merchant") {
      card.addEventListener("click", (e) => {
         if (e.target.closest('.card-header')) return; // Let collapse handle it
        DOM.prep.guildCards.forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        setMerchantMode(DOM, state, false);
      });
    }
  });

  if (DOM.merchant.enableBtn) {
    DOM.merchant.enableBtn.addEventListener("click", (e) => {
      e.stopPropagation(); 
      DOM.prep.guildCards.forEach(c => c.classList.remove("selected"));
      if (DOM.prep.merchantCard) DOM.prep.merchantCard.classList.add("selected");
      setMerchantMode(DOM, state, true);
    });
  }
}

function setupMerchantMode(DOM, state) {
  if (state.merchantMode) {
    if (DOM.merchant.indicator) DOM.merchant.indicator.classList.remove("hidden");
    if (DOM.prep.merchantCard) DOM.prep.merchantCard.classList.add("selected");
    applyDiscounts(true);
  }

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
  if (DOM.merchant.indicator) DOM.merchant.indicator.classList.toggle("hidden", !isActive);
  applyDiscounts(isActive);
}

function applyDiscounts(active) {
  if (active) {
    console.log("Merchant mode activated. Applying 25% discount.");
  } else {
    console.log("Merchant mode deactivated. Removing discount.");
  }
}

// --- GENERATOR FUNCTIONS ---

function populateGeneratorTables(modalDOM) {
  if (modalDOM.guildName.content && typeof guildNamePart1 !== 'undefined' && typeof guildNamePart2 !== 'undefined') {
    const table1 = createSimpleNameTable(guildNamePart1, "Table 1");
    const table2 = createSimpleNameTable(guildNamePart2, "Table 2 (Red)");
    modalDOM.guildName.content.innerHTML = `
      <div class="name-table-wrapper">${table1}</div>
      <div class="name-table-wrapper">${table2}</div>
    `;
  }
  if (modalDOM.charName.content && typeof characterNames !== 'undefined') {
    modalDOM.charName.content.innerHTML = `<div class="name-table-wrapper">${createSimpleNameTable(characterNames, "Hahmon Nimet")}</div>`;
  }
  if (modalDOM.occupation.content && typeof occupations !== 'undefined') {
    modalDOM.occupation.content.innerHTML = createOccupationTableHtml(occupations);
  }
  if (modalDOM.virtue.content && typeof virtues !== 'undefined') {
    modalDOM.virtue.content.innerHTML = createVirtueViceTableHtml(virtues, "Hyveet");
  }
  if (modalDOM.vice.content && typeof vices !== 'undefined') {
    modalDOM.vice.content.innerHTML = createVirtueViceTableHtml(vices, "Paheet");
  }
}

function setupSimpleGenerator(inputEl, resultEl, dataArray, renderFn) {
  if (!inputEl || !resultEl || !dataArray) return;
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

// Specific Generator Setups
function setupGuildNameGenerator(dom) {
  if (!dom.input1 || !dom.input2 || !dom.result || typeof guildNamePart1 === 'undefined' || typeof guildNamePart2 === 'undefined') return;
  const gen = () => {
    const roll1 = parseInt(dom.input1.value, 10);
    const roll2 = parseInt(dom.input2.value, 10);
    if (roll1 >= 1 && roll1 <= 100 && roll2 >= 1 && roll2 <= 100) {
      dom.result.innerHTML = `<span>${guildNamePart1[roll1 - 1]} ${guildNamePart2[roll2 - 1]}</span>`;
    } else {
      dom.result.innerHTML = "<span>-</span>";
    }
  };
  dom.input1.addEventListener("input", gen);
  dom.input2.addEventListener("input", gen);
}

function setupCharacterNameGenerator(dom) {
  if (typeof characterNames !== 'undefined') {
    setupSimpleGenerator(dom.input, dom.result, characterNames, item => `<span>${item}</span>`);
  }
}

function setupVirtueGenerator(dom) {
  if (typeof virtues !== 'undefined') {
    setupSimpleGenerator(dom.input, dom.result, virtues, item => 
      `<div class="occupation-result-card"><h3>${item.virtue}</h3><p>${item.description}</p></div>`
    );
  }
}

function setupViceGenerator(dom) {
  if (typeof vices !== 'undefined') {
    setupSimpleGenerator(dom.input, dom.result, vices, item => 
      `<div class="occupation-result-card"><h3>${item.vice}</h3><p>${item.description}</p></div>`
    );
  }
}

function setupOccupationGenerator(dom) {
  if (!dom.input || !dom.result || !dom.rerollSection || !dom.reroll1 || !dom.reroll2 || !dom.rerollResult1 || !dom.rerollResult2 || typeof occupations === 'undefined') {
      console.warn("Occupation generator setup failed: Missing DOM elements or data.");
      return;
  }

  const getCardHtml = (roll) => {
    const index = Math.ceil(roll / 2) - 1;
    if (index >= 0 && index < 50) { // occupations array has 50 items
      const item = occupations[index];
      return `<div class="occupation-result-card"><h3>${item.occupation}</h3><p>${item.benefit}</p></div>`;
    }
    return "";
  };

  dom.input.addEventListener("input", () => {
    const d100roll = parseInt(dom.input.value, 10);
    const index = Math.ceil(d100roll / 2) - 1;
    if (d100roll >= 1 && d100roll <= 100) {
      dom.result.innerHTML = getCardHtml(d100roll);
      dom.rerollSection.classList.toggle("hidden", index !== 49); // Roll 50 is index 49
    } else {
      dom.result.innerHTML = "";
      dom.rerollSection.classList.add("hidden");
    }
  });

  dom.reroll1.addEventListener("input", () => {
    dom.rerollResult1.innerHTML = getCardHtml(parseInt(dom.reroll1.value, 10));
  });
  dom.reroll2.addEventListener("input", () => {
    dom.rerollResult2.innerHTML = getCardHtml(parseInt(dom.reroll2.value, 10));
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

// Stats allocation UI for Dread Nights
function setupStatsAllocation(DOM) {
  const tokensContainer = document.getElementById('stats-tokens');
  const grid = document.getElementById('stats-grid');
  const resetBtn = document.getElementById('stats-reset');
  const applyBtn = document.getElementById('stats-apply');
  const seriesInputs = document.getElementsByName('stat-series');

  if (!tokensContainer || !grid) return;

  const statSlots = Array.from(grid.querySelectorAll('.stat-slot'));
  let activeSlot = null;
  let tokens = [];
  let assignments = {}; // stat -> value

  function getSelectedSeries() {
    const checked = Array.from(seriesInputs).find(i => i.checked);
    return checked ? checked.value : 'a';
  }

  function seriesValues(series) {
    // Series A: +1, +1, 0, -3 ; Series B: +2, +2, -1, -2
    if (series === 'b') return [2,2,-1,-2];
    return [1,1,0,-3];
  }

  function renderTokens() {
    tokensContainer.innerHTML = '';
    tokens = seriesValues(getSelectedSeries()).map((v, idx) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'stats-token';
      el.dataset.value = v;
      el.dataset.index = idx;
      el.textContent = (v >= 0 ? '+' + v : String(v));
      el.addEventListener('click', () => onTokenClick(el));
      tokensContainer.appendChild(el);
      return el;
    });
  }

  function clearAssignments() {
    assignments = {};
    statSlots.forEach(s => s.querySelector('.stat-value').textContent = '—');
    tokens.forEach(t => t.classList.remove('used'));
  }

  function onSlotClick(slot) {
    // toggle active
    if (activeSlot === slot) {
      slot.classList.remove('active');
      activeSlot = null;
      return;
    }
    statSlots.forEach(s => s.classList.remove('active'));
    slot.classList.add('active');
    activeSlot = slot;
  }

  function onTokenClick(tokenEl) {
    if (tokenEl.classList.contains('used')) return;
    if (!activeSlot) {
      // If no active slot, briefly highlight potential slots
      return;
    }
    const stat = activeSlot.dataset.stat;
    const val = parseInt(tokenEl.dataset.value, 10);
    // If this stat already has an assigned token, free that token first
    const prev = assignments[stat];
    if (typeof prev === 'number') {
      const prevToken = tokens.find(t => parseInt(t.dataset.value,10) === prev && t.classList.contains('used'));
      if (prevToken) prevToken.classList.remove('used');
    }
    // assign
    assignments[stat] = val;
    activeSlot.querySelector('.stat-value').textContent = (val >= 0 ? '+'+val : String(val));
    tokenEl.classList.add('used');
    // deselect slot
    activeSlot.classList.remove('active');
    activeSlot = null;
  }

  // click handlers for slots
  statSlots.forEach(slot => slot.addEventListener('click', () => onSlotClick(slot)));

  // radio change
  Array.from(seriesInputs).forEach(r => r.addEventListener('change', () => {
    renderTokens();
    clearAssignments();
  }));

  resetBtn && resetBtn.addEventListener('click', (e) => { e.preventDefault(); renderTokens(); clearAssignments(); });
  applyBtn && applyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const saved = Object.assign({}, assignments);
    try { localStorage.setItem('dread_stats', JSON.stringify(saved)); } catch (err) { console.warn('Could not save stats', err); }
    applyBtn.textContent = 'Tallennettu';
    setTimeout(() => applyBtn.textContent = 'Tallenna statit', 1200);
  });

  // initial render
  renderTokens();
}

// --- TABLE MAP FUNCTIONALITY ---

function makeTokenDraggable(tokenElement, containerElement) {
  if (!tokenElement || !containerElement) return;
  tokenElement.addEventListener("mousedown", (e_down) => {
    e_down.preventDefault();
    tokenElement.classList.add("dragging");
    const containerRect = containerElement.getBoundingClientRect();
    const tokenRect = tokenElement.getBoundingClientRect();
    const offsetX = e_down.clientX - tokenRect.left;
    const offsetY = e_down.clientY - tokenRect.top;

    function onTokenMouseMove(e_move) {
      let newLeft = e_move.clientX - containerRect.left - offsetX;
      let newTop = e_move.clientY - containerRect.top - offsetY;
      if (newLeft < 0) newLeft = 0;
      if (newTop < 0) newTop = 0;
      if (newLeft + tokenElement.offsetWidth > containerElement.clientWidth) {
        newLeft = containerElement.clientWidth - tokenElement.offsetWidth;
      }
      if (newTop + tokenElement.offsetHeight > containerElement.clientHeight) {
        newTop = containerElement.clientHeight - tokenElement.offsetHeight;
      }
      tokenElement.style.left = `${newLeft}px`;
      tokenElement.style.top = `${newTop}px`;
      tokenElement.style.bottom = 'auto';
      tokenElement.style.transform = 'none'; 
    }
    function onTokenMouseUp() {
      tokenElement.classList.remove("dragging");
      document.removeEventListener("mousemove", onTokenMouseMove);
      document.removeEventListener("mouseup", onTokenMouseUp);
    }
    document.addEventListener("mousemove", onTokenMouseMove);
    document.addEventListener("mouseup", onTokenMouseUp);
  });
}

function setupTableMap(dom) {
  if (!dom.window || !dom.header || !dom.addBtn || !dom.nameInput || !dom.area || !dom.meToken || !dom.collapseBtn) return;

  dom.collapseBtn.addEventListener("click", () => {
    dom.window.classList.toggle("collapsed");
    const icon = dom.collapseBtn.querySelector('i');
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
  });

  dom.addBtn.addEventListener("click", () => {
    const name = dom.nameInput.value.trim();
    if (name === "") return;
    const token = document.createElement('div');
    token.className = 'map-token';
    token.textContent = name;
    token.style.top = '15px';
    token.style.left = '15px';
    dom.area.appendChild(token);
    makeTokenDraggable(token, dom.area);
    dom.nameInput.value = "";
  });
  dom.nameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") dom.addBtn.click();
  });

  makeTokenDraggable(dom.meToken, dom.area);

  let isWindowDragging = false;
  let windowOffset = { x: 0, y: 0 };
  dom.header.addEventListener("mousedown", (e) => {
    if (e.target.closest('button')) return;
    isWindowDragging = true;
    windowOffset = { x: dom.window.offsetLeft - e.clientX, y: dom.window.offsetTop - e.clientY };
    dom.header.style.cursor = 'grabbing';
    document.addEventListener("mousemove", onWindowMouseMove);
    document.addEventListener("mouseup", onWindowMouseUp);
  });
  function onWindowMouseMove(e) {
    if (!isWindowDragging) return;
    e.preventDefault();
    dom.window.style.left = `${e.clientX + windowOffset.x}px`;
    dom.window.style.top = `${e.clientY + windowOffset.y}px`;
    dom.window.style.bottom = 'auto';
    dom.window.style.right = 'auto';
  }
  function onWindowMouseUp() {
    isWindowDragging = false;
    dom.header.style.cursor = 'grab';
    document.removeEventListener("mousemove", onWindowMouseMove);
    document.removeEventListener("mouseup", onWindowMouseUp);
  }
}

// --- NEW: WIDGET DASHBOARD FUNCTIONS ---

function setupWidgetDashboard(DOM, state) {
  if (!DOM.dashboard.grid || typeof GridStack === 'undefined') {
    console.error("GridStack not loaded or dashboard not found.");
    return;
  }

  state.grid = GridStack.init({
    column: 12,
    cellHeight: '70px',
    margin: 10,
    float: true,
    disableDrag: false,
    disableResize: true,
    handle: '.widget-header',
  });

  // 1. Lock Layout Button
  if (DOM.dashboard.lockBtn) {
    DOM.dashboard.lockBtn.addEventListener('click', () => {
      const isLocked = DOM.dashboard.lockBtn.dataset.locked === 'true';
      if (isLocked) {
        state.grid.enableMove(true);
        DOM.dashboard.lockBtn.dataset.locked = 'false';
        DOM.dashboard.lockBtn.innerHTML = '<i class="fas fa-lock-open"></i> Lock Layout';
        DOM.dashboard.lockBtn.classList.add('btn-secondary');
        DOM.dashboard.lockBtn.classList.remove('btn-danger');
      } else {
        state.grid.enableMove(false);
        DOM.dashboard.lockBtn.dataset.locked = 'true';
        DOM.dashboard.lockBtn.innerHTML = '<i class="fas fa-lock"></i> Layout Locked';
        DOM.dashboard.lockBtn.classList.remove('btn-secondary');
        DOM.dashboard.lockBtn.classList.add('btn-danger');
      }
    });
  }

  // 2. Widget Controls (Collapse & Close) using Event Delegation
  DOM.dashboard.grid.addEventListener('click', (e) => {
    // Collapse Button
    const collapseBtn = e.target.closest('.btn-widget-collapse');
    if (collapseBtn) {
      const widget = collapseBtn.closest('.grid-stack-item-content');
      const icon = collapseBtn.querySelector('i');
      if(widget) {
        widget.classList.toggle('collapsed');
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-up');
      }
    }

    // Close Button
    const closeBtn = e.target.closest('.btn-widget-close');
    if (closeBtn) {
      const widgetEl = closeBtn.closest('.grid-stack-item');
      if (widgetEl) {
        state.grid.removeWidget(widgetEl);
      }
    }
  });

  // 3. Setup Tool Widgets
  setupQuickRoller(DOM.dashboard.quickRoller);
  setupQuickGenerator(DOM.dashboard.quickGen);

  // 4. Add Widget Button (Placeholder)
  if (DOM.dashboard.addBtn) {
    DOM.dashboard.addBtn.addEventListener('click', () => {
      // This is where you would pop a modal to add new widgets.
      // For now, it just logs a message.
      console.log("Add Widget button clicked. (Functionality to be added)");
    });
  }
}

function setupQuickRoller(dom) {
  if (!dom.buttons || !dom.result) return;
  
  dom.buttons.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (btn && btn.dataset.die) {
      const die = parseInt(btn.dataset.die, 10);
      const result = Math.floor(Math.random() * die) + 1;
      dom.result.textContent = `[ ${result} ]`;
      // Add a quick animation
      dom.result.classList.remove('tada'); // reset animation
      void dom.result.offsetWidth; // trigger reflow
      dom.result.classList.add('tada');
    }
  });
}

function setupQuickGenerator(dom) {
  if (!dom.btn || !dom.select || !dom.result) return;

  dom.btn.addEventListener('click', () => {
    // Check if data is available (from data.js)
    if (typeof quickGeneratorData === 'undefined') {
        dom.result.textContent = "Error: Generator data not found.";
        return;
    }
    const key = dom.select.value;
    if (quickGeneratorData[key] && quickGeneratorData[key].length > 0) {
      const dataArray = quickGeneratorData[key];
      const result = dataArray[Math.floor(Math.random() * dataArray.length)];
      dom.result.textContent = result;
    } else {
      dom.result.textContent = `No data for "${key}"`;
    }
  });
}


// --- UTILITY FUNCTIONS ---

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

function createVirtueViceTableHtml(data, title) {
  // Determine key based on title
  const key = title === "Hyveet" ? "virtue" : "vice";
  const descKey = title === "Hyveet" ? "description" : "description";
  
  let rows = data.map((item, index) => `<tr><td>${index + 1}</td><td>${item[key]}</td><td>${item[descKey]}</td></tr>`).join("");
  
  return `
    <div class="name-table-wrapper">
      <table>
        <caption>${title} (d20)</caption>
        <thead>
          <tr>
            <th>d20</th>
            <th>${title}</th>
            <th>Kuvaus</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

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

