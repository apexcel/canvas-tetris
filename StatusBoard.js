

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
                <span>Highest Score: 0</span>
                <span>Level: 0</span>
            </div>
        `;
    };
}

export default StatusBoard;