import { DomManager } from "./DomManager";
import { getPlayer } from "./player";
import { ScreenController } from "./ScreenController";
import { Ship } from "./ship";

export const gameController = (() => {
  const state = {
    playerOne: null,
    playerTwo: null,
    activePlayer: null,
    isGameOver: null,
    isProcessing: false,
  };
  // building auto-place helper function as a temporary replacement of drag and drop mechanism of placing ships
  const placeShipsRandomly = (player) => {
    const fleet = [5, 4, 3, 3, 2]; // ship lengths

    fleet.forEach((len) => {
      let counter = 0;
      while (counter < 100) {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        // let isVertical = Math.floor(Math.random() * 2) === 0 ? false : true;
        let isVertical = Math.random() < 0.5;
        try {
          player.board.placeShip(new Ship(len), x, y, isVertical);
          break;
        } catch {
          counter++;
          continue;
        }
      }
    });
  };

  const initializeGame = (name) => {
    state.playerOne = getPlayer(name, "human");
    state.playerTwo = getPlayer("computer", "computer");
    placeShipsRandomly(state.playerOne);
    placeShipsRandomly(state.playerTwo);
    DomManager.renderBoard(state.playerOne.board, "player-board", false);
    DomManager.renderBoard(state.playerTwo.board, "computer-board", true);
    state.activePlayer = state.playerOne;
    state.isGameOver = false;
    state.isProcessing = false;
    DomManager.bindEvents("computer-board", playRound);
  };
  //   creating it early for the spy
  const playComputerTurn = () => {
    state.isProcessing = true;
    DomManager.disableBoard("computer-board");
    setTimeout(() => {
      state.playerTwo.randomAttack(state.playerOne.board);
      const coords = state.playerOne.board.getAttackedShots();
      const shotStatus = coords.at(-1);
      let ship;
      let shipCoords;

      if (shotStatus.missed === false) {
        ship = state.playerOne.board.getShipAt(shotStatus.x, shotStatus.y);
      }
      if (ship && ship.isSunk()) {
        shipCoords = state.playerOne.board.getShipCoordinates(ship);
      } else {
        shipCoords = null;
      }
      DomManager.updateCell(
        "player-board",
        shotStatus.x,
        shotStatus.y,
        !shotStatus.missed,
        shipCoords
      );
      if (state.playerOne.board.allShipSunk()) {
        // Human ships are gone. Computer (Player Two) wins.
        state.isGameOver = true;
        ScreenController.showGameOver(state.playerTwo.name);
      } else {
        // Game continues: Pass turn back to Human
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

    const attacked = state.playerOne.attack(state.playerTwo.board, x, y);
    if (attacked !== null) {
      const ship = state.playerTwo.board.getShipAt(x, y);
      let coords;
      if (ship && ship.isSunk()) {
        coords = state.playerTwo.board.getShipCoordinates(ship);
      } else {
        coords = null;
      }

      DomManager.updateCell("computer-board", x, y, attacked, coords);
      if (state.playerTwo.board.allShipSunk()) {
        state.isGameOver = true;
        ScreenController.showGameOver(state.playerOne.name);
        return;
      }
      state.activePlayer = state.playerTwo;
      gameController.playComputerTurn();
    }
    return;
  };

  const resetGame = () => {
    state.playerOne = null;
    state.playerTwo = null;
    state.isGameOver = false;
    state.activePlayer = null;

    document.getElementById("player-board").innerHTML = "";
    document.getElementById("computer-board").innerHTML = "";
  };
  return {
    state,
    placeShipsRandomly,
    initializeGame,
    playRound,
    playComputerTurn,
    resetGame,
  };
})();
