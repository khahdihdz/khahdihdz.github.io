// Game State
const game = {
    gold: 100,
    hp: 100,
    level: 1,
    round: 1,
    board: Array(64).fill(null),
    bench: Array(8).fill(null),
    shop: [],
    inBattle: false,
    autoPlay: false
};

// Unit Types
const unitTypes = [
    { icon: '⚔️', name: 'Warrior', hp: 100, atk: 15, cost: 1, range: 1 },
    { icon: '🏹', name: 'Archer', hp: 70, atk: 20, cost: 2, range: 3 },
    { icon: '🛡️', name: 'Tank', hp: 150, atk: 10, cost: 2, range: 1 },
    { icon: '🔮', name: 'Mage', hp: 60, atk: 25, cost: 3, range: 4 },
    { icon: '🗡️', name: 'Assassin', hp: 80, atk: 30, cost: 3, range: 1 },
    { icon: '⚡', name: 'Lightning', hp: 90, atk: 35, cost: 4, range: 3 },
    { icon: '🐉', name: 'Dragon', hp: 200, atk: 40, cost: 5, range: 2 }
];

// Initialize
function init() {
    createBoard();
    createBench();
    refreshShop();
    updateUI();
    setupEventListeners();
}

function createBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    
    for (let i = 0; i < 64; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        
        const row = Math.floor(i / 8);
        if (row >= 4) {
            cell.classList.add('player-zone');
        } else {
            cell.classList.add('ai-zone');
        }
        
        cell.addEventListener('click', () => handleCellClick(i));
        board.appendChild(cell);
    }
}

function createBench() {
    const bench = document.getElementById('bench');
    bench.innerHTML = '';
    
    for (let i = 0; i < 8; i++) {
        const slot = document.createElement('div');
        slot.className = 'bench-slot';
        slot.dataset.index = i;
        slot.addEventListener('click', () => handleBenchClick(i));
        bench.appendChild(slot);
    }
}

function refreshShop() {
    game.shop = [];
    const shopCount = Math.min(5, game.level + 2);
    
    for (let i = 0; i < shopCount; i++) {
        const maxCost = Math.min(game.level + 1, 5);
        const availableUnits = unitTypes.filter(u => u.cost <= maxCost);
        const unit = {...availableUnits[Math.floor(Math.random() * availableUnits.length)]};
        unit.currentHp = unit.hp;
        unit.stars = 1;
        unit.id = Date.now() + Math.random();
        game.shop.push(unit);
    }
    
    renderShop();
}

function renderShop() {
    const shop = document.getElementById('shop');
    shop.innerHTML = '';
    
    game.shop.forEach((unit, idx) => {
        if (!unit) return;
        
        const item = document.createElement('div');
        item.className = 'shop-item';
        if (unit.sold) item.classList.add('sold');
        
        item.innerHTML = `
            <div class="unit-icon">${unit.icon}</div>
            <div class="unit-cost">${unit.cost} 💰</div>
        `;
        
        item.addEventListener('click', () => buyUnit(idx));
        shop.appendChild(item);
    });
}

function buyUnit(idx) {
    const unit = game.shop[idx];
    if (!unit || unit.sold || game.gold < unit.cost) return;
    
    const emptySlot = game.bench.findIndex(slot => slot === null);
    if (emptySlot === -1) {
        addLog('Ghế dự bị đã đầy!', 'player');
        return;
    }
    
    game.gold -= unit.cost;
    game.bench[emptySlot] = {...unit};
    game.shop[idx].sold = true;
    
    renderBench();
    renderShop();
    updateUI();
    addLog(`Mua ${unit.name} (${unit.cost} 💰)`, 'player');
}

function renderBench() {
    const benchSlots = document.querySelectorAll('.bench-slot');
    
    benchSlots.forEach((slot, idx) => {
        const unit = game.bench[idx];
        if (unit) {
            slot.innerHTML = `
                <div class="unit">${unit.icon}</div>
                ${unit.stars > 1 ? `<div class="star">${'⭐'.repeat(unit.stars)}</div>` : ''}
            `;
        } else {
            slot.innerHTML = '';
        }
    });
}

let selectedBenchUnit = null;

