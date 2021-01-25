import { ROW, COL, BLOCK_SIZE } from './configs.js'

class NextBlock {
    constructor() {
        const target = document.querySelector(`#status-board .status`);
        const canvas = document.createElement('canvas');
        this.ctx = canvas.getContext('2d');
        this.init(canvas);
        target.appendChild(canvas)
    }

    init = canvas => {
        canvas.id = 'next-block';
        canvas.width = BLOCK_SIZE * 4;
        canvas.height = BLOCK_SIZE * 4;
        canvas.style.border = '1px solid black';
        this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
    }
}

export default NextBlock;