const board = document.querySelector('.board');
const cells = document.getElementsByClassName('cell');
const restartButton = document.getElementById('restartButton');
const winningMessage = document.getElementById('winningMessage');
const doraemon = document.querySelector('.doraemon img');
const pikachu = document.querySelector('.pikachu img');

const boardArray = ['E','E','E','E','E','E','E','E','E'];
const pointsTable = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

// Add touch support detection
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints;

// Prevent default touch behavior to avoid delays
if (isTouchDevice) {
    document.addEventListener('touchstart', function() {}, { passive: true });
    document.addEventListener('touchmove', function(e) {
        if (e.target.classList.contains('cell')) {
            e.preventDefault();
        }
    }, { passive: false });
}

function checkWinner() {
    for (let[index1, index2, index3] of pointsTable) {
        if (boardArray[index1] !== 'E' && 
            boardArray[index1] === boardArray[index2] &&
            boardArray[index1] === boardArray[index3]) {
                return true;
        }
    }
    return false;
}

let turnNo = 0;
let turn = 'O';

function handleMove(event) {
    // For touch events, ensure we get the correct target
    const target = event.type === 'touchend' ? 
                 document.elementFromPoint(
                     event.changedTouches[0].clientX,
                     event.changedTouches[0].clientY
                 ) : event.target;
    
    // Make sure we're clicking on a cell
    if (!target.classList.contains('cell')) return;

    const element = target;
    
    if (boardArray[element.id] === 'E') {
        if (turn === 'O') {
            element.innerHTML = 'O';
            boardArray[element.id] = 'O';
            doraemon.classList.add('active-player');
            pikachu.classList.remove('active-player');
            
            if (checkWinner()) {
                winningMessage.textContent = `DORAEMON WINS! 🎉`; 
                removeEventListeners();
                return;
            };
            turn = 'X';
        } else { 
            element.innerHTML = 'X';
            boardArray[element.id] = 'X';
            pikachu.classList.add('active-player');
            doraemon.classList.remove('active-player');
            
            if (checkWinner()) {
                winningMessage.textContent = `PIKACHU WINS! 🎉`;
                removeEventListeners();
                return;
            };
            turn = 'O';
        }
        
        ++turnNo;
        if (turnNo === 9) {
            winningMessage.textContent = `Match is DRAWN`;
            removeEventListeners();
            doraemon.classList.remove('active-player');
        }
    }
}

function removeEventListeners() {
    board.removeEventListener('click', handleMove);
    board.removeEventListener('touchend', handleMove);
}

function addEventListeners() {
    board.addEventListener('click', handleMove);
    if (isTouchDevice) {
        board.addEventListener('touchend', handleMove, { passive: true });
    }
}

// Initialize the game
function initGame() {
    boardArray.fill('E');
    turn = 'O';
    turnNo = 0;
    Array.from(cells).forEach((cell) => {
        cell.innerText = '';
    });
    doraemon.classList.remove('active-player');
    pikachu.classList.remove('active-player');
    winningMessage.innerText = `Who's the BOSS`;
    addEventListeners();
}

// Add event listeners
addEventListeners();

// Restart game
restartButton.addEventListener('click', initGame);

// Handle orientation changes for mobile devices
window.addEventListener('orientationchange', function() {
    // Small timeout to allow the orientation to change
    setTimeout(initGame, 100);
});