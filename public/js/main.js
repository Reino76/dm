/**
 * main.js
 *
 * Core logic for the DM Screen application.
 * This file is structured to be modular, efficient, and maintainable.
 * * Contains merged logic from play.js and shop.js.
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
    playerPreviewTabButton: document.querySelector('[data-tab="tab-player-preview"]'),
    playerPreviewTabContent: document.getElementById('tab-player-preview'),
  // Core player preview link/button (non-game-specific)
  openPlayerLinkBtn: document.getElementById('open-player-link-btn'),
  // Header / game actions
  header: document.getElementById('app-header'),
  headerToggleBtn: document.getElementById('toggle-header-btn'),
  gameActions: document.getElementById('game-actions'),
  // DM Screen
  dndTracker: document.getElementById("dnd-initiative-tracker"),
  // Some pages may not include a dedicated Dread Nights wrapper element.
  // Fallback to the prep tab content so toggling the gamemode won't throw.
  dreadNightsScreen: document.getElementById("dread-nights-active-screen") || document.getElementById('tab-prep'),
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
      itemDetails: {
        modal: document.getElementById("item-details-modal"),
        close: document.getElementById("close-item-details-modal"),
        content: document.getElementById("item-details-content"),
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
    },
    // Shop Tab (New)
    shop: {
        itemContainer: document.getElementById("item-shop-container"),
        occupationContainer: document.getElementById("occupation-shop-container")
    }
  };

  for (const key in dom) {
    if (dom[key] === null) {
      console.warn(`DOM element not found: ${key}`);
    } else if (typeof dom[key] === 'object' && dom[key] !== null) {
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
  state.ws = setupWebSocket(state, DOM);
  // Preserve original session-start / dread-nights content so we can swap it for other games
  try {
    if (DOM.dreadNightsScreen) {
      // Wrap existing children into a stable container so we can hide/show without destroying nodes
      const originalWrapper = document.createElement('div');
      originalWrapper.className = 'dread-original-wrapper';
      while (DOM.dreadNightsScreen.firstChild) {
        originalWrapper.appendChild(DOM.dreadNightsScreen.firstChild);
      }
      DOM.dreadNightsScreen.appendChild(originalWrapper);
      DOM._originalDreadNightsNode = originalWrapper;

      // Create placeholder wrapper (hidden by default)
      const placeholderWrapper = document.createElement('div');
      placeholderWrapper.className = 'dread-placeholder-wrapper hidden';
      placeholderWrapper.innerHTML = `
        <div class="placeholder">
          <h2>Session Start</h2>
          <p>No session start information is configured for this game yet.</p>
        </div>`;
      DOM.dreadNightsScreen.appendChild(placeholderWrapper);
      DOM._placeholderDreadNightsNode = placeholderWrapper;
    }
  } catch (err) {
    DOM._originalDreadNightsNode = null;
    DOM._placeholderDreadNightsNode = null;
  }
  
  setupTabs(DOM);
  setupSettings(DOM, state);
  setupHeaderToggle(DOM);
  setupMerchantMode(DOM, state);
  setupHeaderButtons(DOM);

  setupRoadmap(DOM);
  setupGuildSelection(DOM, state);
  
  setupGuildNameGenerator(DOM.generators.guildName);
  setupCharacterNameGenerator(DOM.generators.charName);
  setupOccupationGenerator(DOM.generators.occupation);
  setupVirtueGenerator(DOM.generators.virtue);
  setupViceGenerator(DOM.generators.vice);
  setupOmenRoller(DOM.omen);

  setupModal(DOM.modals.guildName.trigger, DOM.modals.guildName.modal, DOM.modals.guildName.close);
  setupModal(DOM.modals.charName.trigger, DOM.modals.charName.modal, DOM.modals.charName.close);
  setupModal(DOM.modals.occupation.trigger, DOM.modals.occupation.modal, DOM.modals.occupation.close);
  setupModal(DOM.modals.virtue.trigger, DOM.modals.virtue.modal, DOM.modals.virtue.close);
  setupModal(DOM.modals.vice.trigger, DOM.modals.vice.modal, DOM.modals.vice.close);
  setupModal(null, DOM.modals.itemDetails.modal, DOM.modals.itemDetails.close);

  setupInitiativeTracker(DOM, state);
  setupTableMap(DOM.map);
  setupWidgetDashboard(DOM, state);

  populateGeneratorTables(DOM.modals);
  setupDmScreenTabs();
  // setupDmScreenAccordion(); // This is the old, conflicting one.
  setupCollapsibleWidgets();

  // --- NEW MERGED FUNCTIONS ---
  setupPlayTabAccordion(DOM);
  setupShopTab(DOM);
  // --- END NEW ---
}



// --- NETWORK FUNCTIONS ---

function setupWebSocket(state, DOM) {
  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const ws = new WebSocket(`${wsProtocol}//${window.location.host}`);

  ws.onopen = () => {
    console.log("WebSocket connected.");
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

function setupHeaderButtons(DOM) {
  if (DOM.openPlayerBtn) {
    DOM.openPlayerBtn.addEventListener("click", () => window.open('player.html', '_blank'));
  }

  // Core player preview button (opens in new tab/window)
  if (DOM.openPlayerLinkBtn) {
    DOM.openPlayerLinkBtn.addEventListener("click", () => window.open('player.html', '_blank'));
  }
  if (DOM.toggleMapBtn) {
    DOM.toggleMapBtn.addEventListener("click", () => {
      if (DOM.map.window) {
        DOM.map.window.classList.toggle("hidden");
        if (!DOM.map.window.classList.contains("hidden") && !DOM.map.window.classList.contains("collapsed")) {
          DOM.map.window.classList.add("collapsed");
          const icon = DOM.map.collapseBtn.querySelector('i');
          if (icon) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
          }
        }
      }
    });
  }
}

function setupTabs(DOM) {
  if (!DOM.tabsContainer) {
    console.warn("Tabs container not found, skipping tab setup.");
    return;
  }
  
  const allTabButtons = document.querySelectorAll(".tab-button");

  const activateTab = (tabId) => {
    if (!tabId) return;

    const targetContent = document.getElementById(tabId);
    if (!targetContent) {
      console.warn(`Tab content with ID '${tabId}' not found.`);
      return;
    }

    // Deactivate all tab buttons and contents
    allTabButtons.forEach(btn => {
      btn.classList.remove("active");
    });
    DOM.tabContents.forEach(content => {
      content.classList.remove("active");
    });

    // Activate the clicked tab and its content
    document.querySelectorAll(`.tab-button[data-tab="${tabId}"]`).forEach(button => {
        button.classList.add("active");
    });
    targetContent.classList.add("active");
  };

  // Listen on the whole document for tab button clicks
  document.body.addEventListener("click", (e) => {
    const button = e.target.closest(".tab-button");
    if (!button) return;

    const tabId = button.dataset.tab;
    activateTab(tabId);
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
  });
}

function updateGameUI(DOM, gameName) {
  const isDnd = (gameName === "D&D 5e");

  // Guarded toggles to avoid exceptions when elements are missing.
  if (DOM.dndTracker && DOM.dndTracker.classList) DOM.dndTracker.classList.toggle("hidden", !isDnd);
  if (DOM.dreadNightsScreen && DOM.dreadNightsScreen.classList) DOM.dreadNightsScreen.classList.toggle("hidden", isDnd);
  if (DOM.prepTabButton && DOM.prepTabButton.classList) DOM.prepTabButton.classList.toggle("hidden", isDnd);

  // If the currently active tab is now hidden, we need to switch to a visible one.
  if (isDnd) {
    if (DOM.prepTabButton && DOM.prepTabButton.classList && DOM.prepTabButton.classList.contains('active')) {
      if (DOM.prepTabButton.classList) DOM.prepTabButton.classList.remove('active');
      if (DOM.prepTabContent && DOM.prepTabContent.classList) DOM.prepTabContent.classList.remove('active');

      // Make DM screen active instead, guarding for existence
      if (DOM.dmScreenTabButton && DOM.dmScreenTabButton.classList) DOM.dmScreenTabButton.classList.add('active');
      if (DOM.dmScreenTabContent && DOM.dmScreenTabContent.classList) DOM.dmScreenTabContent.classList.add('active');
    }
  }

  // Populate game-specific actions on the right of the header.
  try {
    if (DOM.gameActions) {
      if (gameName === 'D&D 5e') {
        DOM.gameActions.innerHTML = `<button class="btn btn-secondary">Encounter Builder</button>`;
      } else {
        // For Dread Nights, we now use a permanent tab, so we just clear actions.
        DOM.gameActions.innerHTML = '';
      }
    }
  } catch (err) {
    console.warn('Failed to render game actions', err);
  }

  // Session start content: if the selected game is the placeholder, replace the session-start area
  try {
    if (gameName === 'Placeholder') {
      // show placeholder wrapper (if created) and hide original
      if (DOM._placeholderDreadNightsNode && DOM._originalDreadNightsNode) {
        DOM._placeholderDreadNightsNode.classList.remove('hidden');
        DOM._originalDreadNightsNode.classList.add('hidden');
      }
    } else {
      // restore original content when switching back to Dread Nights (or other games)
      if (DOM._placeholderDreadNightsNode && DOM._originalDreadNightsNode) {
        DOM._placeholderDreadNightsNode.classList.add('hidden');
        DOM._originalDreadNightsNode.classList.remove('hidden');
      }
    }
  } catch (err) {
    console.warn('Failed to update session-start content for game:', gameName, err);
  }
}

function setupHeaderToggle(DOM) {
  if (!DOM.header || !DOM.headerToggleBtn) return;

  // Restore persisted state (collapsed/open)
  const collapsed = localStorage.getItem('headerCollapsed') === 'true';
  if (collapsed) {
    DOM.header.classList.add('collapsed');
    const inner = document.getElementById('app-header-inner');
    if (inner) inner.setAttribute('aria-hidden', 'true');
    DOM.headerToggleBtn.setAttribute('aria-expanded', 'false');
  }

  DOM.headerToggleBtn.addEventListener('click', () => {
    const isCollapsed = DOM.header.classList.toggle('collapsed');
    const inner = document.getElementById('app-header-inner');
    if (inner) inner.setAttribute('aria-hidden', isCollapsed ? 'true' : 'false');
    DOM.headerToggleBtn.setAttribute('aria-expanded', String(!isCollapsed));
    localStorage.setItem('headerCollapsed', isCollapsed ? 'true' : 'false');
  });
}

function setupModal(trigger, modal, close) {
  // trigger may be null for programmatic-only modals
  if (trigger && modal) {
    try {
      trigger.addEventListener("click", () => modal.classList.add("active"));
    } catch (err) {
      console.warn('Failed to attach modal trigger listener', err);
    }
  }
  if (!modal || !close) return;

  try {
    close.addEventListener("click", () => modal.classList.remove("active"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });
  } catch (err) {
    console.warn('Modal setup failed for', modal, err);
  }
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

  const roadmapStepsArray = Array.from(DOM.prep.roadmapSteps);
  document.addEventListener('keydown', (e) => {
    const prepTab = document.getElementById('tab-prep');
    if (!prepTab || !prepTab.classList.contains('active')) return;

    const currentIndex = roadmapStepsArray.findIndex(s => s.classList.contains('active'));
    if (currentIndex === -1) return;

    let nextIndex = -1;
    if (e.key === 'ArrowRight') {
      nextIndex = currentIndex + 1;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = currentIndex - 1;
    }

    if (nextIndex >= 0 && nextIndex < roadmapStepsArray.length) {
      activateStep(roadmapStepsArray[nextIndex].dataset.step);
    }
  });

  activateStep("1");
}

function setupGuildSelection(DOM, state) {
  if (DOM.prep.guildCards.length === 0) return;

  DOM.prep.guildCards.forEach(card => {
    if (card.dataset.guild !== "Merchant") {
      card.addEventListener("click", (e) => {
         if (e.target.closest('.card-header')) return;
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
  if (modalDOM && modalDOM.guildName && modalDOM.guildName.content && typeof guildNamePart1 !== 'undefined' && typeof guildNamePart2 !== 'undefined') {
    const table1 = createSimpleNameTable(guildNamePart1, "Table 1");
    const table2 = createSimpleNameTable(guildNamePart2, "Table 2 (Red)");
    modalDOM.guildName.content.innerHTML = `
      <div class="name-table-wrapper">${table1}</div>
      <div class="name-table-wrapper">${table2}</div>
    `;
  }
  if (modalDOM && modalDOM.charName && modalDOM.charName.content && typeof characterNames !== 'undefined') {
    modalDOM.charName.content.innerHTML = `<div class="name-table-wrapper">${createSimpleNameTable(characterNames, "Hahmon Nimet")}</div>`;
  }
  if (modalDOM && modalDOM.occupation && modalDOM.occupation.content && typeof occupations !== 'undefined') {
    modalDOM.occupation.content.innerHTML = createOccupationTableHtml(occupations);
  }
  if (modalDOM && modalDOM.virtue && modalDOM.virtue.content && typeof virtues !== 'undefined') {
    modalDOM.virtue.content.innerHTML = createVirtueViceTableHtml(virtues, "Hyveet");
  }
  if (modalDOM && modalDOM.vice && modalDOM.vice.content && typeof vices !== 'undefined') {
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
      `<div class="occupation-result-card"><h3>${item.virtue}</h3><p>${linkifyItemNames(item.description)}</p></div>`
    );
  }
}

function setupViceGenerator(dom) {
  if (typeof vices !== 'undefined') {
    setupSimpleGenerator(dom.input, dom.result, vices, item => 
      `<div class="occupation-result-card"><h3>${item.vice}</h3><p>${linkifyItemNames(item.description)}</p></div>`
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
    if (index >= 0 && index < 50) {
      const item = occupations[index];
      let benefitHtml = item.benefit;
      if (typeof shopItems !== 'undefined') {
        benefitHtml = linkifyItemNames(benefitHtml);
      }
      return `<div class="occupation-result-card"><h3>${item.occupation}</h3><p>${benefitHtml}</p></div>`;
    }
    return "";
  };

  dom.input.addEventListener("input", () => {
    const d100roll = parseInt(dom.input.value, 10);
    const index = Math.ceil(d100roll / 2) - 1;
    if (d100roll >= 1 && d100roll <= 100) {
      dom.result.innerHTML = getCardHtml(d100roll);
      dom.rerollSection.classList.toggle("hidden", index !== 49);
    } else {
      dom.result.innerHTML = "";
      dom.rerollSection.classList.add("hidden");
    }
  });

  [
    { input: dom.reroll1, output: dom.rerollResult1 },
    { input: dom.reroll2, output: dom.rerollResult2 }
  ].forEach(pair => {
    pair.input.addEventListener("input", () => {
      pair.output.innerHTML = getCardHtml(parseInt(pair.input.value, 10));
    });
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

  DOM.dashboard.grid.addEventListener('click', (e) => {
    const collapseBtn = e.target.closest('.btn-widget-collapse');
    if (collapseBtn) {
      const widget = collapseBtn.closest('.grid-stack-item-content');
      const icon = collapseBtn.querySelector('i');
      if(widget) {
        
      }
    }

    const closeBtn = e.target.closest('.btn-widget-close');
    if (closeBtn) {
      const widgetEl = closeBtn.closest('.grid-stack-item');
      if (widgetEl) {
        state.grid.removeWidget(widgetEl);
      }
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
  const key = title === "Hyveet" ? "virtue" : "vice";
  const descKey = "description";
  
  let rows = data.map((item, index) => `<tr><td>${index + 1}</td><td>${item[key]}</td><td>${linkifyItemNames(item[descKey])}</td></tr>`).join("");
  
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
  let rows = data.map((item, index) => `<tr><td>${index + 1}</td><td>${item.occupation}</td><td>${linkifyItemNames(item.benefit)}</td></tr>`).join("");
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

function setupDmScreenTabs() {
    const dmScreen = document.getElementById('tab-dm-screen');
    if (!dmScreen) return;

    const tabButtons = dmScreen.querySelectorAll('.dm-tab-button');
    const tabContents = dmScreen.querySelectorAll('.dm-tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;

            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            tabContents.forEach(content => {
                if (content.id === tabId) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });
}

function setupCollapsibleWidgets() {
    const combatTrackerHeader = document.querySelector('#combat-tracker .widget-title.collapsible');
    if(combatTrackerHeader) {
        combatTrackerHeader.addEventListener('click', () => {
            const tracker = document.getElementById('combat-tracker');
            tracker.classList.toggle('collapsed');
        });
    }
}

// --- NEW: MERGED FROM play.js ---
function setupPlayTabAccordion(DOM) {
    const playTab = document.getElementById('tab-play');
    if (!playTab) return;

    const accordionHeaders = playTab.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const item = header.parentElement;

            // Toggle active class for content
            const isActive = content.classList.contains('active');

            // Close all accordions in the same card first
            const parentAccordion = item.parentElement;
            parentAccordion.querySelectorAll('.accordion-item').forEach(otherItem => {
                otherItem.querySelector('.accordion-content').classList.remove('active');
            });

            // If it wasn't active, open it
            if (!isActive) {
                content.classList.add('active');
            }
        });
    });
}

// --- NEW: MERGED FROM shop.js ---
function setupShopTab(DOM) {
    const shopContainer = DOM.shop.itemContainer;
    const occupationsContainer = DOM.shop.occupationContainer;

    if (!shopContainer || !occupationsContainer) {
        console.warn("Shop containers not found. Shop will not be populated.");
        return;
    }

    // Check if data is loaded
    if (typeof shopItems === 'undefined' || typeof occupations === 'undefined') {
        console.error("Shop data (shopItems or occupations) is missing.");
        return;
    }

    shopContainer.innerHTML = "";
    occupationsContainer.innerHTML = '<h2>Työnkuvat</h2>';

    shopItems.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.className = "shop-item";
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.type}</p>
            <div class="item-price">${item.price}</div>
        `;
        itemElement.addEventListener("click", () => openItemDetails(item.name));
        shopContainer.appendChild(itemElement);
    });

    occupations.forEach(occ => {
        const occElement = document.createElement("div");
        occElement.className = "shop-item occupation-item";
        let benefitContent = `<p>${linkifyItemNames(occ.benefit)}</p>`;

        occElement.innerHTML = `<h3>${occ.occupation}</h3>${benefitContent}`;
        occupationsContainer.appendChild(occElement);
    });
}