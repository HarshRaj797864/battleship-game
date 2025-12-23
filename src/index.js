import "./styles/style.css";
import { ScreenController } from "./modules/ScreenController"; // Import the new controller

document.addEventListener("DOMContentLoaded", () => {
  // We no longer call gameController.initializeGame directly.
  // We let the ScreenController handle the UI flow.
  ScreenController.init();

  console.log("System initialized. Waiting for user input via Modal.");
});
