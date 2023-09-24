const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const hookersGreen = "#5B7B7A";
const honeyDew = "#E0F2E9";
const beaver = "#A17C6B";
const paleDogWood = "#CEB5A7";

export default class Maze {
  constructor(size) {
    this.container = canvas.clientWidth;
    this.size = size;
    this.current = null;
    this.grid = []; // will be row x grid
    this.stack = [];
    this.init = false;
    this.playAble = false;
    this.setup();
    this.keyListener = this.keyListener.bind(this);
  }

  setup() {
    for (let r = 0; r < this.size; r++) {
      const row = [];
      for (let c = 0; c < this.size; c++) {
        // generate new cell for each column
        const cell = new Cell(r, c, this.container / this.size);
        row.push(cell);
      }
      this.grid.push(row);
    }

    this.stack.push(this.grid[0][0]);
    this.current = this.grid[0][0]; // first position of the grid
  }

  draw(options = {}) {
    const { reset = false } = options;
    reset && ctx.reset();
    for (let r = 0; r < this.grid.length; r++) {
      for (let c = 0; c < this.grid[r].length; c++) {
        // generate new cell for each column
        const cell = this.grid[r][c];
        cell.draw(this.container, this.size);
      }
    }
  }

  initGenerate() {
    this.playAble = false;
    this.current.highlight = true;
    this.init = true;
    this.current.visited = true;
    this.current.draw();
  }

  generateMaze(options = {}) {
    const { manual = false } = options;
    if (!this.init) {
      this.initGenerate();
    } else {
      const neighbours = this.getNeighbours();
      if (neighbours?.length) {
        const next = neighbours[Math.floor(Math.random() * neighbours.length)];
        const current = this.current;

        this.removeWall(current, next);

        this.current = next;
        current.highlight = false;

        next.visited = true;
        next.highlight = true;

        this.stack.push(next);

        current.draw();
        next.draw();
      } else if (this.stack.length) {
        const prevCellFromStack = this.stack.pop();
        const current = this.current;

        current.highlight = false;
        prevCellFromStack.highlight = true;

        this.current = prevCellFromStack;

        current.draw();
        prevCellFromStack.draw();
      } else if (!this.stack.length) {
        const firstCell = this.grid[0][0];

        const start = this.grid[0][0];
        const finish = this.grid[this.grid.length - 1][this.grid.length - 1];
        start.wall.left = false;
        finish.wall.right = false;

        firstCell.draw();
        start.draw();
        finish.draw();

        this.playAble = true;
        this.init = false;

        this.initPlay();
        return;
      }
    }

    if (manual) return;
    window.requestAnimationFrame(() => {
      return this.generateMaze();
    });
  }

  removeWall(current, next) {
    const x = current.column - next.column;
    const y = current.row - next.row;

    if (x === 1) {
      current.wall.left = false;
      next.wall.right = false;
    } else if (x === -1) {
      current.wall.right = false;
      next.wall.left = false;
    } else if (y === 1) {
      current.wall.top = false;
      next.wall.bottom = false;
    } else {
      current.wall.bottom = false;
      next.wall.top = false;
    }
  }

  getNeighbours() {
    return [
      this.grid[this.current.row - 1]?.[this.current.column], // top
      this.grid[this.current.row]?.[this.current.column + 1], // right
      this.grid[this.current.row + 1]?.[this.current.column], // bottom
      this.grid[this.current.row]?.[this.current.column - 1], // left
    ].filter((item) => item && !item.visited);
  }

  initPlay() {
    window.onkeydown = this.keyListener;
  }

  keyListener(e) {
    if (!this.playAble) return;
    const prevCell = this.current;
    if (e.keyCode === 38 || e.keyCode === 87) { // top move
      const next = this.grid[this.current.row - 1]?.[this.current.column];
      if (!next || this.current.wall.top) return;
      this.current = next;
    } else if (e.keyCode === 39 || e.keyCode === 68) { // right move
      // we assume the exit only on bottom right side
      if (this.current.row === this.grid.length - 1 && this.current.column === this.grid.length - 1) {
        this.current = this.grid[0][0]
      } else {
        const next = this.grid[this.current.row]?.[this.current.column + 1];
        if (!next || this.current.wall.right) return;
        this.current = next;
      }
    } else if (e.keyCode === 40 || e.keyCode === 83) { // bottom move
      const next = this.grid[this.current.row + 1]?.[this.current.column];
      if (!next || this.current.wall.bottom) return;
      this.current = next;
    } else if (e.keyCode === 37 || e.keyCode === 65) { // left move
      // we assume the starting point only on top left
      if (this.current.row === 0 && this.current.column === 0) {
        this.current = this.grid[this.grid.length - 1][this.grid.length - 1]
      } else {
        const next = this.grid[this.current.row ]?.[this.current.column - 1];
        if (!next || this.current.wall.left) return;
        this.current = next;
      }
    }

    prevCell.highlight = false;
    this.current.highlight = true;

    prevCell.draw();
    this.current.draw();
  }
}

class Cell {
  constructor(row, column, boxSize) {
    this.row = row;
    this.column = column;
    this.boxSize = boxSize;
    this.x = this.boxSize * this.column;
    this.y = this.boxSize * this.row;
    this.visited = false;
    this.wall = {
      top: true,
      right: true,
      bottom: true,
      left: true,
    };
    this.highlight = false;
    this.startPoint = false;
    this.endPoint = false;
  }

  drawWall() {
    ctx.strokeStyle = honeyDew;
    ctx.lineWidth = 5;
    this.topWall();
    this.rightWall();
    this.bottomWall();
    this.leftWall();
  }

  topWall() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + (this.wall.top ? this.boxSize : 0), this.y);
    ctx.stroke();
  }

  rightWall() {
    ctx.beginPath();
    ctx.moveTo(this.x + this.boxSize, this.y);
    ctx.lineTo(
      this.x + this.boxSize,
      this.y + (this.wall.right ? this.boxSize : 0)
    );
    ctx.stroke();
  }

  bottomWall() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.boxSize);
    ctx.lineTo(
      this.x + (this.wall.bottom ? this.boxSize : 0),
      this.y + this.boxSize
    );
    ctx.stroke();
  }

  leftWall() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + (this.wall.left ? this.boxSize : 0));
    ctx.stroke();
  }

  drawSquare() {
    ctx.fillStyle = this.highlight
      ? paleDogWood
      : this.visited
      ? beaver
      : hookersGreen;
    ctx.fillRect(this.x, this.y, this.boxSize, this.boxSize);
  }

  draw() {
    this.drawSquare();
    this.drawWall();
  }
}
