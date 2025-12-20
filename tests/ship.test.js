import { Ship } from "../src/modules/ship";

describe("ship-factory", () => {
  test("ship has length property", () => {
    const ship = new Ship(3);
    expect(ship.length).toBe(3);
  });

  test("should throw error if length is positive", () => {
    expect(() => new Ship(-1)).toThrow("Ship length must be positive");
    expect(() => new Ship(0)).toThrow("Ship length must be positive");
  });

  test("hits is initialized to 0", () => {
    const ship = new Ship(3);
    expect(ship.hits).toEqual(0);
  });

  test("ship is not sunk", () => {
    const ship = new Ship(3);
    expect(ship.isSunk()).toEqual(false);
  });

  test("ship has hit() that increments hits", () => {
    const ship = new Ship(3);
    ship.hit();
    expect(ship.hits).toEqual(1);
  });

  test("hits can't be more than length", () => {
    const ship = new Ship(1);
    ship.hit();
    expect(ship.hits).toBeLessThanOrEqual(ship.length);
  });

  test("isSunk returns false when hits < length", () => {
    const ship = new Ship(1);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).not.toEqual(ship.hits < ship.length);
  });

  test("isSunk returns true when hits === length", () => {
    const ship = new Ship(1);
    ship.hit;
    expect(ship.isSunk()).toEqual(ship.hits === ship.length);
  });
});
