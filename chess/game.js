// Game Constants
const COLORS = ['green', 'yellow', 'blue', 'red'];
const COLOR_MAP = {
    green: '#28a745',
    yellow: '#ffc107',
    blue: '#007bff',
    red: '#dc3545'
};

const PLAYER_NAMES = {
    green: 'Xanh lá',
    yellow: 'Vàng',
    blue: 'Xanh dương',
    red: 'Đỏ'
};

// Game State
let gameState = {
    currentPlayer: 0,
    diceValue: 0,
    canRoll: true,
    selectedPiece: null,
    players: [],
    winner: null
};

// Canvas Setup
const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');

// Path coordinates (simplified Ludo board)
const PATH = [];
const HOME_POSITIONS = {
    green: [{x: 60, y: 60}, {x: 140, y: 60}, {x: 60, y: 140}, {x: 140, y: 140}],
    yellow: [{x: 460, y: 60}, {x: 540, y: 60}, {x: 460, y: 140}, {x: 540, y: 140}],
    blue: [{x: 60, y: 460}, {x: 140, y: 460}, {x: 60, y: 540}, {x: 140, y: 540}],
    red: [{x: 460, y: 460}, {x: 540, y: 460}, {x: 460, y: 540}, {x: 540, y: 540}]
};

// Initialize path coordinates
function initPath() {
    const center = 300;
    const cellSize = 40;
    
    // Green starting path (left side, going down)
    for (let i = 0; i < 5; i++) {
        PATH.push({x: 40, y: center + i * cellSize});
    }
    // Bottom left corner
    for (let i = 0; i < 6; i++) {
        PATH.push({x: 40 + i * cellSize, y: center + 5 * cellSize});
    }
    // Yellow path (bottom, going right)
    for (let i = 0; i < 5; i++) {
        PATH.push({x: center + i * cellSize, y: center + 5 * cellSize});
    }
    // Bottom right corner
    for (let i = 0; i < 6; i++) {
        PATH.push({x: center + 5 * cellSize, y: center + 5 * cellSize - i * cellSize});
    }
    // Blue path (right side, going up)
    for (let i = 0; i < 5; i++) {
        PATH.push({x: center + 5 * cellSize, y: center - i * cellSize});
    }
    // Top right corner
    for (let i = 0; i < 6; i++) {
        PATH.push({x: center + 5 * cellSize - i * cellSize, y: 40});
    }
    // Red path (top, going left)
    for (let i = 0; i < 5; i++) {
        PATH.push({x: center - i * cellSize, y: 40});
    }
    // Top left corner
    for (let i = 0; i < 6; i++) {
        PATH.push({x: 40, y: 40 + i * cellSize});
    }
}

// Initialize players
function initPlayers() {
    gameState.players = COLORS.map((color, index) => ({
        color: color,
        isAI: index !== 0,
        pieces: [
            {id: 0, position: -1, isHome: true, isSafe: false},
            {id: 1, position: -1, isHome: true, isSafe: false},
            {id: 2, position: -1, isHome: true, isSafe: false},
            {id: 3, position: -1, isHome: true, isSafe: false}
        ],
        startIndex: index * (PATH.length / 4),
        finishedPieces: 0
    }));
}

// Draw board
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw home areas
    drawHomeArea('green', 20, 20, 180, 180);
    drawHomeArea('yellow', 400, 20, 180, 180);
    drawHomeArea('blue', 20, 400, 180, 180);
    drawHomeArea('red', 400, 400, 180, 180);
    
    // Draw path
    PATH.forEach((pos, index) => {
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    });
    
    // Draw center (finish area)
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.moveTo(300, 250);
    ctx.lineTo(350, 300);
    ctx.lineTo(300, 350);
    ctx.lineTo(250, 300);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw pieces
    gameState.players.forEach(player => {
        player.pieces.forEach((piece, index) => {
            if (piece.isHome) {
                const homePos = HOME_POSITIONS[player.color][index];
                drawPiece(homePos.x, homePos.y, player.color, piece.id);
            } else if (piece.position >= 0 && piece.position < PATH.length) {
                const pathIndex = (player.startIndex + piece.position) % PATH.length;
                const pos = PATH[pathIndex];
                drawPiece(pos.x, pos.y, player.color, piece.id);
            }
        });
    });
}

function drawHomeArea(color, x, y, width, height) {
    ctx.fillStyle = COLOR_MAP[color] + '40';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = COLOR_MAP[color];
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, width, height);
}

function drawPiece(x, y, color, id) {
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.arc(x + 2, y + 2, 18, 0, Math.PI * 2);
    ctx.fill();
    
    // Piece
    ctx.fillStyle = COLOR_MAP[color];
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
    
    // Border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Inner circle
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
}

