import { SHAPES, BLOCK_SIZE } from './configs.js';

export class Block {
    constructor(ctx) {
        this.ctx = ctx;
        this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
        this.x = 0;
        this.y = 0;
        this.createBlock();
    }

    createBlock = () => {
        const rand = Math.floor(Math.random() * 7) + 1;
        this.shape = SHAPES[rand];
    }

    draw = () => {
        // this.ctx.fillStyle = this.color;
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