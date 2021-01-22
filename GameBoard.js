import { ROW, COL, BLOCK_SIZE, KEY } from './configs.js'
import Block from './Block.js';

const inputs = {
    [KEY.LEFT]: b => ({...b, x: b.x - 1}),
    [KEY.RIGHT]: b => ({...b, x: b.x + 1}),
    [KEY.UP]: b => ({...b, y: b.y - 1}),
    [KEY.DOWN]: b => ({...b, y: b.y + 1}),
    [KEY.SPACE]: b => ({...b, y: b.y + 1}),
};

class GameBoard {
    grid;

    constructor(main) {
        const canvas = document.createElement('canvas');
        this.ctx = canvas.getContext('2d');
        this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
        this.init(canvas);

        globalThis.addEventListener('keydown', this.onKeyDownHandler)
        main.appendChild(canvas);
    }

    init = board => {
        board.id = 'game-board';
        board.width = COL * BLOCK_SIZE;
        board.height = ROW * BLOCK_SIZE;
        board.style.border = '1px solid black';
    }

    reset = () => {
        this.grid = this.setEmptyGrid();
        this.block = new Block(this.ctx);
        this.block.draw();
    }

    setEmptyGrid = () => Array.from(Array(ROW), () => Array(COL).fill(0));

    onKeyDownHandler = e => {
        e.preventDefault();
        if (KEY) {
            const k = e.keyCode;
            if (k === KEY.RIGHT || k === KEY.LEFT || k === KEY.UP || k === KEY.DOWN) {
                const nextStatus = inputs[k](this.block);
                if (this.isValidMovement(nextStatus)) {
                    this.moveBlock(nextStatus);
                }
            }
        }
    }

    moveBlock(next) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.block.move(next)
        this.block.draw();
    }

    isValidMovement = b => {
        const a = b.shape.every((row, dy) => {
            return row.every((value, dx) => {
                let X = b.x + dx;
                let Y = b.y + dy;
                return value === 0 || (this.isIntheBoard(X, Y) && this.notViolateAnother(X, Y));
            })
        })
        console.log(a)
        return a
    }

    isIntheBoard = (x, y) => {
        return x >= 0 && x < COL && y <= ROW;
    }

    notViolateAnother = (x, y) => {
        return this.grid[y] && this.grid[y][x] === 0;
    }
}

export default GameBoard;