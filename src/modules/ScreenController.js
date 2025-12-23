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

  const init = () => {
    setupEventListeners();
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
