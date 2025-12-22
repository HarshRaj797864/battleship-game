import { DomManager } from "./DomManager";
import { getPlayer } from "./player";
// import { createGameboard } from "./gameboard";
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
  const bindEvents = () => {};
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
    bindEvents();
  };
  //   creating it early for the spy
  const playComputerTurn = () => {};
  const playRound = (x, y) => {
    if (
      state.isGameOver ||
      state.activePlayer === state.playerTwo ||
      state.isProcessing
    )
      return;

    const attacked = state.playerOne.attack(state.playerTwo.board, x, y);
    if (attacked !== null) {
      // if (attacked === true) {}
      DomManager.updateCell("computer-board", x, y, attacked, null);
      state.activePlayer = state.playerTwo;
      gameController.playComputerTurn();
    }
    return;
  };

  return {
    state,
    placeShipsRandomly,
    initializeGame,
    playRound,
    playComputerTurn,
  };
})();
