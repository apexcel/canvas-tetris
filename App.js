import GameBoard from './GameBoard.js'
import StatusBoard from './StatusBoard.js'

function updateAccount(id, value) {
    let element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
};

let accountValue = {
    score: 0,
};

let account = new Proxy(accountValue, {
    set: (target, key, value) => {
        console.log(target, key, value)
        target[key] = value;
        updateAccount(key, value);
        return true;
    }
});

class App {
    constructor(main) {
        this.board = new GameBoard(main, account);
        this.board.play();
        new StatusBoard(main);
    }
}

export default App;