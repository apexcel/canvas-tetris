import { ROW, COL, BLOCK_SIZE, KEY, POINTS, COLORS, LEVEL, LINE_FOR_NEXT_LEVEL, getCenterPos } from './configs.js'
import Block from './Block.js';

const prevHighScore = globalThis.localStorage.getItem('high-score');
const saveHighScore = value => globalThis.localStorage.setItem('high-score', value);
const audio = document.getElementById('bgm');
class GameBoard {
    grid;
    transform = {
        [KEY.LEFT]: b => ({ ...b, x: b.x - 1 }),
        [KEY.RIGHT]: b => ({ ...b, x: b.x + 1 }),
        [KEY.UP]: b => b,
        [KEY.DOWN]: b => ({ ...b, y: b.y + 1 }),
        [KEY.SPACE]: b => ({ ...b, y: b.y + 1 }),
        [KEY.ESC]: () => this.gameOver(),
        [KEY.P]: () => this.pause()
    };

    constructor(main, account, nextBlockProxy) {
        const canvas = document.createElement('canvas');
        this.ctx = canvas.getContext('2d');
        this.account = account;
        this.nextBlockProxy = nextBlockProxy;
        this.init(canvas);

        main.appendChild(canvas);
    }

    play = () => {
        this.reset();
        this.time = {
            start: 0,
            elapsed: 0,
            level: 1000,
            gameLevel: 0
        };
        this.block = new Block(this.ctx)
        this.nextBlockProxy.ctx = new Block(this.ctx);
        this.animate();
        audio.play();
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
        globalThis.addEventListener('keydown', this.onKeyDownHandler)
        this.account.score = 0;
        this.account.lines = 0;
        this.account.high = prevHighScore ? prevHighScore : 0;

        this.grid = Array.from(Array(ROW), () => Array(COL).fill(0));
        this.isPaused = false;
    }

    pause = () => {
        const pauseKeys = e => {
            e.preventDefault();
            if (e.code === KEY.P) {
                globalThis.addEventListener('keydown', this.onKeyDownHandler);
                this.pause();
            }
        };
        if (!this.isPaused) {
            this.isPaused = true;
            cancelAnimationFrame(this.requestId);
            globalThis.removeEventListener('keydown', this.onKeyDownHandler);
            globalThis.addEventListener('keydown', pauseKeys)
        }
        else {
            this.isPaused = false;
            globalThis.removeEventListener('keydown', pauseKeys);
            requestAnimationFrame(this.animate);
        }
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
            this.block = this.nextBlockProxy.ctx;
            this.nextBlockProxy.ctx = new Block(this.ctx);

            // this.block = new Block(this.ctx)
            // this.nextBlockProxy.ctx = this.block;
            this.isFreeze = false;
        }

        if (this.account.score > prevHighScore) {
            this.account.high = this.account.score;
        }

        this.clearCanvas(this.ctx);
        this.block.draw();
        this.drawGrid();
        this.requestId = requestAnimationFrame(this.animate)
    }

    gameOver = () => {
        cancelAnimationFrame(this.requestId);
        globalThis.removeEventListener('keydown', this.onKeyDownHandler)
        audio.load();
        const [cx, cy] = getCenterPos();
        this.ctx.font = '1px Arial'
        this.ctx.fillStyle = '#333333'
        this.ctx.fillRect(0, cy, COL, 3)
        this.ctx.fillStyle = '#FFFFFF'
        this.ctx.fillText('GAME OVER', Math.floor(COL / 3), cy + 1);
        this.saveScore();
    }

    saveScore = () => {
        if (prevHighScore) {
            prevHighScore < this.account.score ? saveHighScore(this.account.score) : prevHighScore;
        }
        else {
            saveHighScore(this.account.score);
        }
    }

    drawGrid = () => {
        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx.beginPath()
                    this.ctx.fillStyle = COLORS[value] + 'ca';
                    this.ctx.fillRect(x, y, 1, 1);
                    this.ctx.fillStyle = COLORS[value];
                    this.ctx.fillRect(x + 0.08, y + 0.08, .9, .9);
                    this.ctx.closePath()
                }
            });
        });
    };

    onKeyDownHandler = e => {
        const k = e.code;
        const getInput = this.transform[k];

        if (getInput) {
            e.preventDefault();
            let nextStatus = getInput(this.block);
            if (k === KEY.RIGHT || k === KEY.LEFT || k === KEY.DOWN || k === KEY.UP) {
                if (this.isValidMovement(nextStatus)) {
                    this.moveBlock(nextStatus);
                }
                if (k === KEY.UP) {
                    this.moveBlock(this.rotate(this.block));
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

    rotate = (block) => {
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
            this.account.score += (this.time.gameLevel + 1) * this.addLineClearPoints(lines);
            this.account.lines += lines;
            this.computeGameLevel();
        }
    }

    addLineClearPoints = lines => {
        return lines === 1 ? POINTS.SINGLE :
            lines === 2 ? POINTS.DOUBLE :
                lines === 3 ? POINTS.TRIPLE :
                    lines === 4 ? POINTS.TETRIS :
                        0;
    }

    computeGameLevel = () => {
        if (this.account.lines > LINE_FOR_NEXT_LEVEL) {
            this.time.gameLevel += 1;
            if (this.time.gameLevel < LEVEL.length) {
                this.time.level = LEVEL[this.time.gameLevel];
            }
        }
    }
}

export default GameBoard;