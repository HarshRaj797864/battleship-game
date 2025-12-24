import { getPlayer } from "../src/modules/player";

describe("testing player module", () => {
  let p;
  let c;
  let mockGrid;
  let mockShip;

  beforeEach(() => {
    p = getPlayer("Harsh");
    c = getPlayer("Raj", "computer");

    mockShip = { isSunk: jest.fn().mockReturnValue(false) };
    mockGrid = Array(10)
      .fill(null)
      .map(() => Array(10).fill(mockShip));
  });

  test("player has a name", () => {
    expect(p.name).toEqual("Harsh");
  });

  test("player has their own gameBoard", () => {
    expect(p.board).toBeDefined();
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
    ])("only %s player has %s method", (type, method) => {
      if (type === "human") {
        expect(p.attack).toBeDefined();
        expect(c.attack).not.toBeDefined();
      } else {
        expect(p.randomAttack).not.toBeDefined();
        expect(c.randomAttack).toBeDefined();
      }
    });
  });

  describe("attack execution", () => {
    let mockBoard;

    beforeEach(() => {
      mockBoard = {
        receiveAttack: jest.fn(() => true),
        getGrid: jest.fn().mockReturnValue(mockGrid),
      };
    });

    test("human attack calls receiveAttack on enemy board", () => {
      p.attack(mockBoard, 1, 1);
      expect(mockBoard.receiveAttack).toHaveBeenCalledWith(1, 1);
    });

    test("computer randomAttack calls receiveAttack on enemy board", () => {
      c.randomAttack(mockBoard);
      expect(mockBoard.receiveAttack).toHaveBeenCalled();
    });

    test("randomAttack returns whatever the gameBoard returns", () => {
      mockBoard.receiveAttack.mockReturnValue("miss");
      expect(c.randomAttack(mockBoard)).toBe("miss");
    });
  });

  describe("Computer AI Logic", () => {
    test("Computer player never attacks the same coordinate twice", () => {
      const visited = new Set();
      let hasDuplicate = false;

      const mockBoard = {
        receiveAttack: jest.fn().mockReturnValue(false),
      };

      for (let i = 0; i < 100; i++) {
        c.randomAttack(mockBoard);
        const [x, y] = mockBoard.receiveAttack.mock.calls[i];
        const key = `${x},${y}`;

        if (visited.has(key)) {
          hasDuplicate = true;
          break;
        }
        visited.add(key);
      }

      expect(hasDuplicate).toBe(false);
      expect(visited.size).toBe(100);
    });

    test("returns null after 100 moves (pool exhausted)", () => {
      const mockBoard = { receiveAttack: jest.fn() };
      for (let i = 0; i < 100; i++) {
        c.randomAttack(mockBoard);
      }
      expect(c.randomAttack(mockBoard)).toBeNull();
    });

    test("Smart AI: Attacks adjacent coordinate after a HIT", () => {
      const mockBoard = {
        receiveAttack: jest.fn().mockReturnValue(true),
        getGrid: jest.fn().mockReturnValue(mockGrid),
      };

      c.randomAttack(mockBoard);
      const [firstX, firstY] = mockBoard.receiveAttack.mock.calls[0];

      c.randomAttack(mockBoard);
      const [secondX, secondY] = mockBoard.receiveAttack.mock.calls[1];

      const validNeighbors = [
        [firstX + 1, firstY],
        [firstX - 1, firstY],
        [firstX, firstY + 1],
        [firstX, firstY - 1],
      ];

      const isNeighbor = validNeighbors.some(
        (n) => n[0] === secondX && n[1] === secondY
      );

      expect(isNeighbor).toBe(true);
    });
  });
});
