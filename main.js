const SNAKE_DIRECTIONS = {
  DOWN: { x: 0, y: 1 },
  UP: { x: 0, y: -1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};
const arrow_up = document.querySelector(".arrow_up");
const arrow_down = document.querySelector(".arrow_down");
const arrow_side_1 = document.querySelector(".arrow-aside_1");
const arrow_side_2 = document.querySelector(".arrow-aside_2");
const board = document.getElementById("board");
const localStorageScoreKey = "snake-dom-best-score";

let snake = getNewSnake();
let apple = getNewApple(snake);
let nextSnakeDirection = SNAKE_DIRECTIONS.DOWN;
let previousSnakeDirection = SNAKE_DIRECTIONS.DOWN;
let wasAppleEatenThisTurn = false;
let score = 0;
let bestScore = localStorage.getItem(localStorageScoreKey) || 0;

function restartBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    board.appendChild(row);

    for (let j = 0; j < 10; j++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      row.appendChild(tile);
    }
  }
}

function getNewApple(snake) {
  while (true) {
    let apple = {
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
    };
    if (
      snake.every(
        (snakePart) => snakePart.x !== apple.x || snakePart.y !== apple.y
      )
    ) {
      return apple;
    }
  }
}

function getNewSnake() {
  return [
    { x: 0, y: 2 },
    { x: 0, y: 1 },
    { x: 0, y: 0 },
  ];
}

function restartGame() {
  restartBoard();
  score = 0;
  updateScores();
  snake = getNewSnake();
  nextSnakeDirection = SNAKE_DIRECTIONS.DOWN;
  previousSnakeDirection = SNAKE_DIRECTIONS.DOWN;
  apple = getNewApple(snake);
}

function updateScores() {
  document.getElementById("score").innerHTML = score;
  document.getElementById("best-score").innerHTML = bestScore;
  localStorage.setItem(localStorageScoreKey, bestScore);
}

function onLeftKeyPressed() {
  if(previousSnakeDirection !== SNAKE_DIRECTIONS.RIGHT)
    nextSnakeDirection = SNAKE_DIRECTIONS.LEFT;
}

function onRightKeyPressed() {
  if(previousSnakeDirection !== SNAKE_DIRECTIONS.LEFT)
    nextSnakeDirection = SNAKE_DIRECTIONS.RIGHT;
}

function onUpKeyPressed() {
  if(previousSnakeDirection !== SNAKE_DIRECTIONS.DOWN)
    nextSnakeDirection = SNAKE_DIRECTIONS.UP;
}

function onDownKeyPressed() {
  if(previousSnakeDirection !== SNAKE_DIRECTIONS.UP)
    nextSnakeDirection = SNAKE_DIRECTIONS.DOWN;
}

function addKeyHandlers() {
  document.addEventListener("keydown", ({ key }) => {
    const upperCaseKey = key.toUpperCase();

    if (
      (upperCaseKey === "A" || key === "ArrowLeft")
    ) {
      this.onLeftKeyPressed();
    } else if (
      (upperCaseKey === "W" || key === "ArrowUp")
    ) {
      this.onUpKeyPressed();
    } else if (
      (upperCaseKey === "S" || key === "ArrowDown")
    ) {
      this.onDownKeyPressed();
    } else if (
      (upperCaseKey === "D" || key === "ArrowRight")
    ) {
      this.onRightKeyPressed();
    }
  });
}

function addArrowClickHandlers() {
  arrow_up.addEventListener("click", () => {
    if (previousSnakeDirection !== SNAKE_DIRECTIONS.DOWN) {
      nextSnakeDirection = SNAKE_DIRECTIONS.UP;
    }
  });

  arrow_down.addEventListener("click", () => {
    if (previousSnakeDirection !== SNAKE_DIRECTIONS.UP) {
      nextSnakeDirection = SNAKE_DIRECTIONS.DOWN;
    }
  });

  arrow_side_1.addEventListener("click", () => {
    if (previousSnakeDirection !== SNAKE_DIRECTIONS.RIGHT) {
      nextSnakeDirection = SNAKE_DIRECTIONS.LEFT;
    }
  });

  arrow_side_2.addEventListener("click", () => {
    if (previousSnakeDirection !== SNAKE_DIRECTIONS.LEFT) {
      nextSnakeDirection = SNAKE_DIRECTIONS.RIGHT;
    }
  });
}

