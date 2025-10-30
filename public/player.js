/**
 * player.js
 *
 * Logic for the player.html screen.
 * Connects via WebSocket and displays received data.
 */

document.addEventListener("DOMContentLoaded", () => {
  let initiativeList = [];
  const DOM = {
    modeSelect: document.getElementById("mode-select"),
    initiativeContent: document.getElementById("initiative-mode-content"),
    backgroundContent: document.getElementById("background-mode-content"),
    listEl: document.getElementById("player-init-list"),
    waitingMsg: document.getElementById("waiting-msg"),
    fullscreenBtn: document.getElementById("fullscreen-btn"),
  };

  function setupModeSelection() {
    if (!DOM.modeSelect || !DOM.initiativeContent || !DOM.backgroundContent) return;

    DOM.modeSelect.addEventListener("change", (e) => {
      const isInitiative = e.target.value === "initiative";
      DOM.initiativeContent.classList.toggle("hidden", !isInitiative);
      DOM.backgroundContent.classList.toggle("hidden", isInitiative);
    });
  }

  function setupWebSocket() {
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${wsProtocol}//${window.location.host}`);

    ws.onopen = () => console.log("Player WebSocket connected.");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "initiative-update") {
        const isNewItem = data.payload.length > initiativeList.length;
        initiativeList = data.payload;
        renderInitiativeList(isNewItem);
      }
      // Note: "game-change" logic can be handled here if needed,
      // e.g., to force a view change.
    };

    ws.onclose = () => {
      console.log("Player WebSocket disconnected. Reconnecting...");
      setTimeout(setupWebSocket, 3000);
    };
  }

  function renderInitiativeList(animateNew) {
    if (!DOM.listEl || !DOM.waitingMsg) return;

    DOM.listEl.innerHTML = ""; // Clear list

    if (initiativeList.length === 0) {
      DOM.waitingMsg.style.display = "block";
    } else {
      DOM.waitingMsg.style.display = "none";
    }

    initiativeList.forEach((item, index) => {
      const li = document.createElement("li");
      
      const iconContainer = document.createElement("div");
      iconContainer.className = "player-icon-container";
      const icon = document.createElement("i");
      icon.className = item.iconClass;
      iconContainer.appendChild(icon);
      
      const rollSpan = document.createElement("span");
      rollSpan.className = "init-roll";
      rollSpan.textContent = item.roll;

      li.append(iconContainer, rollSpan);

      // Animation for the last added item
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
        iconContainer.appendChild(sparkleContainer);
        
        // Clean up animations
        setTimeout(() => li.classList.remove("new-item-pop"), 600);
        setTimeout(() => sparkleContainer.remove(), 1000);
      }
      DOM.listEl.appendChild(li);
    });
  }

  /**
   * UPDATED: Fullscreen function now targets the active content pane.
   */
  function setupFullscreen() {
    if (!DOM.fullscreenBtn) return;

    DOM.fullscreenBtn.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        // Check which mode is active
        const selectedMode = DOM.modeSelect.value;
        let elementToFullscreen;

        if (selectedMode === "initiative") {
          elementToFullscreen = DOM.initiativeContent;
        } else { // 'background'
          elementToFullscreen = DOM.backgroundContent;
        }
        
        // Request fullscreen on the *specific element*
        if (elementToFullscreen && elementToFullscreen.requestFullscreen) {
          elementToFullscreen.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
          });
          DOM.fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i> Exit Fullscreen';
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          document.exitFullscreen();
          DOM.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> Fullscreen';
        }
      }
    });

    // Also update button text when exiting fullscreen with 'Esc' key
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        DOM.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> Fullscreen';
      }
    });
  }

  // Initialize all components
  setupModeSelection();
  setupWebSocket();
  setupFullscreen();
});
