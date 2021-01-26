import GameBoard from './GameBoard.js'
import StatusBoard from './StatusBoard.js'
import NextBlock from './NextBlock.js'

function updateAccount(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = `${value}`;
    }
};
const accountValue = {
    high: 0,
    score: 0,
    lines: 0,
    level: 0
};
const account = new Proxy(accountValue, {
    set: (target, key, value) => {
        target[key] = value;
        updateAccount(key, value);
        return true;
    }
});


function drawNext(ctx) {
    const nextBlock = document.getElementById('next-block');
    const nextBlockCtx = nextBlock.getContext('2d');
    nextBlockCtx.clearRect(0, 0, nextBlockCtx.canvas.width, nextBlockCtx.canvas.height)
    ctx.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value > 0) {
                value > 1 ? (value === 4 ? x += 1 : x += 0.5) : x;
                value === 1 ? y = 0.5 : y;

                nextBlockCtx.beginPath()
                nextBlockCtx.fillStyle = ctx.color + 'ca';
                nextBlockCtx.fillRect(x, 1 + y, 1, 1);
                nextBlockCtx.fillStyle = ctx.color;
                nextBlockCtx.fillRect(x + 0.08, y + 1 + 0.08, .9, .9);
                nextBlockCtx.closePath();
            }
        })
    })
}
const nextBlock = {
    ctx: null
};
const nextBlockProxy = new Proxy(nextBlock, {
    set: (target, prop, value) => {
        target[prop] = value;
        drawNext(value)
        return true;
    }
})

class App {
    constructor(main) {
        this.GameBoard = new GameBoard(main, account, nextBlockProxy);
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