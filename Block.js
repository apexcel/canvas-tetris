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
        this.color = COLORS[rand];
        this.shape = SHAPES[rand];
        this.borderThickness = 1;
    }

    draw = () => {
        // this.ctx.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx.beginPath()
                    this.ctx.fillStyle = this.color + 'ca';
                    this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
                    this.ctx.fillStyle = this.color;
                    this.ctx.fillRect(this.x + x + 0.08, this.y + y + 0.08, .9, .9);
                    this.ctx.closePath()
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