export const DomManager = (() => {
  const renderBoard = (gameBoard, containerId, isEnemy) => {
    // first clear the board before painting
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    const grid = gameBoard.getGrid();
    // looping through the rows and cols
    grid.forEach((row, rowIdx) => {
      row.forEach((val, colIdx) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.x = rowIdx;
        cell.dataset.y = colIdx;

        if (!isEnemy) {
          if (val !== null) {
            cell.classList.add("ship");
          }
        }
        const shot = gameBoard
          .getAttackedShots()
          .find((m) => m.x === rowIdx && m.y === colIdx);

        if (shot) {
          if (shot.missed) {
            cell.classList.add("miss");
          } else {
            cell.classList.add("hit");
            if (val && val.isSunk()) {
              cell.classList.add("sunk");
            }
          }
        }
        container.appendChild(cell);
      });
    });
  };
  // optimization:- does not update entire board but the cell changed
  const updateCell = (containerId, x, y, result, shipCoords = null) => {
    const container = document.getElementById(containerId);

    if (result === true) {
      // shipCoords not null implies the ship sunk
      if (shipCoords) {
        shipCoords.forEach((coords) => {
          const cell = container.querySelector(
            `[data-x="${coords.x}"][data-y="${coords.y}"]`
          );
          if (cell) cell.classList.add("hit", "sunk");
        });
      } else {
        const cell = container.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        if (cell) cell.classList.add("hit");
      }
    } else if (result === false) {
      const cell = container.querySelector(`[data-x="${x}"][data-y="${y}"]`);
      cell.classList.add("miss");
    }
  };
  const disableBoard = (containerId) => {
    const container = document.getElementById(containerId);
    container.classList.add("disabled");
  };
  const enableBoard = (containerId) => {
    const container = document.getElementById(containerId);
    container.classList.remove("disabled");
  };
  const bindEvents = (containerId, handler) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.addEventListener("click", (e) => {
      const x = e.target.dataset.x;
      const y = e.target.dataset.y;
      if (x !== undefined && y !== undefined) {
        handler(parseInt(x), parseInt(y));
      }
    });
  };
  const renderDockyard = (fleetList) => {
    const harbor = document.getElementById("fleet-harbor");
    harbor.innerHTML = "";

    fleetList.forEach((ship) => {
      const card = document.createElement("div");
      card.classList.add("ship-card");
      card.setAttribute("draggable", "true");
      card.dataset.ship = ship.name.toLowerCase();
      card.dataset.length = ship.length;

      card.innerHTML = `
        <div class="ship-content">
          <img src="./assets/${ship.name.toLowerCase()}.svg" class="ship-image" alt="${ship.name}">
          <div class="ship-info">${ship.name} (${ship.length})</div>
        </div>
      `;

      card.addEventListener("dragstart", (e) => {
        card.classList.add("dragging");

        e.dataTransfer.setData("text/plain", ship.name.toLowerCase());
        e.dataTransfer.setData("length", ship.length);
      });

      card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
      });

      harbor.appendChild(card);
    });
  };
  return {
    renderBoard,
    updateCell,
    disableBoard,
    enableBoard,
    bindEvents,
    renderDockyard,
  };
})();
