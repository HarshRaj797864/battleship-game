import { createGameboard } from "../src/modules/gameboard";
import { Ship } from "../src/modules/ship.js";

describe("gameBoard", () => {
  test("gameBoard object contains a grid of 10x10", () => {
    const b = createGameboard();
    expect(
      b.getGrid().length === 10 &&
        b.getGrid().every((row) => Array.isArray(row) && row.length === 10)
    ).toEqual(true);
  });

  test("gameboard has placeShip method", () => {
    const b = createGameboard();
    const key = "placeShip";
    expect(key in b).toEqual(true);
  });

  test("ships can be placed at specific location", () => {
    const [x, y] = [0, 0];
    const b = createGameboard();
    const ship = new Ship(3);
    b.placeShip(ship, x, y);
    expect(b.getGrid()[x][y]).toBeInstanceOf(Ship);
  });

  test("ship of length > 1 can be placed across the cells", () => {
    const b = createGameboard();
    const ship = new Ship(3);
    b.placeShip(ship, 0, 0);
    expect(b.getGrid()[0][0]).toBeInstanceOf(Ship);
    expect(b.getGrid()[0][1]).toBeInstanceOf(Ship);
    expect(b.getGrid()[0][2]).toBeInstanceOf(Ship);
    expect(b.getGrid()[0][3]).not.toBeInstanceOf(Ship);
  });

  test("ship can be placed both horizontally and vertically", () => {
    const b = createGameboard();
    const ship = new Ship(3);
    b.placeShip(ship, 0, 0, true);
    expect(b.getGrid()[0][0]).toBeInstanceOf(Ship);
    expect(b.getGrid()[1][0]).toBeInstanceOf(Ship);
    expect(b.getGrid()[2][0]).toBeInstanceOf(Ship);
    expect(b.getGrid()[3][0]).not.toBeInstanceOf(Ship);
  });

  test("ships cannot overlap", () => {
    const b = createGameboard();
    const ship = new Ship(3);
    const ship2 = new Ship(4);
    b.placeShip(ship, 0, 0);

    expect(() => b.placeShip(ship2, 0, 0, true)).toThrow(
      "Ships cannot overlap"
    );
  });

  test("ships can't be placed out of bounds", () => {
    const b = createGameboard();
    const ship = new Ship(3);
    expect(() => b.placeShip(ship, 9, 9)).toThrow(
      "Cannot place: Ship gone out of bound"
    );
    expect(() => b.placeShip(ship, 5, 5)).not.toThrow(
      "Cannot place: Ship gone out of bound"
    );
  });
  test("ships can be placed on the boundary edges", () => {
    const b = createGameboard();
    const ship = new Ship(2);

    expect(() => b.placeShip(ship, 0, 8)).not.toThrow();

    expect(() => b.placeShip(ship, 8, 0, true)).not.toThrow();
  });

  test("receiveAttack increments a ship's hits", () => {
    const b = createGameboard();
    const ship = new Ship(3);
    b.placeShip(ship, 0, 0, true);
    b.receiveAttack(0, 0);
    expect(ship.hits).toEqual(1);
  });

  test("receiveAttack records attacked shots", () => {
    const b = createGameboard();
    const ship = new Ship(3);
    b.placeShip(ship, 0, 0, true);
    b.receiveAttack(0, 1);
    expect(b.getAttackedShots()).toContainEqual({ x: 0, y: 1, missed: true });
    b.receiveAttack(3, 0);
    expect(b.getAttackedShots()).toContainEqual({ x: 3, y: 0, missed: true });
  });

  test("firing at same spot twice does not record 2 misses", () => {
    const b = createGameboard();
    const ship = new Ship(3);
    b.placeShip(ship, 0, 0, true);
    b.receiveAttack(0, 1);
    b.receiveAttack(0, 1);
    const count = b
      .getAttackedShots()
      .filter((m) => m.x === 0 && m.y === 1).length;

    expect(count).toEqual(1);
  });

  test("a coordinate can be hit only once", () => {
    const b = createGameboard();
    const ship = new Ship(3);
    b.placeShip(ship, 0, 0, true);
    b.receiveAttack(1, 0);
    b.receiveAttack(1, 0);
    expect(b.getGrid()[1][0].hits).toEqual(1);
  });
  test("receiveAttack returns true on hit only", () => {
    const b = createGameboard();
    const ship = new Ship(3);
    b.placeShip(ship, 0, 0, true);
    expect(b.receiveAttack(0, 0)).toEqual(true);
    expect(b.receiveAttack(0, 1)).not.toEqual(true);
  });

  test("receiveAttack returns null on duplicate", () => {
    const b = createGameboard();
    const ship = new Ship(3);
    b.placeShip(ship, 0, 0, true);
    expect(b.receiveAttack(0, 0)).toEqual(true);
    expect(b.receiveAttack(0, 0)).toEqual(null);
  });

  test("shot history correctly records hits vs misses", () => {
    const b = createGameboard();
    const ship = new Ship(1);
    b.placeShip(ship, 0, 0);
    b.receiveAttack(0, 0);
    b.receiveAttack(1, 1);
    const shots = b.getAttackedShots();
    expect(shots).toContainEqual({ x: 0, y: 0, missed: false });
    expect(shots).toContainEqual({ x: 1, y: 1, missed: true });
  });
  describe("allShipSunk state tracking", () => {
    let b;
    beforeEach(() => {
      b = createGameboard();
      b.placeShip(new Ship(3), 0, 0, true);
      b.placeShip(new Ship(2), 3, 3);
    });

    test.each([
      {
        desc: "initial state",
        attacks: [],
        expected: false,
      },
      {
        desc: "one ship fully sunk one untouched",
        attacks: [
          [0, 0],
          [1, 0],
          [2, 0],
        ],
        expected: false,
      },
      {
        desc: "both ships damaged but not sunk",
        attacks: [
          [0, 0],
          [1, 0],
          [3, 3],
        ],
        expected: false,
      },
      {
        desc: "all coordinates hit",
        attacks: [
          [0, 0],
          [1, 0],
          [2, 0],
          [3, 3],
          [3, 4],
        ],
        expected: true,
      },
    ])(`$desc: allShipSunk should be $expected`, ({ attacks, expected }) => {
      attacks.forEach(([x, y]) => b.receiveAttack(x, y));
      expect(b.allShipSunk()).toEqual(expected);
    });
  });

  test("getMissedAttacks returns an array of missed attacks", () => {
    const b = createGameboard();
    const ship = new Ship(3);
    b.placeShip(ship, 0, 0, true);
    b.receiveAttack(0, 1);
    b.receiveAttack(5, 5);
    expect(b.getMissedAttacks()).toContainEqual({ x: 0, y: 1 });
    expect(b.getMissedAttacks()).toContainEqual({ x: 5, y: 5 });
  });

  test("get all ships", () => {
    const b = createGameboard();
    const ship = new Ship(3);
    const ship2 = new Ship(2);
    b.placeShip(ship, 0, 0, true);
    b.placeShip(ship2, 3, 3);
    expect(b.getShips()).toContainEqual(ship);
    expect(b.getShips()).toContainEqual(ship2);
  });
  test("getShipCoordinates stores coordinates of every ship in the gameBoard", () => {
    const b = createGameboard();
    const ship = new Ship(3);
    const ship2 = new Ship(2);
    b.placeShip(ship, 0, 0, true);
    b.placeShip(ship2, 3, 3);
    const coords = b.getShipCoordinates(ship);
    expect(coords.length).toEqual(3);
    expect(coords).toContainEqual({ x: 1, y: 0 });
    expect(coords).not.toContainEqual({ x: 3, y: 4 });
  });
  test.skip("just trying", () => {
    const val = true;
    expect(val).toEqual(false);
  });
});
