const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let scale = 50;
let rows, columns;
let snake;
let apple;
let score;
let gameOver = false;
let paused = false;

const snakeImage = new Image();
snakeImage.src = 'snake.png';

const appleImage = new Image();
appleImage.src = 'apple.png';

class Snake {
    constructor() {
        this.body = [{ x: 4, y: 4 }];
        this.dir = 'right';
        this.preDir = 'right';
    }

    getTailDir(pre, curr) {
        if (pre.x < curr.x) return 'right';
        if (pre.x > curr.x) return 'left';
        if (pre.y < curr.y) return 'down';
        if (pre.y > curr.y) return 'up';
    }

    move() {
        const head = { ...this.body[0] };

        switch (this.dir) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }

        this.body.unshift(head);

        if (!(head.x === apple.x && head.y === apple.y)) {
            this.body.pop();
        }
    }

    isClash() {
        const head = this.body[0];
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[i].x === head.x && this.body[i].y === head.y) {
                return true;
            }
        }
        return false;
    }

    reset() {
        this.body = [{ x: 8, y: 8 }];
        this.dir = 'right';
        this.preDir = 'right';
    }
}

function setApple() {
    const x = Math.floor(Math.random() * columns);
    const y = Math.floor(Math.random() * rows);
    apple = { x, y };
}

function resizeGame() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    rows = Math.floor(canvas.height / scale);
    columns = Math.floor(canvas.width / scale);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (paused) {
        ctx.fillStyle = 'white';
        ctx.font = '25px Arial';
        ctx.fillText('Game Paused',  15 , canvas.height / 2);
        return;
    }

    snake.body.forEach((segment, index) => {
        if (index === 0) {
            ctx.drawImage(snakeImage, segment.x * scale, segment.y * scale, scale, scale);
        } else if (index === snake.body.length - 1) {
            const prevSegment = snake.body[snake.body.length - 2];
            const direction = getTailDirection(prevSegment, segment);
            newTail(segment.x, segment.y, direction);
        } else {
            ctx.fillStyle = '#75b74c';
            ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale);
        }
    });

    ctx.drawImage(appleImage, apple.x * scale, apple.y * scale, scale, scale);

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '25px Arial';
        ctx.fillText('Game Over! Press "R" to Restart.', 15 , canvas.height / 2);
    }
}

function getTailDirection(prevSegment, segment) {
    if (prevSegment.x < segment.x) return 'right';
    if (prevSegment.x > segment.x) return 'left';
    if (prevSegment.y < segment.y) return 'down';
    if (prevSegment.y > segment.y) return 'up';
}

function newTail(x, y, direction) {
    ctx.beginPath();

    switch (direction) {
        case 'up':
            ctx.moveTo(x * scale + scale / 2, y * scale); 
            ctx.lineTo(x * scale, y * scale + scale);    
            ctx.lineTo(x * scale + scale, y * scale + scale); 
            break;
        case 'down':
            ctx.moveTo(x * scale + scale / 2, y * scale + scale); 
            ctx.lineTo(x * scale, y * scale);                     
            ctx.lineTo(x * scale + scale, y * scale);            
            break;
        case 'left':
            ctx.moveTo(x * scale, y * scale + scale / 2);
            ctx.lineTo(x * scale + scale, y * scale);    
            ctx.lineTo(x * scale + scale, y * scale + scale); 
            break;
        case 'right':
            ctx.moveTo(x * scale + scale, y * scale + scale / 2); 
            ctx.lineTo(x * scale, y * scale);                     
            ctx.lineTo(x * scale, y * scale + scale);            
            break;
    }

    ctx.closePath();
    ctx.fillStyle = '#75b74c'; 
    ctx.fill();
}

function update() {
    if (gameOver || paused) return;

    const head = { ...snake.body[0] };

    switch (snake.dir) {
        case 'up':
            head.y -= 1;
            break;
        case 'down':
            head.y += 1;
            break;
        case 'left':
            head.x -= 1;
            break;
        case 'right':
            head.x += 1;
            break;
    }

    snake.body.unshift(head);

    if (head.x === apple.x && head.y === apple.y) {
        score += 1;
        setApple();
    } else {
        snake.body.pop();
    }

    if (head.x < 0 || head.y < 0 || head.x >= columns || head.y >= rows || isClash(head)) {
        gameOver = true;
    }
}

function isClash(head) {
    for (let i = 1; i < snake.body.length; i++) {
        if (snake.body[i].x === head.x && snake.body[i].y === head.y) {
            return true;
        }
    }
    return false;
}

document.addEventListener('keydown', (e) => {
    if (gameOver && e.key === 'r') {
        resetGame();
        return;
    }

    if (e.key === 'p' || e.key === 'P') {
        paused = !paused;
        return;
    }

    switch (e.key) {
        case 'ArrowUp':
            if (snake.dir !== 'down') snake.dir = 'up';
            break;
        case 'ArrowDown':
            if (snake.dir !== 'up') snake.dir = 'down';
            break;
        case 'ArrowLeft':
            if (snake.dir !== 'right') snake.dir = 'left';
            break;
        case 'ArrowRight':
            if (snake.dir !== 'left') snake.dir = 'right';
            break;
    }
});

document.getElementById('up').addEventListener('click', () => {
    if (snake.dir !== 'down') snake.dir = 'up';
});

document.getElementById('down').addEventListener('click', () => {
    if (snake.dir !== 'up') snake.dir = 'down';
});

document.getElementById('left').addEventListener('click', () => {
    if (snake.dir !== 'right') snake.dir = 'left';
});

document.getElementById('right').addEventListener('click', () => {
    if (snake.dir !== 'left') snake.dir = 'right';
});

document.getElementById('pause').addEventListener('click', () => {
    paused = !paused;
    if (gameOver) {
        resetGame();
        return;
    }
});

function resetGame() {
    snake = new Snake();
    score = 0;
    gameOver = false;
    paused = false;
    setApple();
}

function init() {
    resizeGame();
    snake = new Snake();
    score = 0;
    setApple();
    setInterval(() => {
        update();
        draw();
    }, 120);
}

window.addEventListener('resize', resizeGame);
init();
