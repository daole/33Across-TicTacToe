const PLAYER = "X";
const AI = "O";

class Game {
    constructor(gameContainerElementId, boardSize, numberOfConsecutiveMovesToWin) {
        this.gameContainerElementId = gameContainerElementId;
        this.boardSize = boardSize;
        this.numberOfConsecutiveMovesToWin = numberOfConsecutiveMovesToWin;
        this.maxNumberOfMoves = boardSize * boardSize;
        this.boardCellOnClick = this.boardCellOnClick.bind(this);
        this.allBoardCells = [];

        const boardRows = [];
        for (let rowIndex = 0; rowIndex < this.boardSize; rowIndex++) {
            const boardCells = [];
            for (let columnIndex = 0; columnIndex < this.boardSize; columnIndex++) {
                const boardCell = new BoardCell(rowIndex, columnIndex, this.boardCellOnClick);
                boardCells.push(boardCell);
                this.allBoardCells.push(boardCell);
            }
            const boardRow = new BoardRow(rowIndex, boardCells);
            boardRows.push(boardRow);
        }
        this.board = new Board(boardRows);
    }

    init() {
        const gameContainerElement = document.getElementById(this.gameContainerElementId);
        const boardContainerElement = createElement("div", "_tttBoardContainer", "_tttBoardContainer");
        gameContainerElement.appendChild(boardContainerElement);
        this.board.init();
        boardContainerElement.appendChild(this.board.element);
        const boardFooter = createElement("div", "_tttBoardFooter", "_tttBoardFooter");
        boardContainerElement.appendChild(boardFooter);
    }

    start() {
        this.isPlayerTurn = true;
        this.moveCount = 0;
        this.isGameEnded = false;
        for (const boardCell of this.allBoardCells) {
            boardCell.reset();
        }
        this.availableBoardCells = [ ...this.allBoardCells ];
    }

    boardCellOnClick(boardCell) {
        if (!this.isGameEnded && this.isPlayerTurn) { // Check if this is the turn of the player
            if (!boardCell.value) { // Check if the board cell is available to make a move
                this.makeMove(boardCell);
                if (!this.isGameEnded) {
                    this.calculateAIMove();
                }
            }
        }
    }

    makeMove(boardCell) {
        this.moveCount++;
        boardCell.setValue(this.isPlayerTurn ? PLAYER : AI);
        const isWinning = this.isWinningMove(boardCell);
        if (isWinning) {
            this.isGameEnded = true;
            this.showGameOverMessage(`Game Over! ${this.isPlayerTurn ? "You win!" : "AI wins!"}`);
        } else if (this.maxNumberOfMoves == this.moveCount) {
            this.isGameEnded = true;
            this.showGameOverMessage("Game Over! Draw game!")
            alert("Draw!");
        }
        this.isPlayerTurn = !this.isPlayerTurn;
        this.availableBoardCells.splice(this.availableBoardCells.indexOf(boardCell), 1);
    }

