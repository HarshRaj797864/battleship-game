import { DomManager } from "./DomManager";
import { getPlayer } from "./player";
import { ScreenController } from "./ScreenController";
import { Ship } from "./ship";

export const gameController = (() => {
  const state = {
    playerOne: null,
    playerTwo: null,
    activePlayer: null,
    isGameOver: false,
    isProcessing: false,
  };

  const placeShipsRandomly = (player) => {
    [5, 4, 3, 3, 2].forEach((len) => {
      let placed = false;
      while (!placed) {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        const isVertical = Math.random() < 0.5;
        try {
          player.board.placeShip(new Ship(len), x, y, isVertical);
          placed = true;
        } catch {
          console.log("not allowed");
        }
      }
    });
  };

  const initPlayers = (name) => {
    state.playerOne = getPlayer(name, "human");
    state.playerTwo = getPlayer("computer", "computer");
    placeShipsRandomly(state.playerTwo); // Computer ships only
    return state.playerOne;
  };

  const startGame = () => {
    DomManager.renderBoard(state.playerOne.board, "player-board", false);
    DomManager.renderBoard(state.playerTwo.board, "computer-board", true);
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
      const ship = !missed && p1Board.getShipAt(x, y);
      const shipCoords = ship?.isSunk()
        ? p1Board.getShipCoordinates(ship)
        : null;

      DomManager.updateCell("player-board", x, y, !missed, shipCoords);

      if (p1Board.allShipSunk()) {
        state.isGameOver = true;
        ScreenController.showGameOver(state.playerTwo.name);
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
      const shipCoords = ship?.isSunk()
        ? p2Board.getShipCoordinates(ship)
        : null;

      DomManager.updateCell("computer-board", x, y, hit, shipCoords);

      if (p2Board.allShipSunk()) {
        state.isGameOver = true;
        ScreenController.showGameOver(state.playerOne.name);
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
    document.getElementById("player-board").innerHTML = "";
    document.getElementById("computer-board").innerHTML = "";
  };

  return { initPlayers, startGame, playRound, resetGame };
})();
