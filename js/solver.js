export default class Solver {
  constructor(maze) {
    this.maze = maze;
    this.finish = false;
    this.stack = [];
  }

  solveMaze() {
    const nextStep = this.getNextStep();

    if (this.finish) return;

    if (nextStep) {
      this.stack.push(this.maze.current);
      this.proccedTonextStep(nextStep);
    } else {
      this.maze.current.highlight = false;
      this.maze.current.draw();

      this.maze.current = this.stack.pop();
      this.maze.current.highlight = true;
      this.maze.current.draw();
    }

    window.requestAnimationFrame(() => {
      return this.solveMaze();
    });
  }

  getNextStep() {
    if (
      this.maze.current.row === this.maze.grid.length - 1 &&
      this.maze.current.column === this.maze.grid.length - 1
    ) {
      this.finish = true;
      return;
    }
    if (!this.maze.current.wall.bottom) {
      const next =
        this.maze.grid[this.maze.current.row + 1]?.[this.maze.current.column];
      if (!next.tracked) return next;
    }

    if (!this.maze.current.wall.right) {
      const next =
        this.maze.grid[this.maze.current.row]?.[this.maze.current.column + 1];
      if (!next.tracked) return next;
    }

    if (!this.maze.current.wall.top) {
      const next =
        this.maze.grid[this.maze.current.row - 1]?.[this.maze.current.column];
      if (!next.tracked) return next;
    }

    if (!this.maze.current.wall.left) {
      const next =
        this.maze.grid[this.maze.current.row]?.[this.maze.current.column - 1];
      if (!next.tracked) return next;
    }
  }

  proccedTonextStep(nextStep) {
    this.maze.current.highlight = false;
    this.maze.current.draw();

    this.maze.current = nextStep;
    this.maze.current.tracked = true;
    this.maze.current.highlight = true;
    this.maze.current.draw();
  }

  initSolveMaze() {
    this.maze.current.highlight = false;
    this.maze.current.draw();

    this.maze.current = this.maze.grid[0][0];
    this.maze.current.tracked = true;
    this.maze.current.highlight = true;
    this.maze.current.draw();
  }
}
