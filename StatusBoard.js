

class StatusBoard {
    constructor(main) {
        this.statusBoard = document.createElement('div');
        this.statusBoard.className = 'status-board';
        main.appendChild(this.statusBoard);

        this.render();
    }

    render = () => {
        this.statusBoard.innerHTML = `
            <div>
                <span id='score'>Score: 0</span>
                <span id='high-score'>Highscore: 0</span>
                <span id='game-level'>Level: 0</span>
            </div>
        `;
    };
}

export default StatusBoard;