import { createGameboard } from "./gameboard";
// import { Ship } from "./ship";

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
  // let targetQueue = []; // older implementation using queue
  const huntStack = [];
  let lastHit = null;

  const randomAttack = (enemyBoard) => {
    // if randomPool is exhausted it should return null
    if (randomPool.length === 0 && huntStack.length === 0) return null;
    let target;
    if (huntStack.length > 0) {
      target = huntStack.pop();
      const idx = randomPool.findIndex(
        (m) => m.x === target.x && m.y === target.y
      );
      if (idx === -1) return randomAttack(enemyBoard);
      randomPool.splice(idx, 1);
    } else {
      target = randomPool.pop();
    }

    const result = enemyBoard.receiveAttack(target.x, target.y);
    if (result === true) {
      const ship = enemyBoard.getGrid()[target.x][target.y];
      if (ship.isSunk()) {
        lastHit = null;
      } else {
        const neighbors = [
          { x: target.x + 1, y: target.y },
          { x: target.x - 1, y: target.y },
          { x: target.x, y: target.y + 1 },
          { x: target.x, y: target.y - 1 },
        ];
        const validNeighbors = neighbors.filter(
          (n) =>
            n.x >= 0 &&
            n.x < 10 &&
            n.y >= 0 &&
            n.y < 10 &&
            randomPool.some((p) => p.x === n.x && p.y === n.y)
        );

        if (lastHit) {
          const isHorizontal = target.x === lastHit.x;
          const isVertical = target.y === lastHit.y;

          const aligned = [];
          const others = [];

          validNeighbors.forEach((n) => {
            if (isHorizontal && n.x === target.x) aligned.push(n);
            else if (isVertical && n.y === target.y) aligned.push(n);
            else others.push(n);
          });

          huntStack.push(...others);
          huntStack.push(...aligned);
        } else {
          huntStack.push(...validNeighbors);
        }
        lastHit = target;
      }
    }
    return result;
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