    isWinningMove(boardCell) {
        const boardCellRowIndex = boardCell.rowIndex;
        const boardCellColumnIndex = boardCell.columnIndex;
        const boardCellValue = boardCell.value;
        
        // Horizontal checking
        let matchCount = 1;
        for (let columnIndex = boardCellColumnIndex + 1; columnIndex < this.boardSize; columnIndex++) {
            const horizontalBoardCell = this.board.boardRows[boardCellRowIndex].boardCells[columnIndex];
            const horizontalBoardCellValue = horizontalBoardCell.value;
            if (boardCellValue == horizontalBoardCellValue) {
                matchCount++;
                if (matchCount >= this.numberOfConsecutiveMovesToWin) {
                    return true;
                }
            } else {
                break;
            }
        }
        for (let columnIndex = boardCellColumnIndex - 1; columnIndex >= 0; columnIndex--) {
            const horizontalBoardCell = this.board.boardRows[boardCellRowIndex].boardCells[columnIndex];
            const horizontalBoardCellValue = horizontalBoardCell.value;
            if (boardCellValue == horizontalBoardCellValue) {
                matchCount++;
                if (matchCount >= this.numberOfConsecutiveMovesToWin) {
                    return true;
                }
            } else {
                break;
            }
        }

        // Vertical checking
        matchCount = 1;
        for (let rowIndex = boardCellRowIndex + 1; rowIndex < this.boardSize; rowIndex++) {
            const verticalBoardCell = this.board.boardRows[rowIndex].boardCells[boardCellColumnIndex];
            const verticalBoardCellValue = verticalBoardCell.value;
            if (boardCellValue == verticalBoardCellValue) {
                matchCount++;
                if (matchCount >= this.numberOfConsecutiveMovesToWin) {
                    return true;
                }
            } else {
                break;
            }
        }
        for (let rowIndex = boardCellRowIndex - 1; rowIndex >= 0; rowIndex--) {
            const verticalBoardCell = this.board.boardRows[rowIndex].boardCells[boardCellColumnIndex];
            const verticalBoardCellValue = verticalBoardCell.value;
            if (boardCellValue == verticalBoardCellValue) {
                matchCount++;
                if (matchCount >= this.numberOfConsecutiveMovesToWin) {
                    return true;
                }
            } else {
                break;
            }
        }

        // Top-left bottom-right diagonal checking
        matchCount = 1;
        let rowIndex = boardCellRowIndex + 1;
        let columnIndex = boardCellColumnIndex + 1;
        while (rowIndex < this.boardSize && columnIndex < this.boardSize) {
            const diagonalBoardCell = this.board.boardRows[rowIndex].boardCells[columnIndex];
            const diagonalBoardCellValue = diagonalBoardCell.value;
            if (boardCellValue == diagonalBoardCellValue) {
                matchCount++;
                if (matchCount >= this.numberOfConsecutiveMovesToWin) {
                    return true;
                }
            } else {
                break;
            }
            rowIndex++;
            columnIndex++;
        }
        rowIndex = boardCellRowIndex - 1;
        columnIndex = boardCellColumnIndex - 1;
        while (rowIndex >= 0 && columnIndex >= 0) {
            const diagonalBoardCell = this.board.boardRows[rowIndex].boardCells[columnIndex];
            const diagonalBoardCellValue = diagonalBoardCell.value;
            if (boardCellValue == diagonalBoardCellValue) {
                matchCount++;
                if (matchCount >= this.numberOfConsecutiveMovesToWin) {
                    return true;
                }
            } else {
                break;
            }
            rowIndex--;
            columnIndex--;
        }

        // Bottom-left Top-right diagonal checking
        matchCount = 1;
        rowIndex = boardCellRowIndex + 1;
        columnIndex = boardCellColumnIndex - 1;
        while (rowIndex < this.boardSize && columnIndex >= 0) {
            const diagonalBoardCell = this.board.boardRows[rowIndex].boardCells[columnIndex];
            const diagonalBoardCellValue = diagonalBoardCell.value;
            if (boardCellValue == diagonalBoardCellValue) {
                matchCount++;
                if (matchCount >= this.numberOfConsecutiveMovesToWin) {
                    return true;
                }
            } else {
                break;
            }
            rowIndex++;
            columnIndex--;
        }
        rowIndex = boardCellRowIndex - 1;
        columnIndex = boardCellColumnIndex + 1;
        while (rowIndex >= 0 && columnIndex < this.boardSize) {
            const diagonalBoardCell = this.board.boardRows[rowIndex].boardCells[columnIndex];
            const diagonalBoardCellValue = diagonalBoardCell.value;
            if (boardCellValue == diagonalBoardCellValue) {
                matchCount++;
                if (matchCount >= this.numberOfConsecutiveMovesToWin) {
                    return true;
                }
            } else {
                break;
            }
            rowIndex--;
            columnIndex++;
        }

        return false;
    }

    calculateAIMove() {
        const boardCell = this.availableBoardCells[ Math.floor(Math.random() * this.availableBoardCells.length) ];
        this.makeMove(boardCell);
    }

    showGameOverMessage(message) {
        setTimeout(() => {
            const isRestart = confirm(`${message} Do you want to restart the game?`);
            if (isRestart) {
                this.start();
            }
        }, 0);
    }
}

class Board {
    constructor(boardRows) {
        this.boardRows = boardRows;
    }

    init() {
        this.element = createElement("div", "_tttBoard", "_tttBoard");
        for (let rowIndex = 0; rowIndex < this.boardRows.length; rowIndex++) {
            const boardRow = this.boardRows[rowIndex];
            boardRow.init();
            this.element.appendChild(boardRow.element);
        }
    }
}

class BoardRow {
    constructor(rowIndex, boardCells) {
        this.rowIndex = rowIndex;
        this.boardCells = boardCells;
    }

    init() {
        this.element = createElement("div", `_tttBoardRow_${this.rowIndex}`, "_tttBoardRow");
        for (let columnIndex = 0; columnIndex < this.boardCells.length; columnIndex++) {
            const boardCell = this.boardCells[columnIndex];
            boardCell.init();
            this.element.appendChild(boardCell.element);
        }
    }
}

class BoardCell {
    constructor(rowIndex, columnIndex, boardCellOnClick) {
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
        this.boardCellOnClick = boardCellOnClick;
        this.onClick = this.onClick.bind(this);
    }

    init() {
        this.element = createElement("div", `_tttBoardCell_${this.rowIndex}_${this.columnIndex}`, "_tttBoardCell");
        this.element.onclick = this.onClick;
    }

    setValue(value) {
        this.value = value;
        this.element.innerHTML = value;
        if (this.value == PLAYER) {
            this.element.classList.add("player");
        } else {
            this.element.classList.add("ai");
        }
    }

    reset() {
        this.value = null;
        this.element.innerHTML = "";
        this.element.classList.remove("player");
        this.element.classList.remove("ai");
    }

    onClick() {
        this.boardCellOnClick(this);
    }
}

function createElement(tagName, elementId, className) {
    const element = document.createElement(tagName);
    element.id = elementId;
    element.classList.add(className);
    return element;
}