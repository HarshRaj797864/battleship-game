import "./styles/style.css";
import "./styles/setupDnD.css";
import "./styles/startScreen.css";
import { ScreenController } from "./modules/ScreenController";

document.addEventListener("DOMContentLoaded", () => {
  ScreenController.init();
  console.log("System initialized. Waiting for user input via Modal.");
});
