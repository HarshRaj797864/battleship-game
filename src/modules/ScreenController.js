import { gameController } from "./gameController";

const ScreenController = (() => {
  const startScreen = document.getElementById("start-game-wrapper");
  const startBtn = document.getElementById("start-btn");
  const gameContainer = document.getElementById("game-container");
  const startModal = document.getElementById("start-modal");
  const startForm = document.getElementById("start-form");
  const nameInput = document.getElementById("player-name");
  const nameError = document.querySelector(".error-message");
  // game over DOM
  const gameOverModal = document.getElementById("game-over-modal");
  const winnerDisplay = document.getElementById("winner-display");
  const restartBtn = document.getElementById("restart-btn");
  // themeChangers
  const settingsBtn = document.getElementById("settings-btn");
  const settingsMenu = document.getElementById("settings-menu");
  const themeButtons = document.querySelectorAll(".dropdown-content button");
  const init = () => {
    setupEventListeners();
    setupDropdownListeners();
  };

  const setupEventListeners = () => {
    startBtn.addEventListener("click", () => {
      startModal.showModal();
    });

    nameInput.addEventListener("input", () => {
      validateNameInput();
    });

    startForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (validateNameInput()) {
        const playerName = nameInput.value;

        startModal.close();
        startScreen.classList.add("hidden");
        gameContainer.classList.remove("hidden");

        gameController.initializeGame(playerName);
      }
    });
    restartBtn.addEventListener("click", () => {
      gameOverModal.close();

      gameContainer.classList.add("hidden");
      startScreen.classList.remove("hidden");

      gameController.resetGame();
    });
  };
  const setupDropdownListeners = () => {
    settingsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      settingsMenu.classList.toggle("show");
    });

    // 2. Close Dropdown when clicking outside
    window.addEventListener("click", (e) => {
      if (!e.target.matches("#settings-btn")) {
        if (settingsMenu.classList.contains("show")) {
          settingsMenu.classList.remove("show");
        }
      }
    });

    // 3. Theme Switching Logic
    themeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const theme = e.target.dataset.theme;

        if (theme === "retro") {
          document.body.classList.add("retro");
        } else {
          document.body.classList.remove("retro");
        }

        // Close menu after selection
        settingsMenu.classList.remove("show");
      });
    });
  };

  const validateNameInput = () => {
    if (nameInput.validity.valueMissing) {
      showError("Admiral, we need a name to authorize the fleet.");
      return false;
    } else if (nameInput.value.length < 3) {
      showError("Name too short! Minimum 3 characters.");
      return false;
    } else {
      showError("");
      nameInput.classList.remove("invalid");
      nameInput.classList.add("valid");
      return true;
    }
  };

  const showError = (message) => {
    nameError.textContent = message;
    if (message) {
      nameInput.classList.add("invalid");
    } else {
      nameInput.classList.remove("invalid");
    }
  };

  const showGameOver = (winnerName) => {
    winnerDisplay.textContent = `${winnerName.toUpperCase()} WINS!`;
    gameOverModal.showModal();
  };

  return { init, showGameOver };
})();

export { ScreenController };
