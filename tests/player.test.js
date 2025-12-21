import { getPlayer } from "../src/modules/player";

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
          // so we are creating this mockBoard to decouple the tests
          // this will result in error cuz attack method returns enemyBoard.receiveAttack() so we need to wrap
          // const mockBoard = {receiveAttack: true};
          // this works fine but we can't verify whether this method was called with the help of special matchers
          // const mockBoard = {receiveAttack: () => true};
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
    let attackedSameCoords = false;
    for (let index = 0; index < 10; index++) {
      for (let j = 0; j < 10; j++) {
        attackedSameCoords = !c.randomAttack(p.board);
      }
    }
    expect(attackedSameCoords).toBe(false);
  });
  test("after 100 iterations randomAttack returns null", () => {
    for (let index = 0; index < 10; index++) {
      for (let j = 0; j < 10; j++) {
        c.randomAttack(p.board);
      }
    }
    expect(c.randomAttack(p.board)).toBeNull();
  });
  //   test("random attack on hit goes for adjacent cells first", () => {
  //     const mockBoard = { receiveAttack: jest.fn(() => true) };

  //   });
});
