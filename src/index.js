import "./styles/style.css";
import { createGameboard } from "./modules/gameboard";
// import { getPlayer } from "./modules/player";
import { Ship } from "./modules/ship";
import { DomManager } from "./modules/DomManager";

const playerBoard = createGameboard();
const computerBoard = createGameboard();

const pCarrier = new Ship(5);
const pSubmarine = new Ship(3);

const cBattleship = new Ship(4);
const cPatrolBoat = new Ship(2);

playerBoard.placeShip(pCarrier, 0, 0, false);
playerBoard.placeShip(pSubmarine, 5, 2, true);

computerBoard.placeShip(cBattleship, 2, 2, false);
computerBoard.placeShip(cPatrolBoat, 8, 8, true);

playerBoard.receiveAttack(0, 0);
playerBoard.receiveAttack(9, 9);

computerBoard.receiveAttack(2, 2);
computerBoard.receiveAttack(0, 0);

DomManager.renderBoard(playerBoard, "player-board", false);
DomManager.renderBoard(computerBoard, "computer-board", true);
DomManager.updateCell("computer-board", 2, 3, true);
DomManager.updateCell("computer-board", 8, 8, true);
DomManager.updateCell(
  "computer-board",
  9,
  8,
  true,
  computerBoard.getShipCoordinates(cPatrolBoat)
);
DomManager.disableBoard("computer-board");
DomManager.enableBoard("computer-board");
