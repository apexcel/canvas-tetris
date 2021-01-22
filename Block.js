import { SHAPES, BLOCK_SIZE } from './configs.js';

export class Block {
    constructor(ctx) {
        this.ctx = ctx;
        this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
        this.x = Math.floor(ctx.canvas.width / BLOCK_SIZE / 2);
        this.y = 0;
        this.createBlock();
    }

    createBlock = () => {
        const rand = Math.floor(Math.random() * (SHAPES.length - 1)) + 1;
        this.ctx.fillStyle = `rgb(${this.randColor()}, ${this.randColor()}, ${this.randColor()})`;
        this.shape = SHAPES[rand];
    }

    randColor = () => Math.floor(Math.random() * 255) + 1;

    draw = () => {
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