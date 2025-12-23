import { DomManager } from "./DomManager";
import { Ship } from "./ship";
import { gameController } from "./gameController";

export const SetupController = (() => {
  let player,
    isHorizontal = true,
    draggedShipLength = 0,
    draggedShipElement = null;
  const fleet = [5, 4, 3, 3, 2];
  let shipsToPlace = [...fleet];

  const setupContainer = document.getElementById("setup-container");
  const harborGrid = document.getElementById("fleet-harbor");
  const setupBoard = document.getElementById("setup-board");
  const rotateBtn = document.getElementById("rotate-btn");
  const finishBtn = document.getElementById("finish-setup-btn");
  const gameContainer = document.getElementById("game-container");

  const init = (playerInstance) => {
    player = playerInstance;
    shipsToPlace = [...fleet];
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
    shipsToPlace.forEach((length, index) => {
      const shipDiv = document.createElement("div");
      shipDiv.classList.add("ship-draggable");
      Object.assign(shipDiv, { draggable: true, textContent: length });
      shipDiv.dataset.length = length;
      shipDiv.dataset.index = index;
      shipDiv.style.cssText = `width: ${length * 5}rem; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;`;

      shipDiv.addEventListener("dragstart", (e) => {
        draggedShipLength = length;
        draggedShipElement = shipDiv;
        shipDiv.classList.add("dragging");
        e.dataTransfer.setData("text/plain", length);
      });

      shipDiv.addEventListener("dragend", () => {
        shipDiv.classList.remove("dragging");
        clearHighlights();
      });

      harborGrid.appendChild(shipDiv);
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
      player.board.placeShip(new Ship(draggedShipLength), x, y, !isHorizontal);
      shipsToPlace.splice(parseInt(draggedShipElement.dataset.index), 1);
      renderHarbor();
      renderBoard();
      toggleFinishButton();
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
