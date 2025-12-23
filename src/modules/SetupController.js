import { DomManager } from "./DomManager";
import { Ship } from "./ship";
import { gameController } from "./gameController";

const FLEET_CONFIG = [
  { name: "Carrier", length: 5 },
  { name: "Battleship", length: 4 },
  { name: "Cruiser", length: 3 },
  { name: "Submarine", length: 3 },
  { name: "Destroyer", length: 2 },
];
import carrierIcon from "../assets/carrier.svg";
import battleshipIcon from "../assets/battleship.svg";
import cruiserIcon from "../assets/cruiser.svg";
import submarineIcon from "../assets/submarine.svg";
import destroyerIcon from "../assets/destroyer.svg";

const SHIP_ICONS = {
  carrier: carrierIcon,
  battleship: battleshipIcon,
  cruiser: cruiserIcon,
  submarine: submarineIcon,
  destroyer: destroyerIcon,
};

export const SetupController = (() => {
  let player,
    isHorizontal = true,
    draggedShipLength = 0,
    draggedShipElement = null;
  // const fleet = [5, 4, 3, 3, 2];
  let shipsToPlace = [];

  const setupContainer = document.getElementById("setup-container");
  const harborGrid = document.getElementById("fleet-harbor");
  const setupBoard = document.getElementById("setup-board");
  const rotateBtn = document.getElementById("rotate-btn");
  const finishBtn = document.getElementById("finish-setup-btn");
  const gameContainer = document.getElementById("game-container");
  const resetBtn = document.getElementById("reset-btn");

  const init = (playerInstance) => {
    player = playerInstance;
    shipsToPlace = JSON.parse(JSON.stringify(FLEET_CONFIG));
    isHorizontal = true;
    draggedShipLength = 0;
    updateRotateButton();
    renderHarbor();
    renderBoard();
    toggleFinishButton();

    rotateBtn.onclick = toggleAxis;
    finishBtn.onclick = () => {
      setupContainer.classList.add("hidden");
      gameContainer.classList.remove("hidden");
      gameController.startGame();
    };
    resetBtn.onclick = () => {
      player.board.reset();

      shipsToPlace = JSON.parse(JSON.stringify(FLEET_CONFIG));
      draggedShipLength = 0;
      isHorizontal = true;

      renderHarbor();
      renderBoard();
      DomManager.renderFleet(player.board, "setup-board", false);
      updateRotateButton();
      toggleFinishButton();
    };
  };

  const toggleAxis = () => {
    isHorizontal = !isHorizontal;
    updateRotateButton();
  };

  const updateRotateButton = () => {
    rotateBtn.textContent = isHorizontal
      ? "AXIS: X (Horizontal)"
      : "AXIS: Y (Vertical)";
  };

  const toggleFinishButton = () => {
    const isEmpty = shipsToPlace.length === 0;
    finishBtn.disabled = !isEmpty;
    finishBtn.classList.toggle("disabled", !isEmpty);
  };

  const renderHarbor = () => {
    harborGrid.innerHTML = "";

    shipsToPlace.forEach((ship, index) => {
      // 1. Create the Card Container
      const card = document.createElement("div");
      card.classList.add("ship-card");
      card.setAttribute("draggable", "true");

      // Data attributes for logic and styling
      card.dataset.ship = ship.name.toLowerCase();
      card.dataset.length = ship.length;
      card.dataset.index = index;

      const iconSrc = SHIP_ICONS[ship.name.toLowerCase()];

      card.innerHTML = `
  <div class="ship-content">
    <img src="${iconSrc}" class="ship-image" alt="${ship.name}">
    <div class="ship-info">${ship.name} (${ship.length})</div>
  </div>
`;

      // 3. Drag Events
      card.addEventListener("dragstart", (e) => {
        draggedShipLength = ship.length;
        draggedShipElement = card; // Track the element so we can remove it later

        card.classList.add("dragging");

        // Pass length for valid placement check
        e.dataTransfer.setData("text/plain", ship.length);
        // Set drag image ghost (optional, but looks better)
        // e.dataTransfer.setDragImage(card, 0, 0);
      });

      card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
        clearHighlights();
      });

      harborGrid.appendChild(card);
    });
  };
  const renderBoard = () => {
    DomManager.renderBoard(player.board, "setup-board", false);
    setupBoard.querySelectorAll(".cell").forEach((cell) => {
      cell.addEventListener("dragover", handleDragOver);
      cell.addEventListener("dragleave", () => {});
      cell.addEventListener("drop", handleDrop);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    const startX = parseInt(e.target.dataset.x);
    const startY = parseInt(e.target.dataset.y);
    if (isNaN(startX) || isNaN(startY)) return;

    const coords = getShipCoordinates(startX, startY, draggedShipLength);
    const isValid = isValidPlacement(coords);
    clearHighlights();

    coords.forEach(({ x, y }) => {
      const cell = setupBoard.querySelector(
        `.cell[data-x="${x}"][data-y="${y}"]`
      );
      if (cell) cell.classList.add(isValid ? "hover-valid" : "hover-invalid");
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    clearHighlights();
    const x = parseInt(e.target.dataset.x);
    const y = parseInt(e.target.dataset.y);

    try {
      const newShip = new Ship(draggedShipLength);
      newShip.name = draggedShipElement.dataset.ship;
      player.board.placeShip(newShip, x, y, !isHorizontal);
      shipsToPlace.splice(parseInt(draggedShipElement.dataset.index), 1);
      renderHarbor();
      renderBoard();
      toggleFinishButton();
      DomManager.renderFleet(player.board, "setup-board", false);
    } catch {
      console.log("Invalid Placement");
    }
  };

  const getShipCoordinates = (x, y, length) => {
    const coords = [];
    for (let i = 0; i < length; i++) {
      coords.push(isHorizontal ? { x, y: y + i } : { x: x + i, y });
    }
    return coords;
  };

  const isValidPlacement = (coords) => {
    return coords.every(({ x, y }) => {
      if (x < 0 || x >= 10 || y < 0 || y >= 10) return false;
      return player.board.getGrid()[x][y] === null;
    });
  };

  const clearHighlights = () => {
    setupBoard
      .querySelectorAll(".cell")
      .forEach((cell) => cell.classList.remove("hover-valid", "hover-invalid"));
  };

  return { init };
})();
