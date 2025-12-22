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
  return { renderBoard, updateCell, disableBoard, enableBoard };
})();
