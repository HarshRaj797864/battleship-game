import "./styles/style.css";
import { gameController } from "./modules/gameController";

document.addEventListener("DOMContentLoaded", () => {
  gameController.initializeGame("Commander");

  console.log("System initialized. Waiting for orders.");
});
