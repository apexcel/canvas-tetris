

class StatusBoard {
    constructor(main) {
        this.statusBoard = document.createElement('div');
        this.statusBoard.className = 'status-board';
        main.appendChild(this.statusBoard);

        this.render();
    }

    render = () => {
        const prev = globalThis.localStorage.getItem('high-score');
        this.statusBoard.innerHTML = `
            <div id='status-board'>
                <div class='status'>
                    <h1>Next</h1>
                </div>
                <div class='status'>
                    <h1>Score</h1>
                    <span id='score'>0</span>
                </div>
                <div class='status'>
                    <h1>High Score</h1>
                    <span id='high'>${prev ? prev : 0}</span>
                </div>
                <div class='status'>
                    <h1>Lines</h1>
                    <span id='lines'>0</span>
                </div>
                <div class='status play'>
                    <div id='play-btn'>
                        <h1 id='play'>Play</h1>
                    </div>
                </div>
            </div>
        `;
    };
}

export default StatusBoard;