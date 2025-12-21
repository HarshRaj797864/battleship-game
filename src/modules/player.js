import { createGameboard } from "./gameboard";

const getPlayer = (n, t = "human") => {
  let name = n;
  const board = createGameboard();
  let type;
  if (t === "computer") type = "computer";
  else type = "human";

  const publicInterface = { name, board, type };

  const attack = (enemyBoard, x, y) => {
    return enemyBoard.receiveAttack(x, y);
  };

  const randomPool = [];

  const randomAttack = (enemyBoard) => {
    if (randomPool.length === 0) return null;
    const { x, y } = randomPool.pop();
    return enemyBoard.receiveAttack(x, y);
  };

  if (type === "human") publicInterface.attack = attack;
  if (type === "computer") {
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        randomPool.push({ x, y });
      }
    }

    for (let x = 99; x >= 0; x--) {
      const idx = Math.floor(Math.random() * (x + 1));
      [randomPool[x], randomPool[idx]] = [randomPool[idx], randomPool[x]];
    }

    publicInterface.randomAttack = randomAttack;
  }

  return publicInterface;
};

export { getPlayer };
