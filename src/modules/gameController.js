import { DomManager } from "./DomManager";
import { getPlayer } from "./player";
import { Ship } from "./ship";

export const gameController = (() => {
  const state = {
    playerOne: null,
    playerTwo: null,
    activePlayer: null,
    isGameOver: false,
    isProcessing: false,
  };

  // 1. Placeholder for the UI function
  let gameOverHandler = null;

  // 2. Method to receive the UI function safely
  const bindGameOverHandler = (callback) => {
    gameOverHandler = callback;
  };

  const placeShipsRandomly = (player) => {
    const fleet = [
      { name: "Carrier", length: 5 },
      { name: "Battleship", length: 4 },
      { name: "Cruiser", length: 3 },
      { name: "Submarine", length: 3 },
      { name: "Destroyer", length: 2 },
    ];
    fleet.forEach((shipData) => {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        const isVertical = Math.random() < 0.5;
        try {
          const newShip = new Ship(shipData.length);
          newShip.name = shipData.name;
          player.board.placeShip(newShip, x, y, isVertical);
          placed = true;
        } catch {
          attempts++;
        }
      }
    });
  };

  const initPlayers = (name) => {
    state.playerOne = getPlayer(name, "human");
    state.playerTwo = getPlayer("computer", "computer");
    placeShipsRandomly(state.playerTwo);
    return state.playerOne;
  };

  const startGame = () => {
    DomManager.renderBoard(state.playerOne.board, "player-board", false);
    DomManager.renderBoard(state.playerTwo.board, "computer-board", true);
    DomManager.renderFleet(state.playerOne.board, "player-board", false);
    DomManager.renderFleet(state.playerTwo.board, "computer-board", true);
    state.activePlayer = state.playerOne;
    state.isGameOver = false;
    state.isProcessing = false;
    DomManager.bindEvents("computer-board", playRound);
  };

  const playComputerTurn = () => {
    state.isProcessing = true;
    DomManager.disableBoard("computer-board");

    setTimeout(() => {
      const p1Board = state.playerOne.board;
      state.playerTwo.randomAttack(p1Board);

      const { x, y, missed } = p1Board.getAttackedShots().at(-1);

      // Safety Check: ensure ship exists before accessing methods
      const ship = !missed ? p1Board.getShipAt(x, y) : null;

      // Use optional chaining for safety
      const shipCoords =
        ship && typeof ship.isSunk === "function" && ship.isSunk()
          ? p1Board.getShipCoordinates(ship)
          : null;
      DomManager.updateCell("player-board", x, y, !missed, shipCoords);
      if (ship && ship.isSunk()) {
        DomManager.renderFleet(p1Board, "player-board", false);
      }

      if (p1Board.allShipSunk()) {
        state.isGameOver = true;
        // 3. Call the handler instead of the imported module
        if (gameOverHandler) gameOverHandler(state.playerTwo.name);
      } else {
        state.activePlayer = state.playerOne;
        state.isProcessing = false;
        DomManager.enableBoard("computer-board");
      }
    }, 800);
  };

  const playRound = (x, y) => {
    if (
      state.isGameOver ||
      state.activePlayer === state.playerTwo ||
      state.isProcessing
    )
      return;

    const p2Board = state.playerTwo.board;
    const hit = state.playerOne.attack(p2Board, x, y);

    if (hit !== null) {
      const ship = p2Board.getShipAt(x, y);

      // Use optional chaining for safety
      const shipCoords =
        ship && typeof ship.isSunk === "function" && ship.isSunk()
          ? p2Board.getShipCoordinates(ship)
          : null;

      DomManager.updateCell("computer-board", x, y, hit, shipCoords);

      if (ship && ship.isSunk()) {
        DomManager.renderFleet(p2Board, "computer-board", true);
      }

      if (p2Board.allShipSunk()) {
        state.isGameOver = true;
        // 3. Call the handler instead of the imported module
        if (gameOverHandler) gameOverHandler(state.playerOne.name);
      } else {
        state.activePlayer = state.playerTwo;
        playComputerTurn();
      }
    }
  };

  const resetGame = () => {
    state.playerOne = null;
    state.playerTwo = null;
    state.isGameOver = false;
    state.activePlayer = null;
    const p1Board = document.getElementById("player-board");
    const p2Board = document.getElementById("computer-board");
    if (p1Board) p1Board.innerHTML = "";
    if (p2Board) p2Board.innerHTML = "";
  };

  return {
    initPlayers,
    startGame,
    playRound,
    playComputerTurn,
    placeShipsRandomly,
    resetGame,
    bindGameOverHandler, // Exporting the new connection point
    state,
  };
})();
