import { ROW, COL, BLOCK_SIZE, KEY } from './configs.js'
import Block from './Block.js';
class GameBoard {
    grid;
    transform = {
        [KEY.LEFT]: b => ({ ...b, x: b.x - 1 }),
        [KEY.RIGHT]: b => ({ ...b, x: b.x + 1 }),
        [KEY.UP]: b => (this.moveBlock(this.rotate(b))),
        [KEY.DOWN]: b => ({ ...b, y: b.y + 1 }),
        [KEY.SPACE]: b => ({ ...b, y: b.y + 1 }),
    };

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

        this.time = {
            start: 0,
            elapsed: 0,
            level: 1000
        };
        this.block = new Block(this.ctx);
        this.block.draw();
        this.animate()
    }

    animate = (now = 0) => {
        this.time.elapsed = now - this.time.start;
        if (this.time.elapsed > this.time.level) {
            this.time.start = now;
            this.dropBlock(this.block);
        }
        this.clearCanvas(this.ctx);
        this.block.draw();
        this.requestId = requestAnimationFrame(this.animate.bind(this))
    }

    reset = () => {
        this.grid = this.setEmptyGrid();
    }

    setEmptyGrid = () => Array.from(Array(ROW), () => Array(COL).fill(0));

    onKeyDownHandler = e => {
        const k = e.keyCode;
        const getInput = this.transform[k];
        if (getInput) {
            e.preventDefault();
            let nextStatus = getInput(this.block);
            if (k === KEY.RIGHT || k === KEY.LEFT || k === KEY.DOWN) {
                if (this.isValidMovement(nextStatus)) {
                    this.moveBlock(nextStatus);
                }
            }
            else if (k === KEY.SPACE) {
                while (this.isValidMovement(nextStatus)) {
                    this.moveBlock(nextStatus);
                    nextStatus = this.transform[KEY.DOWN](this.block)
                }
            }
        }
        else {
            return;
        }
    }

    dropBlock = currentBlock => {
        const nextStatus = ({...currentBlock, y: currentBlock.y + 1});
        if (this.isValidMovement(nextStatus)) {
            this.block.move(nextStatus);
        }
    }

    moveBlock = next => {
        this.clearCanvas(this.ctx);
        this.block.move(next)
        this.block.draw();
    }

    isValidMovement = block => {
        return block.shape.every((row, dy) => {
            return row.every((value, dx) => {
                let X = block.x + dx;
                let Y = block.y + dy;
                return value === 0 || (this.isIntheBoard(X, Y) && this.notViolateAnother(X, Y));
            })
        })
    }

    isIntheBoard = (x, y) => {
        return x >= 0 && x < COL && y <= ROW;
    }

    notViolateAnother = (x, y) => {
        return this.grid[y] && this.grid[y][x] === 0;
    }

    rotate = (block, direction) => {
        let clone = JSON.parse(JSON.stringify(block));
        for (let y = 0; y < clone.shape.length; y += 1) {
            for (let x = 0; x < y; x += 1) {
                [clone.shape[x][y], clone.shape[y][x]] = [clone.shape[y][x], clone.shape[x][y]]
            }
        }
        clone.shape.forEach(row => row.reverse());

        return this.isValidMovement(clone) ? clone : block;
        // return clone;
    }

    clearCanvas = ctx => ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    freeze = () => {
        this.block.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.grid[y + this.block.y][x + this.block.x] = value;
                }
            })
        })
    }
}

export default GameBoard;