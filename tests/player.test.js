import { getPlayer } from "../src/modules/player";
import { createGameboard } from "../src/modules/gameboard";
import { Ship } from "../src/modules/ship";

describe("testing player module", () => {
  let p;
  let c;

  beforeEach(() => {
    p = getPlayer("Harsh");
    c = getPlayer("Raj", "computer");
  });

  test("player has a name", () => {
    expect(p.name).toEqual("Harsh");
  });

  test("player has their own gameBoard", () => {
    expect(p.board).toBeDefined();
    expect(p.board).toHaveProperty("receiveAttack");
    expect(p.board).toHaveProperty("placeShip");
    expect(p.board.getGrid().length).toEqual(10);
  });

  describe("Player factory - Type property", () => {
    test.each([
      ["human", "human"],
      ["computer", "computer"],
      [undefined, "human"],
    ])(
      "when initialized with %s the player's type should be %s",
      (input, expected) => {
        const p2 = getPlayer("Harsh", input);
        expect(p2.type).toEqual(expected);
      }
    );
  });

  describe("one type can have one 'attack' method", () => {
    test.each([
      ["human", "attack"],
      ["computer", "randomAttack"],
    ])("only %s player has %s method", (type) => {
      if (type === "human") {
        expect(p.attack).toBeDefined();
        expect(c.attack).not.toBeDefined();
      } else {
        expect(p.randomAttack).not.toBeDefined();
        expect(c.randomAttack).toBeDefined();
      }
    });
  });

  describe("attack and randomAttack return what receiveAttack returns", () => {
    let mockBoard;
    let result;
    beforeEach(() => {
      mockBoard = { receiveAttack: jest.fn(() => true) };
    });

    test.each([["attack"], ["randomAttack"]])(
      "%s method returns whatever the gameBoard returns",
      (input) => {
        if (input === "attack") {
          result = p.attack(mockBoard, 1, 1);
          expect(mockBoard.receiveAttack).toHaveBeenCalledWith(1, 1);
        } else {
          result = c.randomAttack(mockBoard);
        }
        expect(result).toBe(true);
        expect(mockBoard.receiveAttack).toHaveBeenCalledTimes(1);
      }
    );
  });

  test("Computer player can't attack same coordinates twice", () => {
    let hasDuplicate = false;
    for (let index = 0; index < 100; index++) {
      const result = c.randomAttack(p.board);
      if (result === null) {
        hasDuplicate = true;
        break;
      }
    }
    expect(hasDuplicate).toBe(false);
  });

  test("after 100 iterations randomAttack returns null", () => {
    for (let index = 0; index < 10; index++) {
      for (let j = 0; j < 10; j++) {
        c.randomAttack(p.board);
      }
    }
    expect(c.randomAttack(p.board)).toBeNull();
  });

  test("randomAttack attacks adjacent coords after a hit", () => {
    const mockBoard = {
      receiveAttack: jest.fn().mockReturnValueOnce(true),
    };
    c.randomAttack(mockBoard);
    const [firstX, firstY] = mockBoard.receiveAttack.mock.calls[0];

    c.randomAttack(mockBoard);

    const secondCoordinate = mockBoard.receiveAttack.mock.calls[1];
    const [x, y] = secondCoordinate;

    const validNeighbors = [
      [firstX + 1, firstY],
      [firstX - 1, firstY],
      [firstX, firstY + 1],
      [firstX, firstY - 1],
    ];
    expect(validNeighbors).toContainEqual([x, y]);
  });

  describe.skip("randomAttack determines axis after 2 hits", () => {
    let enemyBoard;
    let ship;

    beforeEach(() => {
      enemyBoard = createGameboard();
      ship = new Ship(3);
    });

    test.each([
      { orientation: "horizontal", x: 5, y: 5, isVert: false },
      { orientation: "vertical", x: 5, y: 5, isVert: true },
    ])(
      "randomAttack follows $orientation line after 2 hits",
      ({ isVert, x, y }) => {
        enemyBoard.placeShip(ship, x, y, isVert);

        while (true) {
          c.randomAttack(enemyBoard);
          const lastShot = enemyBoard.getAttackedShots().at(-1);
          if (lastShot.x === x && lastShot.y === y) break;
        }

        let secondHit = null;
        while (!secondHit) {
          const isHit = c.randomAttack(enemyBoard);
          if (isHit === true) {
            secondHit = enemyBoard.getAttackedShots().at(-1);
          }
        }

        c.randomAttack(enemyBoard);
        const thirdShot = enemyBoard.getAttackedShots().at(-1);

        if (!isVert) {
          expect(thirdShot.x).toBe(x);
          expect([3, 4, 6, 7]).toContain(thirdShot.y);
        } else {
          expect(thirdShot.y).toBe(y);
          expect([3, 4, 6, 7]).toContain(thirdShot.x);
        }
      }
    );
  });
});