function handleBenchClick(idx) {
    if (game.inBattle) return;
    
    if (selectedBenchUnit === idx) {
        selectedBenchUnit = null;
        document.querySelectorAll('.bench-slot').forEach(s => s.style.border = '2px dashed #7f8c8d');
    } else {
        selectedBenchUnit = idx;
        document.querySelectorAll('.bench-slot').forEach(s => s.style.border = '2px dashed #7f8c8d');
        document.querySelectorAll('.bench-slot')[idx].style.border = '2px solid #2ecc71';
    }
}

function handleCellClick(idx) {
    if (game.inBattle) return;
    
    const row = Math.floor(idx / 8);
    if (row < 4) return; // Can't place in AI zone
    
    if (selectedBenchUnit !== null) {
        if (game.board[idx] === null) {
            game.board[idx] = game.bench[selectedBenchUnit];
            game.bench[selectedBenchUnit] = null;
            selectedBenchUnit = null;
            renderBoard();
            renderBench();
            document.querySelectorAll('.bench-slot').forEach(s => s.style.border = '2px dashed #7f8c8d');
        }
    } else if (game.board[idx]) {
        const emptySlot = game.bench.findIndex(slot => slot === null);
        if (emptySlot !== -1) {
            game.bench[emptySlot] = game.board[idx];
            game.board[idx] = null;
            renderBoard();
            renderBench();
        }
    }
}

function renderBoard() {
    const cells = document.querySelectorAll('.cell');
    
    cells.forEach((cell, idx) => {
        const unit = game.board[idx];
        if (unit) {
            const hpPercent = (unit.currentHp / unit.hp) * 100;
            const isPlayer = Math.floor(idx / 8) >= 4;
            
            cell.innerHTML = `
                <div class="unit">${unit.icon}</div>
                ${unit.stars > 1 ? `<div class="star">${'⭐'.repeat(unit.stars)}</div>` : ''}
                <div class="hp-bar">
                    <div class="hp-fill ${isPlayer ? 'player' : ''}" style="width: ${hpPercent}%"></div>
                </div>
            `;
        } else {
            cell.innerHTML = '';
        }
    });
}

function setupEventListeners() {
    document.getElementById('refreshBtn').addEventListener('click', () => {
        if (game.gold >= 2) {
            game.gold -= 2;
            refreshShop();
            updateUI();
            addLog('Làm mới cửa hàng', 'player');
        }
    });
    
    document.getElementById('levelUpBtn').addEventListener('click', () => {
        if (game.gold >= 4) {
            game.gold -= 4;
            game.level++;
            updateUI();
            addLog(`Nâng cấp lên level ${game.level}!`, 'player');
        }
    });
    
    document.getElementById('startBattle').addEventListener('click', startBattle);
    
    document.getElementById('autoPlay').addEventListener('click', () => {
        game.autoPlay = !game.autoPlay;
        const btn = document.getElementById('autoPlay');
        btn.textContent = game.autoPlay ? '⏸️ DỪNG AUTO' : '🤖 AUTO PLAY';
        btn.className = game.autoPlay ? 'btn btn-warning btn-lg' : 'btn btn-secondary btn-lg';
        
        if (game.autoPlay) {
            autoPlayLoop();
        }
    });
}

function autoPlayLoop() {
    if (!game.autoPlay) return;
    
    setTimeout(() => {
        if (!game.inBattle) {
            aiPlaceUnits();
            startBattle();
        }
    }, 1000);
}

function aiPlaceUnits() {
    game.board.fill(null, 0, 32);
    
    const aiUnitCount = Math.min(game.level + 2, 8);
    const positions = [];
    
    for (let i = 0; i < 32; i++) {
        positions.push(i);
    }
    
    for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    for (let i = 0; i < aiUnitCount; i++) {
        const unitType = {...unitTypes[Math.floor(Math.random() * Math.min(unitTypes.length, game.round))]};
        unitType.currentHp = unitType.hp;
        unitType.stars = Math.min(Math.floor(game.round / 3) + 1, 3);
        unitType.hp *= unitType.stars;
        unitType.currentHp = unitType.hp;
        unitType.atk *= unitType.stars;
        unitType.id = Date.now() + Math.random();
        
        game.board[positions[i]] = unitType;
    }
    
    renderBoard();
}

