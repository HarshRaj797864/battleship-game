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
  let targetQueue = [];
  let currentHunt = null;

  const randomAttack = (enemyBoard) => {
    // if randomPool is exhausted it should return null
    if (randomPool.length === 0 && targetQueue.length === 0) return null;
    let target;
    if (targetQueue.length !== 0) {
      target = targetQueue.shift();
      const idx = randomPool.findIndex(
        (m) => m.x === target.x && m.y === target.y
      );
      if (idx !== -1) randomPool.splice(idx, 1);
    } else {
      target = randomPool.pop();
    }

    const result = enemyBoard.receiveAttack(target.x, target.y);
    if (result) {
      if (!currentHunt) {
        currentHunt = { origin: target, axis: null };
      } else if (currentHunt.axis === null) {
        if (target.x !== currentHunt.origin.x) {
          currentHunt.axis = "vertical";
        } else if (target.y !== currentHunt.origin.y) {
          currentHunt.axis = "horizontal";
        }
      }

      if (currentHunt.axis === "horizontal") {
        targetQueue = targetQueue.filter(
          (coord) => coord.y === currentHunt.origin.y
        );
      } else if (currentHunt.axis === "vertical") {
        targetQueue = targetQueue.filter(
          (coord) => coord.x === currentHunt.origin.x
        );
      }

      const potentialNeighbors = [];

      if (!currentHunt.axis || currentHunt.axis === "horizontal") {
        potentialNeighbors.push({ x: target.x + 1, y: target.y });
        potentialNeighbors.push({ x: target.x - 1, y: target.y });
      }
      if (!currentHunt.axis || currentHunt.axis === "vertical") {
        potentialNeighbors.push({ x: target.x, y: target.y + 1 });
        potentialNeighbors.push({ x: target.x, y: target.y - 1 });
      }

      potentialNeighbors.forEach((n) => {
        const inPool = randomPool.some((m) => m.x === n.x && m.y === n.y);
        if (n.x >= 0 && n.x < 10 && n.y >= 0 && n.y < 10 && inPool) {
          const inQueue = targetQueue.some((m) => m.x === n.x && m.y === n.y);
          if (!inQueue) targetQueue.push(n);
        }
      });

      if (enemyBoard.getGrid) {
        const ship = enemyBoard.getGrid()[target.x][target.y];
        if (ship && ship.isSunk()) {
          currentHunt = null;
          // targetQueue = [];
        }
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
