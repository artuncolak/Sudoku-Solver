export const EMPTY_GRID = () =>
  new Array(9).fill(null).map(() => new Array(9).fill(0));
export const EMPTY_START_GRID = () =>
  new Array(9).fill(null).map(() => new Array(9));

class SudokuService {
  solvingProcess = [];

  getRandomExample() {
    const examples = [
      [
        [0, 0, 3, 0, 0, 0, 0, 0, 0],
        [5, 8, 0, 2, 0, 0, 3, 0, 9],
        [2, 0, 0, 4, 0, 5, 8, 7, 1],
        [3, 7, 0, 0, 1, 0, 5, 9, 0],
        [8, 0, 0, 7, 4, 0, 1, 3, 0],
        [0, 2, 9, 0, 0, 8, 0, 0, 0],
        [6, 0, 0, 1, 0, 3, 4, 0, 7],
        [4, 0, 2, 0, 6, 0, 0, 0, 0],
        [0, 0, 0, 5, 2, 4, 6, 8, 0],
      ],
      [
        [4, 0, 0, 0, 5, 0, 0, 3, 2],
        [0, 1, 0, 0, 9, 0, 7, 0, 5],
        [7, 5, 3, 0, 0, 4, 1, 9, 6],
        [0, 0, 1, 0, 7, 0, 0, 0, 0],
        [6, 0, 9, 0, 0, 1, 2, 5, 0],
        [0, 0, 0, 5, 0, 0, 6, 1, 3],
        [3, 0, 4, 0, 0, 8, 0, 0, 1],
        [0, 0, 0, 4, 0, 0, 0, 7, 8],
        [0, 0, 0, 7, 6, 3, 0, 2, 9],
      ],
      [
        [0, 0, 4, 2, 7, 6, 0, 3, 0],
        [0, 5, 7, 1, 0, 0, 0, 4, 9],
        [0, 0, 0, 9, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 9, 6, 0],
        [0, 0, 0, 0, 0, 7, 1, 8, 5],
        [0, 0, 0, 0, 2, 0, 3, 0, 4],
        [0, 0, 0, 7, 0, 1, 0, 9, 0],
        [0, 0, 0, 6, 0, 0, 2, 1, 0],
        [1, 0, 6, 0, 8, 0, 0, 0, 0],
      ],
    ];
    return examples[Math.floor(Math.random() * examples.length)];
  }

  findEmpty(grid) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === 0) return { i, j };
      }
    }
    return false;
  }

  isSafe(grid, row, col, num) {
    for (let i = 0; i < grid.length; i++) {
      if (grid[i][col] === num && i !== row) return false;
      if (grid[row][i] === num && i !== col) return false;
    }

    const x = Math.floor(row / 3) * 3;
    const y = Math.floor(col / 3) * 3;

    for (let i = x; i < x + 3; i++) {
      for (let j = y; j < y + 3; j++) {
        if (grid[i][j] === num && i !== row && j !== col) return false;
      }
    }

    return true;
  }

  solveRecursive(grid) {
    this.solvingProcess.push(grid.map((arr) => arr.slice()));
    const find = this.findEmpty(grid);
    let position;
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    if (find) {
      position = find;
    } else return true;

    while (nums.length !== 0) {
      const num = nums[0];

      if (this.isSafe(grid, position.i, position.j, num)) {
        grid[position.i][position.j] = Number(num);
        if (this.solveRecursive(grid)) return true;
        grid[position.i][position.j] = 0;
      }
      nums.shift();
    }

    return false;
  }

  solve(grid) {
    this.solvingProcess = [];
    this.solveRecursive(grid);
    return this.solvingProcess;
  }
}

export default new SudokuService();
