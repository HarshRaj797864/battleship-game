# Battleship Game (JS)

This project is a browser-based implementation of the classic **Battleship** game.
I built it to practice **JavaScript fundamentals**, **test-driven development**, and **clean separation between game logic and the DOM**, without relying on frameworks.

The main focus of this project is correctness, clarity of logic, and testability.

---

## What I Built

* A complete turn-based Battleship game playable in the browser
* Core game logic implemented first using **Test-Driven Development (TDD)**
* A simple UI layer that renders the game state without mixing logic and DOM code
* A computer player with basic intelligence (not purely random)

---

## Project Structure

The code is split into small modules, each with a clear responsibility:

```
src/
├── ship.js          # Ship state and hit/sink logic
├── gameboard.js     # Grid, placement rules, attacks
├── player.js        # Human and computer player behavior
├── modules/
│   ├── GameController.js  # Turn handling and game flow
│   └── DomManager.js      # Rendering boards and updating cells
└── index.js         # App entry point
```

Game logic is kept completely separate from the DOM so it can be tested independently.

---

## Computer AI Logic

The computer player works in two stages:

* **Random search**: attacks random valid cells
* **Target mode**: after hitting a ship, it checks adjacent cells to determine the ship’s orientation and continues attacking along that axis until the ship is sunk

This makes the computer’s behavior closer to how a human would play.

---

## Testing

* All core game logic was written using **TDD**
* Tests were written before implementation
* Edge cases are explicitly covered, including:

  * overlapping ship placement
  * attacking the same cell twice
  * out-of-bounds placement
  * detecting when all ships are sunk

Testing is done using **Jest**.

---

## Tools Used

* JavaScript (ES6+)
* Jest (unit testing)
* Webpack (bundling and dev server)
* Babel
* ESLint & Prettier

---

## Live Demo

Live version (GitHub Pages):
`https://battle-ship67.netlify.app/`

---

## Running Locally

```bash
git clone <repo-url>
cd battleship-game
npm install
npm start
```

Run tests:

```bash
npm test
```

---

## Why I Built This

I built this project to improve my understanding of:

* writing testable JavaScript code
* modeling game state cleanly
* separating logic from UI
* using proper Git workflow for a non-trivial project

This project is intentionally not framework-heavy so that the focus stays on fundamentals.

---

## Possible Improvements

* Better animations and UI polish
* Multiplayer support

