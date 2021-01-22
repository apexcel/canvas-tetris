import GameBoard from './GameBoard.js'

class App {
    constructor(main) {
        this.main = main;
        this.board = new GameBoard(main);
        this.board.reset()
    }
}

export default App;