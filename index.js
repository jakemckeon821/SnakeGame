// a node represents a block (grid)
//each grid is uniquely denoted by its row and col
class Node {
    constructor(row, col, next = null) {
        this.row = row,
            this.col = col,
            this.next = next
    }
}

// below is the naive  implementation of a linkedlist in js to store 2d grids
//a snake body consists of multiple connected blocks (grids)
class LinkedList {
    constructor() {
        this.head = null; //start out to be empty, zero grids
    }
}
//to simulate slithering and growing of a snake, add the square on the way of the snake to the head of the snake, and remove the tail of the snake body.
//a new food taken becomes the new head of the list, thus extend the body of the snake

LinkedList.prototype.insertAtBeginning = function (row, col) {
    // A newNode object is created with row and col property data and next pointer = null
    let newNode = new Node(row, col);
    // The pointer next is assigned head pointer so that both pointers now point at the same node
    newNode.next = this.head;
    // As we are inserting at the beginning the head pointer needs to now point at the newNode
    this.head = newNode;
    return this.head;
}

LinkedList.prototype.deleteLastNode = function () {
    if (!this.head) {
        return null;
    }
    // if only one node in the list
    if (!this.head.next) {
        this.head = null;
        return;
    }
    let previous = this.head;
    let tail = this.head.next;

    while (tail.next !== null) {
        previous = tail;
        tail = tail.next;
    }

    previous.next = null;
    return this.head;
}

// The above code implement a limited singlylinked list which will be used to model the snake body
//or a queue, where snake head is the queue's tail


let gameoverflag;
let paragraph;
let bs;
emptycolor = "rgb(100,45,200)";
snakecolor = "rgb(200,45,134)";
foodcolor = "rgb(0,245,100)";
rownum = 15;
colnum = 15;
cellsize = 22;
inndercellsize = 20;
direction = 'up';
let gsi = null;
let dsi = null;
let snakebody = null;
let ctx = null;
let foodrow, foodcol;

//define your own arrow keys such as IJKL WASD
function logKey(e) {
    console.log(e.code);
    switch (e.code) {
        case "KeyI":
            direction = 'up';
            break;
        case 'KeyJ':
            direction = 'left';
            break;
        case "KeyL":
            direction = 'right';
            break;
        case 'KeyK':
            direction = 'down';
            break;
    }
}


function initializesnake() {
    snakerow = Math.floor(Math.random() * rownum);
    snakecol = Math.floor(Math.random() * colnum);
    snakebody = new LinkedList();
    snakebody.insertAtBeginning(snakerow, snakecol);

    if (snakerow > 0)
        snakebody.insertAtBeginning(snakerow - 1, snakecol);
    else
        snakebody.insertAtBeginning(snakerow + 1, snakecol);

}

function randomfood() {
    foodrow = Math.floor(Math.random() * rownum);
    foodcol = Math.floor(Math.random() * colnum);
}

function drawfood() {
    ctx.fillStyle = foodcolor;
    //console.log("food:", foodrow, foodcol)
    ctx.beginPath();
    x = foodcol * cellsize;
    y = foodrow * cellsize;
    ctx.rect(x, y, inndercellsize, inndercellsize);
    ctx.fill();
    ctx.closePath();

}

function drawboard() {
    ctx.fillStyle = emptycolor;
    ctx.beginPath();
    for (var row = 0, i = 0; i < rownum; row += cellsize, i++) {
        for (var col = 0, j = 0; j < colnum; col += cellsize, j++) {
            ctx.rect(row, col, inndercellsize, inndercellsize);
        }
    }
    ctx.fill();
    ctx.closePath();
}



function initializeGame() {
    document.addEventListener('keypress', logKey);
    paragraph = document.querySelector('p');
    bs = document.getElementById('start');
    bs.addEventListener('click', run, false);
    //console.log(bs, paragraph);
    ctx = document.getElementById('grid').getContext('2d');
}

function resetGame() {
    gameoverflag = false;
    direction = 'up';
    randomfood();
    initializesnake();
    redrawgame();
}

function run() {
    if (bs.value === 'Start') startGame();
    else stopGame();
}

function startGame() {
    bs.value = 'Stop';
    resetGame();
    //game loop
    gsi = setInterval(updategame, 1000);
    dsi = setInterval(redrawgame, 500);

    paragraph.textContent = 'The game has started!';
    console.log("started ...");
}

function stopGame() {
    bs.value = 'Start';
    clearInterval(gsi);
    clearInterval(dsi);
    paragraph.textContent = 'The Game is stopped.';
    console.log("stopped ...");
}

function collide(row1, col1, row2, col2) {
    if (row1 == row2 && col1 == col2) return true;
    else return false;
}

function hitfood(row, col) {
    if (collide(row, col, foodrow, foodcol))
        return true;
    else
        return false;

}
function hitthewall(row, col) {
    if (row < 0 || col < 0 || row > 14 || col > 14)
        return true;
    else
        return false;
}

function hitself(newrow, newcol) {
    //traverse through the body list or the queue
    agent = snakebody.head;
    while (agent != null) {
        if (collide(newrow, newcol, agent.row, agent.col))
            return true;
        agent = agent.next;
    }
    return false;
}

function updategame() {
    if (gameoverflag === true) return;
    switch (direction) {
        case 'up':
            newrow = snakebody.head.row - 1;
            newcol = snakebody.head.col;
            break;
        case 'left':
            newrow = snakebody.head.row;
            newcol = snakebody.head.col - 1;
            break;
        case 'right':
            newrow = snakebody.head.row;
            newcol = snakebody.head.col + 1;
            break;
        case 'down':
            newrow = snakebody.head.row + 1;
            newcol = snakebody.head.col;
            break;


    }

    if (hitthewall(newrow, newcol)) {
        message = "Game over due to hitting the wall!";
        console.log(message);
        alert(message);

        stopGame();
        gameoverflag = true;
    }
    if (hitself(newrow, newcol)) {
        message = "Game over due to hitting the snake body itself!";
        console.log(message);
        stopGame();
        gameoverflag = true;
    }

    snakebody.insertAtBeginning(newrow, newcol);

    if (!hitfood(newrow, newcol))
        snakebody.deleteLastNode();
    else
        randomfood();
}


function redrawgame() {
    drawboard();
    drawfood();
    drawsnake();
}

function drawsnake() {
    ctx.beginPath();
    ctx.fillStyle = snakecolor;
    agent = snakebody.head;
    while (agent != null) {
        y = agent.row * cellsize;
        x = agent.col * cellsize;
        ctx.rect(x, y, inndercellsize, inndercellsize);
        agent = agent.next;
    }
    ctx.fill();
    ctx.closePath();
}

document.addEventListener("DOMContentLoaded", function () {
    // Handler when the DOM is fully loaded
    initializeGame();
});
