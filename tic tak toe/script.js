const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = {
    3: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ],
    4: [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
        [0, 4, 8, 12],
        [1, 5, 9, 13],
        [2, 6, 10, 14],
        [3, 7, 11, 15],
        [0, 5, 10, 15],
        [3, 6, 9, 12]
    ],
    5: [
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20]
    ]
};

const boardContainer = document.getElementById('boardContainer');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const restartButton = document.getElementById('restartButton');
const startButton = document.getElementById('startButton');
const backButton = document.getElementById('backButton');
const gridSizeSelector = document.getElementById('gridSize');
const difficultySelector = document.getElementById('difficulty');
const modeSelector = document.getElementById('mode');
let circleTurn;
let gridSize;
let mode;
let difficulty;
let currentClass;

startButton.addEventListener('click', startGame);
backButton.addEventListener('click', backToSettings);
restartButton.addEventListener('click', startGame);

function startGame() {
    gridSize = parseInt(gridSizeSelector.value);
    difficulty = difficultySelector.value;
    mode = modeSelector.value;

    circleTurn = false;
    currentClass = circleTurn ? O_CLASS : X_CLASS;
    document.getElementById('settings').classList.add('hidden');
    boardContainer.classList.remove('hidden');
    backButton.classList.remove('hidden');
    initializeBoard();
    setBoardHoverClass();
    winningMessageElement.classList.remove('show');
}

function initializeBoard() {
    boardContainer.innerHTML = '';
    boardContainer.className = 'board';
    boardContainer.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
    boardContainer.style.gridTemplateRows = `repeat(${gridSize}, 100px)`;

    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.cell = '';
        boardContainer.appendChild(cell);
        cell.addEventListener('click', handleClick, { once: true });
    }
}

function handleClick(e) {
    const cell = e.target;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        if (mode === 'computer' && !circleTurn) {
            computerMove();
        }
        setBoardHoverClass();
    }
}

function placeMark(cell, currentClass) {
    cell.textContent = currentClass === X_CLASS ? 'X' : 'O';
    cell.classList.add(currentClass);
}

function swapTurns() {
    circleTurn = !circleTurn;
    currentClass = circleTurn ? O_CLASS : X_CLASS;
}

function setBoardHoverClass() {
    boardContainer.classList.remove(X_CLASS);
    boardContainer.classList.remove(O_CLASS);
    if (circleTurn) {
        boardContainer.classList.add(O_CLASS);
    } else {
        boardContainer.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    const cells = Array.from(document.querySelectorAll('.cell'));
    const winningCombination = WINNING_COMBINATIONS[gridSize];
    return winningCombination.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

function isDraw() {
    const cells = Array.from(document.querySelectorAll('.cell'));
    return cells.every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'Draw!';
    } else {
        winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;
    }
    winningMessageElement.classList.add('show');
}

function backToSettings() {
    document.getElementById('settings').classList.remove('hidden');
    boardContainer.classList.add('hidden');
    backButton.classList.add('hidden');
    winningMessageElement.classList.remove('show');
}

function computerMove() {
    const cells = Array.from(document.querySelectorAll('.cell'));
    const emptyCells = cells.filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS));

    let move;
    if (difficulty === 'easy') {
        move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } else if (difficulty === 'medium') {
        move = mediumDifficultyMove(emptyCells, cells);
    } else {
        move = hardDifficultyMove(emptyCells, cells);
    }

    if (move) {
        placeMark(move, currentClass);
        if (checkWin(currentClass)) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            swapTurns();
            setBoardHoverClass();
        }
    }
}

function mediumDifficultyMove(emptyCells, cells) {
    // Implement medium difficulty move logic
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function hardDifficultyMove(emptyCells, cells) {
    // Implement hard difficulty move logic
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}
