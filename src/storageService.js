const KEY = "sudoku-board";

class StorageService {
  setBoard(board) {
    localStorage.setItem(KEY, JSON.stringify(board));
  }

  getBoard() {
    return JSON.parse(localStorage.getItem(KEY));
  }
}

export default new StorageService();
