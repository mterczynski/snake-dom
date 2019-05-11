const SNAKE_DIRECTIONS = {
    DOWN: {x: 0, y: 1},
    UP: {x: 0, y: -1},
    LEFT: {x: -1, y: 0},
    RIGHT: {x: 1, y: 0},
}
const board = document.getElementById('board');

let snake = getNewSnake();
let apple = getNewApple(snake);
let nextSnakeDirection = SNAKE_DIRECTIONS.DOWN;
let previousSnakeDirection = SNAKE_DIRECTIONS.DOWN;
let wasAppleEatenThisTurn = false;

function restartBoard() {
    board.innerHTML = '';
    for(let i=0; i<10; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        board.appendChild(row);

        for(let j=0; j<10; j++){
            const tile = document.createElement('div');
            tile.classList.add('tile')
            row.appendChild(tile);
        }
    }
}

function getNewApple(snake) {
    while(true) {
        let apple = {
            x: Math.floor(Math.random() * 10),
            y: Math.floor(Math.random() * 10),
        }
        if(snake.every(snakePart => snakePart.x !== apple.x || snakePart.y !== apple.y)) {
            return apple;
        }
    }
}

function getNewSnake() {
    return [
        {x: 0, y:2},
        {x: 0, y:1},
        {x: 0, y:0},
    ]
}

function restartGame(){
    restartBoard();
    snake = getNewSnake();
    nextSnakeDirection = SNAKE_DIRECTIONS.DOWN;
    previousSnakeDirection = SNAKE_DIRECTIONS.DOWN;
    apple = getNewApple(snake);
}

function addKeyHandlers() {
    document.addEventListener('keydown', ({key}) => {
        const upperCaseKey = key.toUpperCase();

        if(upperCaseKey === 'A' && previousSnakeDirection != SNAKE_DIRECTIONS.RIGHT) {
            nextSnakeDirection = SNAKE_DIRECTIONS.LEFT;
        } else if(upperCaseKey === 'W' && previousSnakeDirection != SNAKE_DIRECTIONS.DOWN) {
            nextSnakeDirection = SNAKE_DIRECTIONS.UP;
        } else if(upperCaseKey === 'S' && previousSnakeDirection != SNAKE_DIRECTIONS.UP) {
            nextSnakeDirection = SNAKE_DIRECTIONS.DOWN;            
        }  else if(upperCaseKey === 'D' && previousSnakeDirection != SNAKE_DIRECTIONS.LEFT) {
            nextSnakeDirection = SNAKE_DIRECTIONS.RIGHT; 
        }
    })
}

function moveSnake() {
    if(!wasAppleEatenThisTurn){
        snake.pop();
    }
    wasAppleEatenThisTurn = false;
    let newHead = {
        x: snake[0].x + nextSnakeDirection.x, 
        y: snake[0].y + nextSnakeDirection.y, 
    }

    if(newHead.x < 0) {
        newHead.x = 9;
    }
    if(newHead.y < 0) {
        newHead.y = 9;
    }
    if(newHead.x > 9) {
        newHead.x = 0;
    }
    if(newHead.y > 9) {
        newHead.y = 0;
    }

    snake = [newHead, ...snake];

    previousSnakeDirection = nextSnakeDirection;
}

function checkSnakeHeadToAppleCollision() {
    if(snake[0].x === apple.x && snake[0].y === apple.y) {
        wasAppleEatenThisTurn = true;
        apple = getNewApple(snake);
    }
}

function checkSnakeHeadToSnakeTailCollision() {
    const head = snake[0];
    const tail = snake.slice(1);
    if(tail.some(tailPart => tailPart.x === head.x && tailPart.y === head.y)){
        restartGame();
    }
}

function clearBoard() {
    let tiles = document.querySelectorAll('.tile');
    Array.from(tiles).forEach(tile => tile.classList.remove('snake', 'apple'))
}

function renderSnake(){
    snake.forEach(snakePart => {
        const query = `.row:nth-child(${snakePart.y + 1}) > .tile:nth-child(${snakePart.x + 1})`;
        const snakePartTile = document.querySelector(query);
        snakePartTile.classList.add('snake');
    })
}

function renderApple() {
    const query = `.row:nth-child(${apple.y + 1}) > .tile:nth-child(${apple.x + 1})`;
    const appleTile = document.querySelector(query);
    appleTile.classList.add('apple');
}

function render(){
    clearBoard();
    renderApple();
    renderSnake();
}

const gameLoop = () => {
    moveSnake();
    checkSnakeHeadToAppleCollision();
    checkSnakeHeadToSnakeTailCollision();
    render();
}

restartGame();
setInterval(gameLoop, 1000/10);
addKeyHandlers();
