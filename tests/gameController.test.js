import { gameController } from "../src/modules/gameController";
import { getPlayer } from "../src/modules/player";
// import { createGameboard } from "../src/modules/gameboard";
// import { Ship } from "../src/modules/ship";
import { DomManager } from "../src/modules/DomManager";

jest.mock("../src/modules/DomManager", () => ({
  DomManager: {
    renderBoard: jest.fn(),
    updateCell: jest.fn(),
  },
}));

describe("tests for gameController", () => {
  describe("tests for placeShipsRandomly", () => {
    let player, board, ships;

    beforeEach(() => {
      player = getPlayer("Harsh");
      board = player.board;
      gameController.placeShipsRandomly(player);
      ships = board.getShips();
    });

    test("placeShipsRandomly places a ship successfully in the game board", () => {
      let coords = board.getShipCoordinates(ships[0]);
      expect(ships.length).toBeGreaterThan(0);
      expect(coords.length).toBeGreaterThan(1);
    });
    test("placeShips places 5 different ships successfully in the game board", () => {
      expect(ships.length).toEqual(5);
      ships.forEach((ship) => {
        const c = board.getShipCoordinates(ship);
        expect(c.length).toBeGreaterThan(0);
      });
    });
  });

  describe("tests for initializeGame", () => {
    let state;

    beforeEach(() => {
      jest.clearAllMocks();
      gameController.initializeGame("Harsh");
      state = gameController.state;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("all the conditions for initial state of game are met", () => {
      expect(state.playerOne.type).toEqual("human");
      expect(state.playerTwo.type).toEqual("computer");
      // placeShips are called
      expect(state.playerOne.board.getShips().length).toEqual(5);
      expect(state.playerTwo.board.getShips().length).toEqual(5);
      expect(state.activePlayer).toEqual(state.playerOne);
    });
    test("initializeGame rendered 2 boards for 2 players successfully", () => {
      expect(DomManager.renderBoard).toHaveBeenCalledTimes(2);

      expect(DomManager.renderBoard).toHaveBeenCalledWith(
        state.playerOne.board,
        "player-board",
        false
      );

      expect(DomManager.renderBoard).toHaveBeenCalledWith(
        state.playerTwo.board,
        "computer-board",
        true
      );
    });
  });

  describe("playRound", () => {
    let state;

    beforeEach(() => {
      jest.clearAllMocks();
      jest
        .spyOn(gameController, "playComputerTurn") //using .spyOn as it allows undo feature and scope supports
        .mockImplementation(() => {});
      gameController.initializeGame("Harsh");
      state = gameController.state;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("test should return early if isGameOver is true ", () => {
      state.isGameOver = true;
      const spy = jest.spyOn(state.playerTwo.board, "receiveAttack");
      gameController.playRound(5, 5);
      expect(spy).not.toHaveBeenCalled();
    });
    test("test should return early if activePlayer is computer ", () => {
      state.activePlayer = state.playerTwo;
      const spy = jest.spyOn(state.playerTwo.board, "receiveAttack");
      gameController.playRound(5, 5);
      expect(spy).not.toHaveBeenCalled();
    });
    test("test should return early if isProcessing is true ", () => {
      state.isProcessing = true;
      const spy = jest.spyOn(state.playerTwo.board, "receiveAttack");
      gameController.playRound(5, 5);
      expect(spy).not.toHaveBeenCalled();
    });
    test("playRound should return early if attacked the already hit coords", () => {
      const spy = jest
        .spyOn(state.playerTwo.board, "receiveAttack")
        .mockImplementation(() => null);
      gameController.playRound(5, 5);
      expect(spy).toHaveBeenCalled();
      expect(state.activePlayer).toEqual(state.playerOne);
      expect(state.activePlayer).not.toEqual(state.playerTwo);
    });
    test("playRound should switch sides and call playComputerTurn on miss and call updateCell", () => {
      const spy = jest
        .spyOn(state.playerTwo.board, "receiveAttack")
        .mockImplementation(() => false);
      gameController.playRound(5, 5);
      expect(spy).toHaveBeenCalled();
      expect(DomManager.updateCell).toHaveBeenCalledWith(
        "computer-board",
        5,
        5,
        false,
        null
      );
      expect(state.activePlayer).toBe(state.playerTwo);
      expect(gameController.playComputerTurn).toHaveBeenCalled();
    });
    // test("playRound switch sides, call playComputerTurn, call UpdateCell with ship sunk logic on hit", () => {
    //   const spy = jest
    //     .spyOn(state.playerTwo.board, "receiveAttack")
    //     .mockImplementation(() => false);
    //   const spyBoard = jest.spyOn(state.playerTwo.board.)
    //   gameController.playRound(5, 5);
    //   expect(spy).toHaveBeenCalled();
    //   expect(DomManager.updateCell).toHaveBeenCalledWith(
    //     "computer-board",
    //     5,
    //     5,
    //     true,
    //     null
    //   );
    //   expect(state.activePlayer).toBe(state.playerTwo);
    //   expect(gameController.playComputerTurn).toHaveBeenCalled();
    // });
    // test("playRound should also ");
  });
});