// Dice roll
function rollDice() {
    if (!gameState.canRoll) return;
    
    gameState.canRoll = false;
    const diceElement = document.getElementById('dice');
    const diceFace = diceElement.querySelector('.dice-face');
    const rollBtn = document.getElementById('rollBtn');
    
    rollBtn.disabled = true;
    diceElement.classList.add('rolling');
    
    // Animate dice
    let count = 0;
    const interval = setInterval(() => {
        diceFace.textContent = Math.floor(Math.random() * 6) + 1;
        count++;
        
        if (count > 10) {
            clearInterval(interval);
            gameState.diceValue = Math.floor(Math.random() * 6) + 1;
            diceFace.textContent = gameState.diceValue;
            diceElement.classList.remove('rolling');
            
            handleDiceRoll();
        }
    }, 100);
}

function handleDiceRoll() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    // Check if player can move
    const movablePieces = getMovablePieces(currentPlayer);
    
    if (movablePieces.length === 0) {
        // No valid moves
        setTimeout(() => {
            if (gameState.diceValue !== 6) {
                nextPlayer();
            } else {
                gameState.canRoll = true;
                document.getElementById('rollBtn').disabled = false;
            }
        }, 1000);
        return;
    }
    
    // If AI, make move automatically
    if (currentPlayer.isAI) {
        setTimeout(() => {
            const piece = movablePieces[Math.floor(Math.random() * movablePieces.length)];
            movePiece(currentPlayer, piece);
        }, 1500);
    } else {
        // Player can select a piece
        gameState.selectedPiece = null;
    }
}

function getMovablePieces(player) {
    return player.pieces.filter(piece => {
        if (gameState.diceValue === 6 && piece.isHome) return true;
        if (!piece.isHome && piece.position >= 0 && piece.position + gameState.diceValue <= PATH.length) {
            return true;
        }
        return false;
    });
}

function movePiece(player, piece) {
    if (piece.isHome && gameState.diceValue === 6) {
        piece.isHome = false;
        piece.position = 0;
    } else {
        piece.position += gameState.diceValue;
    }
    
    // Check if reached finish
    if (piece.position >= PATH.length) {
        piece.position = PATH.length;
        player.finishedPieces++;
        updateProgress();
        
        if (player.finishedPieces === 4) {
            gameState.winner = player.color;
            showWinner();
            return;
        }
    }
    
    drawBoard();
    
    // Extra turn on 6
    if (gameState.diceValue === 6) {
        setTimeout(() => {
            gameState.canRoll = true;
            if (!player.isAI) {
                document.getElementById('rollBtn').disabled = false;
            } else {
                setTimeout(rollDice, 1000);
            }
        }, 500);
    } else {
        setTimeout(nextPlayer, 1000);
    }
}

function nextPlayer() {
    gameState.currentPlayer = (gameState.currentPlayer + 1) % 4;
    gameState.canRoll = true;
    
    updateTurnInfo();
    
    const currentPlayer = gameState.players[gameState.currentPlayer];
    if (currentPlayer.isAI) {
        setTimeout(rollDice, 1000);
    } else {
        document.getElementById('rollBtn').disabled = false;
    }
}

function updateTurnInfo() {
    const player = gameState.players[gameState.currentPlayer];
    document.getElementById('currentTurn').textContent = PLAYER_NAMES[player.color];
    document.getElementById('turnInfo').style.borderColor = COLOR_MAP[player.color];
}

function updateProgress() {
    gameState.players.forEach(player => {
        const progress = (player.finishedPieces / 4) * 100;
        document.getElementById(player.color + 'Progress').style.width = progress + '%';
    });
}

function showWinner() {
    const winnerName = PLAYER_NAMES[gameState.winner];
    const statusElement = document.getElementById('gameStatus');
    statusElement.textContent = `🎉 ${winnerName} đã thắng! 🎉`;
    statusElement.style.display = 'block';
    document.getElementById('rollBtn').disabled = true;
}

// Canvas click handler
canvas.addEventListener('click', (e) => {
    if (gameState.canRoll || gameState.winner) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const currentPlayer = gameState.players[gameState.currentPlayer];
    if (currentPlayer.isAI) return;
    
    const movablePieces = getMovablePieces(currentPlayer);
    
    // Check if clicked on a movable piece
    currentPlayer.pieces.forEach((piece, index) => {
        if (!movablePieces.includes(piece)) return;
        
        let px, py;
        if (piece.isHome) {
            const homePos = HOME_POSITIONS[currentPlayer.color][index];
            px = homePos.x;
            py = homePos.y;
        } else {
            const pathIndex = (currentPlayer.startIndex + piece.position) % PATH.length;
            const pos = PATH[pathIndex];
            px = pos.x;
            py = pos.y;
        }
        
        const distance = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
        if (distance < 20) {
            movePiece(currentPlayer, piece);
        }
    });
});

// Event listeners
document.getElementById('rollBtn').addEventListener('click', rollDice);
document.getElementById('resetBtn').addEventListener('click', () => {
    initGame();
});

// Initialize game
function initGame() {
    initPath();
    initPlayers();
    gameState.currentPlayer = 0;
    gameState.canRoll = true;
    gameState.winner = null;
    gameState.diceValue = 0;
    
    document.getElementById('dice').querySelector('.dice-face').textContent = '?';
    document.getElementById('rollBtn').disabled = false;
    document.getElementById('gameStatus').style.display = 'none';
    
    updateTurnInfo();
    updateProgress();
    drawBoard();
}

// Start game
initGame();