function moveSnake() {
  if (!wasAppleEatenThisTurn) {
    snake.pop();
  }
  wasAppleEatenThisTurn = false;
  let newHead = {
    x: snake[0].x + nextSnakeDirection.x,
    y: snake[0].y + nextSnakeDirection.y,
  };

  if (newHead.x < 0) {
    newHead.x = 9;
  }
  if (newHead.y < 0) {
    newHead.y = 9;
  }
  if (newHead.x > 9) {
    newHead.x = 0;
  }
  if (newHead.y > 9) {
    newHead.y = 0;
  }

  snake = [newHead, ...snake];

  previousSnakeDirection = nextSnakeDirection;
}

function checkSnakeHeadToAppleCollision() {
  if (snake[0].x === apple.x && snake[0].y === apple.y) {
    wasAppleEatenThisTurn = true;
    score++;
    bestScore = Math.max(bestScore, score);
    updateScores();
    apple = getNewApple(snake);
  }
}

function checkSnakeHeadToSnakeTailCollision() {
  const head = snake[0];
  const tail = snake.slice(1);
  if (tail.some((tailPart) => tailPart.x === head.x && tailPart.y === head.y)) {
    restartGame();
  }
}

function clearBoard() {
  let tiles = document.querySelectorAll(".tile");
  Array.from(tiles).forEach((tile) => tile.classList.remove("snake", "apple"));
}

function renderSnake() {
  snake.forEach((snakePart) => {
    const query = `.row:nth-child(${snakePart.y + 1}) > .tile:nth-child(${
      snakePart.x + 1
    })`;
    const snakePartTile = document.querySelector(query);
    snakePartTile.classList.add("snake");
  });
}

function renderApple() {
  const query = `.row:nth-child(${apple.y + 1}) > .tile:nth-child(${
    apple.x + 1
  })`;
  const appleTile = document.querySelector(query);
  appleTile.classList.add("apple");
}

function addGamePadControls() {
  window.addEventListener("gamepadconnected", (e) => {
    const index = e.gamepad.index;
    
    function loop() {
      const gp = navigator.getGamepads()[index];
      if (!gp) return requestAnimationFrame(loop);

      // XYBA buttons
      if (gp.buttons[0].pressed) this.onDownKeyPressed(); // A
      if (gp.buttons[1].pressed) this.onRightKeyPressed(); // B
      if (gp.buttons[2].pressed) this.onLeftKeyPressed(); // X
      if (gp.buttons[3].pressed) this.onUpKeyPressed(); // Y

      // Directional Pad (D-Pad)
      if (gp.buttons[13].pressed) this.onDownKeyPressed();
      if (gp.buttons[15].pressed) this.onRightKeyPressed();
      if (gp.buttons[14].pressed) this.onLeftKeyPressed();
      if (gp.buttons[12].pressed) this.onUpKeyPressed();

      // Bumpers and triggers
      if (gp.buttons[5].pressed) this.onDownKeyPressed();
      if (gp.buttons[7].pressed) this.onRightKeyPressed();
      if (gp.buttons[6].pressed) this.onLeftKeyPressed();
      if (gp.buttons[4].pressed) this.onUpKeyPressed();

      // Thumbsticks: handle both left (axes 0,1) and right (axes 2,3) with one block
      // minimum magnitude (length) of thumbstick vector to consider it a deliberate input
      const STICK_DEADZONE = 0.4;
      [[0, 1], [2, 3]].forEach(([ax, ay]) => {
        if (typeof gp.axes[ax] === 'number' && typeof gp.axes[ay] === 'number') {
          const sx = gp.axes[ax];
          const sy = gp.axes[ay];
          const mag = Math.sqrt(sx * sx + sy * sy);
          if (mag > STICK_DEADZONE) {
            // angle in radians (y typically -1 up on gamepads)
            const ang = Math.atan2(sy, sx);
            // Map angle to 4 directions
            if (ang >= -Math.PI / 4 && ang <= Math.PI / 4) {
              onRightKeyPressed();
            } else if (ang > Math.PI / 4 && ang < (3 * Math.PI) / 4) {
              onDownKeyPressed();
            } else if (ang >= (3 * Math.PI) / 4 || ang <= -(3 * Math.PI) / 4) {
              onLeftKeyPressed();
            } else {
              onUpKeyPressed();
            }
          }
        }
      });

      requestAnimationFrame(loop);
    }

    loop();
  });
}

function render() {
  clearBoard();
  renderApple();
  renderSnake();
}

const gameLoop = () => {
  moveSnake();
  checkSnakeHeadToAppleCollision();
  checkSnakeHeadToSnakeTailCollision();
  render();
};

restartGame();
setInterval(gameLoop, 1000 / 10);
addKeyHandlers();
addArrowClickHandlers();
addGamePadControls();
