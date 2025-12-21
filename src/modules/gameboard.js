const createGameboard = () => {
  const grid = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));

  const ships = [];

  const placeShip = (obj, x, y, isVertical = false) => {
    for (let i = 0; i < obj.length; i++) {
      const r = isVertical ? x + i : x;
      const c = isVertical ? y : y + i;
      if (r >= 10 || c >= 10)
        throw new Error("Cannot place: Ship gone out of bound");
      if (grid[r][c] !== null) {
        throw new Error("Ships cannot overlap");
      }
    }

    for (let i = 0; i < obj.length; i++) {
      if (isVertical) {
        grid[x + i][y] = obj;
      } else {
        grid[x][y + i] = obj;
      }
    }
    ships.push(obj);
  };

  const getGrid = () => grid.map((row) => [...row]);
  const attackedShots = [];
  const getAttackedShots = () => {
    return [...attackedShots];
  };

  const receiveAttack = (x, y) => {
    const alreadyAttacked = attackedShots.some((m) => m.x === x && m.y === y);
    if (!alreadyAttacked) {
      if (grid[x][y] !== null) {
        grid[x][y].hit();
        attackedShots.push({ x, y, missed: false });
      } else {
        attackedShots.push({ x, y, missed: true });
      }
      return true;
    }
    return false;
  };

  const allShipSunk = () => {
    return ships.every((m) => m.isSunk() === true);
  };

  const getMissedAttacks = () => {
    return attackedShots
      .filter((m) => m.missed === true)
      .map((m) => {
        return { x: m.x, y: m.y };
      });
  };

  const getShips = () => [...ships];

  return {
    getGrid,
    placeShip,
    receiveAttack,
    getAttackedShots,
    allShipSunk,
    getMissedAttacks,
    getShips,
  };
};

export { createGameboard };
