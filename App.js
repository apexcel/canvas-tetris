import GameBoard from './GameBoard.js'
import StatusBoard from './StatusBoard.js'
import NextBlock from './NextBlock.js'

function updateAccount(id, value) {
    let element = document.getElementById(id);
    if (element) {
        element.textContent = `${value}`;
    }
};

let accountValue = {
    high: 0,
    score: 0,
    lines: 0,
    level: 0
};

let account = new Proxy(accountValue, {
    set: (target, key, value) => {
        target[key] = value;
        updateAccount(key, value);
        return true;
    }
});

class App {
    constructor(main) {
        this.GameBoard = new GameBoard(main, account);
        this.StatusBoard = new StatusBoard(main);
        this.NextBlock = new NextBlock();
        this.isPlaying = false;

        const playBtn = document.getElementById('play-btn');
        playBtn.onclick = () => {
            if (!this.isPlaying) {
                this.GameBoard.play();
                this.isPlaying = true;
            }
            else {
                this.GameBoard.gameOver();
                this.isPlaying = false;
            }
        }
        
    }
}

export default App;