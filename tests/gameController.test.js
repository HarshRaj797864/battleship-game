import { gameController } from "../src/modules/gameController";
import { getPlayer } from "../src/modules/player";
import { DomManager } from "../src/modules/DomManager";
import { ScreenController } from "../src/modules/ScreenController";

jest.mock("../src/modules/DomManager", () => ({
  DomManager: {
    renderBoard: jest.fn(),
    updateCell: jest.fn(),
    disableBoard: jest.fn(),
    enableBoard: jest.fn(),
    bindEvents: jest.fn(),
  },
}));
jest.mock("../src/modules/ScreenController", () => ({
  ScreenController: {
    init: jest.fn(),
    showGameOver: jest.fn(),
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
      const coords = board.getShipCoordinates(ships[0]);
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

    test("all the conditions for initial state of game are met", () => {
      expect(state.playerOne.type).toEqual("human");
      expect(state.playerTwo.type).toEqual("computer");
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

  describe("playRound (Human Turn)", () => {
    let state;

    beforeEach(() => {
      jest.clearAllMocks();
      jest
        .spyOn(gameController, "playComputerTurn")
        .mockImplementation(() => {});
      gameController.initializeGame("Harsh");
      state = gameController.state;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("should return early if isGameOver is true", () => {
      state.isGameOver = true;
      const spy = jest.spyOn(state.playerTwo.board, "receiveAttack");
      gameController.playRound(5, 5);
      expect(spy).not.toHaveBeenCalled();
    });

    test("should return early if activePlayer is computer", () => {
      state.activePlayer = state.playerTwo;
      const spy = jest.spyOn(state.playerTwo.board, "receiveAttack");
      gameController.playRound(5, 5);
      expect(spy).not.toHaveBeenCalled();
    });

    test("should return early if isProcessing is true", () => {
      state.isProcessing = true;
      const spy = jest.spyOn(state.playerTwo.board, "receiveAttack");
      gameController.playRound(5, 5);
      expect(spy).not.toHaveBeenCalled();
    });

    test("should NOT switch turn if attacking an already hit coordinate", () => {
      const spy = jest
        .spyOn(state.playerTwo.board, "receiveAttack")
        .mockImplementation(() => null);

      gameController.playRound(5, 5);

      expect(spy).toHaveBeenCalled();
      expect(state.activePlayer).toEqual(state.playerOne);
    });

    test("should switch sides and call playComputerTurn on a Valid Miss", () => {
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

    describe("playRound - successful hits", () => {
      let mockCoords;
      let mockShip;

      beforeEach(() => {
        jest
          .spyOn(state.playerTwo.board, "receiveAttack")
          .mockReturnValue(true);

        mockShip = { isSunk: () => true };
        jest
          .spyOn(state.playerTwo.board, "getShipAt")
          .mockReturnValue(mockShip);

        mockCoords = [
          { x: 5, y: 5 },
          { x: 5, y: 6 },
        ];
        jest
          .spyOn(state.playerTwo.board, "getShipCoordinates")
          .mockReturnValue(mockCoords);
      });

      test("standard hit: updates UI, switches sides, and calls computer turn", () => {
        jest.spyOn(state.playerTwo.board, "allShipSunk").mockReturnValue(false);

        gameController.playRound(5, 5);

        expect(DomManager.updateCell).toHaveBeenCalledWith(
          "computer-board",
          5,
          5,
          true,
          mockCoords
        );
        expect(state.activePlayer).toBe(state.playerTwo);
        expect(gameController.playComputerTurn).toHaveBeenCalled();
      });

      test("winning hit: updates UI, ends game, DOES NOT call computer turn", () => {
        jest.spyOn(state.playerTwo.board, "allShipSunk").mockReturnValue(true);

        gameController.playRound(5, 5);

        expect(state.isGameOver).toBe(true);
        expect(state.activePlayer).toBe(state.playerOne);
        expect(gameController.playComputerTurn).not.toHaveBeenCalled();
      });
    });
  });

  describe("computer's turn", () => {
    let state;

    test("playComputerTurn sets isProcessing to true and disables the computer-board", () => {
      gameController.initializeGame("Harsh");
      state = gameController.state;
      gameController.playComputerTurn();
      expect(state.isProcessing).toEqual(true);
      expect(DomManager.disableBoard).toHaveBeenCalled();
    });

    describe("computer's turn inside timer (Logic Execution)", () => {
      let attackSpy, coordsSpy, allShipSunkSpy, gridSpy;

      beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        gameController.initializeGame("Harsh");
        state = gameController.state;

        attackSpy = jest
          .spyOn(state.playerOne.board, "receiveAttack")
          .mockReturnValue(true);

        const mockShip = { isSunk: jest.fn().mockReturnValue(false) };
        const mockGrid = Array(10)
          .fill(null)
          .map(() => Array(10).fill(mockShip));

        gridSpy = jest
          .spyOn(state.playerOne.board, "getGrid")
          .mockReturnValue(mockGrid);

        const mockAttackedShots = [{ x: 5, y: 5, missed: false }];
        coordsSpy = jest
          .spyOn(state.playerOne.board, "getAttackedShots")
          .mockReturnValue(mockAttackedShots);

        allShipSunkSpy = jest
          .spyOn(state.playerOne.board, "allShipSunk")
          .mockReturnValue(false);

        gameController.playComputerTurn();
        jest.runAllTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
      });

      test("calls randomAttack and gets the position", () => {
        expect(attackSpy).toHaveBeenCalled();
        expect(coordsSpy).toHaveBeenCalled();
      });

      test("UI updated correctly", () => {
        expect(DomManager.updateCell).toHaveBeenCalled();
      });

      test("checks win condition, resets processing, and enables board", () => {
        expect(allShipSunkSpy).toHaveBeenCalled();
        expect(state.activePlayer).toBe(state.playerOne);
        expect(state.isProcessing).toBe(false);
        expect(DomManager.enableBoard).toHaveBeenCalled();
      });
    });
  });
});