async function startBattle() {
    if (game.inBattle) return;
    
    const playerUnits = game.board.filter((u, i) => u && Math.floor(i / 8) >= 4).length;
    if (playerUnits === 0) {
        addLog('Không có quân để chiến đấu!', 'player');
        return;
    }
    
    if (game.board.filter((u, i) => u && Math.floor(i / 8) < 4).length === 0) {
        aiPlaceUnits();
    }
    
    game.inBattle = true;
    document.getElementById('startBattle').disabled = true;
    addLog(`=== Round ${game.round} bắt đầu! ===`, 'win');
    
    let turn = 0;
    const maxTurns = 50;
    
    while (turn < maxTurns) {
        const playerUnits = game.board.filter((u, i) => u && u.currentHp > 0 && Math.floor(i / 8) >= 4).length;
        const aiUnits = game.board.filter((u, i) => u && u.currentHp > 0 && Math.floor(i / 8) < 4).length;
        
        if (playerUnits === 0 || aiUnits === 0) break;
        
        await battleTurn();
        turn++;
        await sleep(300);
    }
    
    endBattle();
}

async function battleTurn() {
    for (let i = 0; i < 64; i++) {
        const unit = game.board[i];
        if (!unit || unit.currentHp <= 0) continue;
        
        const isPlayer = Math.floor(i / 8) >= 4;
        const target = findTarget(i, isPlayer);
        
        if (target !== null) {
            await attackTarget(i, target);
        }
    }
}

function findTarget(pos, isPlayer) {
    const unit = game.board[pos];
    const row = Math.floor(pos / 8);
    const col = pos % 8;
    
    let closestDist = Infinity;
    let closestTarget = null;
    
    for (let i = 0; i < 64; i++) {
        const targetUnit = game.board[i];
        if (!targetUnit || targetUnit.currentHp <= 0) continue;
        
        const targetRow = Math.floor(i / 8);
        const targetIsPlayer = targetRow >= 4;
        
        if (targetIsPlayer === isPlayer) continue;
        
        const targetCol = i % 8;
        const dist = Math.abs(row - targetRow) + Math.abs(col - targetCol);
        
        if (dist <= unit.range && dist < closestDist) {
            closestDist = dist;
            closestTarget = i;
        }
    }
    
    return closestTarget;
}

async function attackTarget(attacker, target) {
    const unit = game.board[attacker];
    const targetUnit = game.board[target];
    
    if (!unit || !targetUnit || targetUnit.currentHp <= 0) return;
    
    const cells = document.querySelectorAll('.cell');
    cells[attacker].querySelector('.unit')?.classList.add('attacking');
    
    await sleep(200);
    
    const damage = unit.atk;
    targetUnit.currentHp = Math.max(0, targetUnit.currentHp - damage);
    
    renderBoard();
    
    cells[attacker].querySelector('.unit')?.classList.remove('attacking');
    
    if (targetUnit.currentHp <= 0) {
        const isPlayer = Math.floor(target / 8) >= 4;
        addLog(`${unit.name} đánh bại ${targetUnit.name}!`, isPlayer ? 'ai' : 'player');
    }
}

function endBattle() {
    game.inBattle = false;
    document.getElementById('startBattle').disabled = false;
    
    const playerUnits = game.board.filter((u, i) => u && u.currentHp > 0 && Math.floor(i / 8) >= 4).length;
    const aiUnits = game.board.filter((u, i) => u && u.currentHp > 0 && Math.floor(i / 8) < 4).length;
    
    if (playerUnits > aiUnits) {
        game.gold += 10 + game.round;
        addLog(`🎉 Thắng! +${10 + game.round} 💰`, 'win');
    } else if (aiUnits > playerUnits) {
        const damage = 5 + Math.floor(game.round / 2);
        game.hp = Math.max(0, game.hp - damage);
        addLog(`💀 Thua! -${damage} HP`, 'lose');
        
        if (game.hp <= 0) {
            addLog('=== GAME OVER ===', 'lose');
            game.autoPlay = false;
            return;
        }
    } else {
        game.gold += 5;
        addLog(`🤝 Hòa! +5 💰`, 'player');
    }
    
    game.round++;
    game.gold += 5;
    refreshShop();
    updateUI();
    
    if (game.autoPlay && game.hp > 0) {
        autoPlayLoop();
    }
}

function updateUI() {
    document.getElementById('gold').textContent = game.gold;
    document.getElementById('hp').textContent = game.hp;
    document.getElementById('level').textContent = game.level;
    document.getElementById('round').textContent = game.round;
}

function addLog(msg, type = '') {
    const log = document.getElementById('log');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    log.insertBefore(entry, log.firstChild);
    
    if (log.children.length > 50) {
        log.removeChild(log.lastChild);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Start game
init();