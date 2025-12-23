import { gameController } from "./gameController";
import { SetupController } from "./SetupController";

const ScreenController = (() => {
  const el = {
    startScreen: document.getElementById("start-game-wrapper"),
    startBtn: document.getElementById("start-btn"),
    gameContainer: document.getElementById("game-container"),
    startModal: document.getElementById("start-modal"),
    startForm: document.getElementById("start-form"),
    nameInput: document.getElementById("player-name"),
    nameError: document.querySelector(".error-message"),
    gameOverModal: document.getElementById("game-over-modal"),
    winnerDisplay: document.getElementById("winner-display"),
    restartBtn: document.getElementById("restart-btn"),
    settingsBtn: document.getElementById("settings-btn"),
    settingsMenu: document.getElementById("settings-menu"),
    setupContainer: document.getElementById("setup-container"),
    themeBtns: document.querySelectorAll(".dropdown-content button"),
  };

  const init = () => {
    el.startBtn.onclick = () => el.startModal.showModal();
    el.nameInput.oninput = validateInput;

    el.startForm.onsubmit = (e) => {
      e.preventDefault();
      if (!validateInput()) return;

      el.startModal.close();
      el.startScreen.classList.add("hidden");
      el.setupContainer.classList.remove("hidden");

      const player = gameController.initPlayers(el.nameInput.value);
      SetupController.init(player);
    };

    el.restartBtn.onclick = () => {
      el.gameOverModal.close();
      el.gameContainer.classList.add("hidden");
      el.setupContainer.classList.add("hidden");
      el.startScreen.classList.remove("hidden");
      gameController.resetGame();
    };

    setupDropdown();
  };

  const setupDropdown = () => {
    el.settingsBtn.onclick = (e) => {
      e.stopPropagation();
      el.settingsMenu.classList.toggle("show");
    };

    window.onclick = (e) => {
      if (!e.target.closest("#settings-btn"))
        el.settingsMenu.classList.remove("show");
    };

    el.themeBtns.forEach(
      (btn) =>
        (btn.onclick = (e) => {
          document.body.classList.toggle(
            "retro",
            e.target.dataset.theme === "retro"
          );
          el.settingsMenu.classList.remove("show");
        })
    );
  };

  const validateInput = () => {
    const val = el.nameInput.value;
    const msg = !val
      ? "Admiral, we need a name."
      : val.length < 3
        ? "Name too short!"
        : "";

    el.nameError.textContent = msg;
    el.nameInput.classList.toggle("invalid", !!msg);
    el.nameInput.classList.toggle("valid", !msg);
    return !msg;
  };

  const showGameOver = (winner) => {
    el.winnerDisplay.textContent = `${winner.toUpperCase()} WINS!`;
    el.gameOverModal.showModal();
  };

  return { init, showGameOver };
})();

export { ScreenController };
