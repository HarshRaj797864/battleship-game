import "./styles/style.css";
import "./styles/setupDnD.css";
import "./styles/startScreen.css";
import "./styles/modal.css";
import "./styles/drag-drop.css";
import { ScreenController } from "./modules/ScreenController";

document.addEventListener("DOMContentLoaded", () => {
  ScreenController.init();
  console.log("System initialized. Waiting for user input via Modal.");
});

/* --- MODAL CONTROL LOGIC --- */
const startModal = document.getElementById("start-modal");
const startBtn = document.getElementById("start-btn");

if (startBtn) {
  startBtn.addEventListener("click", () => {
    startModal.classList.remove("is-hidden");
    startModal.showModal();
  });
}

startModal.addEventListener("click", (e) => {
  const dialogDimensions = startModal.getBoundingClientRect();

  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    startModal.classList.add("is-hidden");

    startModal.close();
  }
});
