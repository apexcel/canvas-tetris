import { ROW, COL, BLOCK_SIZE, KEY, POINTS, COLORS, getCenterPos } from './configs.js'
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

    constructor(main, account) {
        const canvas = document.createElement('canvas');
        this.ctx = canvas.getContext('2d');
        this.account = account;
        this.init(canvas);

        globalThis.addEventListener('keydown', this.onKeyDownHandler)
        main.appendChild(canvas);
    }

    play = () => {
        this.time = {
            start: 0,
            elapsed: 0,
            level: 1000
        };
        this.block = new Block(this.ctx)
        this.animate();
    };

    init = board => {
        board.id = 'game-board';
        board.width = COL * BLOCK_SIZE;
        board.height = ROW * BLOCK_SIZE;
        board.style.border = '1px solid black';
        this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
        this.reset();
    }

    reset = () => {
        this.account.score = 0;
        this.resetGrid();
    }

    animate = (now = 0) => {
        this.time.elapsed = now - this.time.start;
        if (this.time.elapsed > this.time.level) {
            this.time.start = now;
            this.dropBlock(this.block);
            if (this.block.y === 0) {
                this.gameOver()
                return;
            }
        }
        if (this.isFreeze) {
            this.block = new Block(this.ctx)
            this.isFreeze = false;
        }

        this.clearCanvas(this.ctx);
        this.block.draw();
        this.drawGrid();
        this.requestId = requestAnimationFrame(this.animate)
    }

    gameOver = () => {
        const [cx, cy] = getCenterPos();
        cancelAnimationFrame(this.requestId);
        this.ctx.font = '1px Arial'
        this.ctx.fillStyle = '#333333'
        this.ctx.fillRect(0, cy, COL, 3)
        this.ctx.fillStyle = '#FFFFFF'
        this.ctx.fillText('GAME OVER', Math.floor(COL / 4), cy + 1);
    }

    resetGrid = () => {
        this.grid = Array.from(Array(ROW), () => Array(COL).fill(0));
    }

    drawGrid = () => {
        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx.fillStyle = COLORS[value];
                    this.ctx.fillRect(x, y, 1, 1);
                }
            });
        });
    };

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
                if (k === KEY.DOWN) {
                    this.account.score += POINTS.SOFT_DROP;
                }
            }
            else if (k === KEY.SPACE) {
                while (this.isValidMovement(nextStatus)) {
                    this.moveBlock(nextStatus);
                    nextStatus = this.transform[KEY.DOWN](this.block);
                    this.account.score += POINTS.HARD_DROP;
                }
            }
        }
        return;
    }

    dropBlock = currentBlock => {
        const nextStatus = ({ ...currentBlock, y: currentBlock.y + 1 });
        if (this.isValidMovement(nextStatus)) {
            this.block.move(nextStatus);
        }
        else {
            this.freeze();
            this.isFreeze = true;
            this.clearLines();
        }
        return;
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

    clearLines = () => {
        let lines = 0;
        this.grid.forEach((row, y) => {
            if (row.every(value => value > 0)) {
                lines += 1;
                this.grid.splice(y, 1);
                this.grid.unshift(Array(COL).fill(0));
            }
        });

        if (lines > 0) {
            this.account.score += this.addLineClearPoints(lines);
        }
    }

    addLineClearPoints = lines => {
        return lines === 1 ? POINTS.SINGLE :
        lines === 2 ? POINTS.DOUBLE :
        lines === 3 ? POINTS.TRIPLE :
        lines === 4 ? POINTS.TETRIS :
        0;
    }
}

export default GameBoard;