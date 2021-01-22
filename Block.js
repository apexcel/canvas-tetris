import { SHAPES, BLOCK_SIZE, COLORS, getRandomInt } from './configs.js';

export class Block {
    constructor(ctx) {
        this.ctx = ctx;
        this.createBlock();
    }

    createBlock = () => {
        const rand = getRandomInt(SHAPES.length - 1);
        this.x = Math.floor(this.ctx.canvas.width / BLOCK_SIZE / 2);
        this.y = 0;
        // this.color = `rgb(${getRandomInt(255)}, ${getRandomInt(255)}, ${getRandomInt(255)})`;
        this.color = COLORS[rand];
        this.shape = SHAPES[rand];
    }

    draw = () => {
        this.ctx.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
                }
            })
        })
    }

    move = status => {
        this.x = status.x;
        this.y = status.y;
        this.shape = status.shape;
    }
}

export default Block;