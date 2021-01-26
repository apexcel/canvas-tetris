import { BLOCK_SIZE } from './configs.js'

// TODO: 다음 나올 블록 보여주기
class NextBlock {
    constructor() {
        const target = document.querySelector(`#status-board .status`);
        const nextCanvas = document.createElement('canvas');
        this.ctx = nextCanvas.getContext('2d');
        this.init(nextCanvas);

        target.appendChild(nextCanvas)
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