/**
 * AETHER LINK - Professional Arcade Logic Game
 * Mechanics: Connect color nodes, fill every tile, no path crossings.
 * Levels: 1000 levels of increasing difficulty.
 */

const gameViewport = document.getElementById('gameViewport');
const gameGrid = document.getElementById('gameGrid');
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');
const gameScoreEl = document.getElementById('gameScore');
const gameLevelEl = document.getElementById('gameLevel');
const gameHintEl = document.getElementById('gameHint');
const startBtn = document.getElementById('startGameBtn');
const btnMaximize = document.getElementById('btnMaximize');
const gameContainer = document.querySelector('.game-container');

let level = parseInt(localStorage.getItem('aether_game_level') || '1');
let score = parseInt(localStorage.getItem('aether_game_score') || '0');
let size = 4;
let nodes = [];
let paths = {}; // { colorIndex: [ {r, c}, ... ] }
let activeColor = null;
let isDragging = false;
let isPlaying = false;

// Color Palette for Arcade Feel
const COLORS = [
    '#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', 
    '#06b6d4', '#ec4899', '#f97316', '#a855f7', '#22c55e'
];

function initGame() {
    gameLevelEl.textContent = level;
    gameScoreEl.textContent = score;

    startBtn.addEventListener('click', () => {
        if (!isPlaying) startGame();
    });

    btnMaximize.addEventListener('click', () => {
        gameContainer.classList.toggle('game-fullscreen');
        const icon = btnMaximize.querySelector('i');
        if (gameContainer.classList.contains('game-fullscreen')) {
            icon.className = 'ri-fullscreen-exit-line';
            btnMaximize.innerHTML = '<i class="ri-fullscreen-exit-line"></i> KÜÇÜLT';
        } else {
            icon.className = 'ri-fullscreen-line';
            btnMaximize.innerHTML = '<i class="ri-fullscreen-line"></i> BÜYÜT';
        }
        resizeCanvas();
    });

    window.addEventListener('resize', resizeCanvas);
    
    // Interaction
    gameViewport.addEventListener('mousedown', startDrag);
    gameViewport.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', endDrag);

    gameViewport.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        startDrag({ clientX: touch.clientX, clientY: touch.clientY });
    }, { passive: false });

    gameViewport.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        drag({ clientX: touch.clientX, clientY: touch.clientY });
    }, { passive: false });

    gameViewport.addEventListener('touchend', endDrag);
}

function startGame() {
    isPlaying = true;
    size = 4 + Math.floor(level / 100);
    size = Math.min(size, 10);
    
    generateLevel();
    resizeCanvas();
    draw();
}

function generateLevel() {
    gameGrid.innerHTML = '';
    gameGrid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    gameGrid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    // Simple Procedural Generation (In a real pro app, we'd have a level database)
    // For now, let's create random pairs based on level difficulty
    const nodeCount = 3 + Math.floor(level / 200);
    const usedCells = new Set();
    nodes = [];
    paths = {};

    for (let i = 0; i < nodeCount; i++) {
        let p1 = findEmptyCell(usedCells);
        let p2 = findEmptyCell(usedCells);
        if (p1 && p2) {
            nodes.push({ r: p1.r, c: p1.c, colorIdx: i, type: 'start' });
            nodes.push({ r: p2.r, c: p2.c, colorIdx: i, type: 'end' });
            paths[i] = [];
        }
    }

    // Render Grid
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement('div');
            cell.className = 'node-cell';
            cell.dataset.r = r;
            cell.dataset.c = c;

            const node = nodes.find(n => n.r === r && n.c === c);
            if (node) {
                const point = document.createElement('div');
                point.className = 'node-point';
                point.style.color = COLORS[node.colorIdx % COLORS.length];
                point.style.backgroundColor = COLORS[node.colorIdx % COLORS.length];
                cell.appendChild(point);
            }
            gameGrid.appendChild(cell);
        }
    }
    
    gameHintEl.textContent = "Bağlantıları kur ve tüm ızgarayı doldur!";
}

function findEmptyCell(used) {
    let attempts = 0;
    while (attempts < 100) {
        let r = Math.floor(Math.random() * size);
        let c = Math.floor(Math.random() * size);
        let key = `${r},${c}`;
        if (!used.has(key)) {
            used.add(key);
            return { r, c };
        }
        attempts++;
    }
    return null;
}

function resizeCanvas() {
    const rect = gameViewport.getBoundingClientRect();
    gameCanvas.width = rect.width;
    gameCanvas.height = rect.height;
    draw();
}

function startDrag(e) {
    if (!isPlaying) return;
    const pos = getGridPos(e);
    if (!pos) return;

    const node = nodes.find(n => n.r === pos.r && n.c === pos.c);
    if (node) {
        activeColor = node.colorIdx;
        paths[activeColor] = [{ r: pos.r, c: pos.c }];
        isDragging = true;
        draw();
    }
}

function drag(e) {
    if (!isDragging || activeColor === null) return;
    const pos = getGridPos(e);
    if (!pos) return;

    const currentPath = paths[activeColor];
    const last = currentPath[currentPath.length - 1];

    if (pos.r === last.r && pos.c === last.c) return;

    // Check adjacency
    const dist = Math.abs(pos.r - last.r) + Math.abs(pos.c - last.c);
    if (dist === 1) {
        // Can't cross other colors
        const crossed = Object.keys(paths).find(colIdx => {
            if (parseInt(colIdx) === activeColor) return false;
            return paths[colIdx].some(p => p.r === pos.r && p.c === pos.c);
        });

        if (!crossed) {
            // If self cross, truncate path
            const selfIdx = currentPath.findIndex(p => p.r === pos.r && p.c === pos.c);
            if (selfIdx !== -1) {
                paths[activeColor] = currentPath.slice(0, selfIdx + 1);
            } else {
                paths[activeColor].push({ r: pos.r, c: pos.c });
            }
            draw();
            checkWin();
        }
    }
}

function endDrag() {
    isDragging = false;
    activeColor = null;
    draw();
}

function getGridPos(e) {
    const rect = gameViewport.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return null;
    
    const c = Math.floor((x / rect.width) * size);
    const r = Math.floor((y / rect.height) * size);
    return { r, c };
}

function draw() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    const cellW = gameCanvas.width / size;
    const cellH = gameCanvas.height / size;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = cellW * 0.4;

    Object.keys(paths).forEach(colorIdx => {
        const path = paths[colorIdx];
        if (path.length < 1) return;

        ctx.beginPath();
        ctx.strokeStyle = COLORS[colorIdx % COLORS.length];
        ctx.shadowBlur = 15;
        ctx.shadowColor = COLORS[colorIdx % COLORS.length];

        const startX = path[0].c * cellW + cellW / 2;
        const startY = path[0].r * cellH + cellH / 2;
        ctx.moveTo(startX, startY);

        for (let i = 1; i < path.length; i++) {
            const px = path[i].c * cellW + cellW / 2;
            const py = path[i].r * cellH + cellH / 2;
            ctx.lineTo(px, py);
        }
        ctx.stroke();
    });
}

function checkWin() {
    const colorIds = Object.keys(paths);
    const allConnected = colorIds.every(id => {
        const p = paths[id];
        if (p.length < 2) return false;
        const start = p[0];
        const end = p[p.length - 1];
        const n1 = nodes.find(n => n.colorIdx === parseInt(id) && n.type === 'start');
        const n2 = nodes.find(n => n.colorIdx === parseInt(id) && n.type === 'end');
        
        // Path must start at one node and end at the other
        const isStartEnd = (start.r === n1.r && start.c === n1.c && end.r === n2.r && end.c === n2.c) ||
                           (start.r === n2.r && start.c === n2.c && end.r === n1.r && end.c === n1.c);
        return isStartEnd;
    });

    if (allConnected) {
        // Check if full grid is used
        const usedCells = new Set();
        colorIds.forEach(id => paths[id].forEach(p => usedCells.add(`${p.r},${p.c}`)));
        
        if (usedCells.size === size * size) {
            winLevel();
        }
    }
}

function winLevel() {
    isPlaying = false;
    level++;
    score += level * 10;
    localStorage.setItem('aether_game_level', level);
    localStorage.setItem('aether_game_score', score);
    
    gameLevelEl.textContent = level;
    gameScoreEl.textContent = score;
    gameHintEl.textContent = "ENERJİ AĞI TAMAMLANDI! SIRADAKİ...";
    
    if (typeof showConfetti === 'function') showConfetti();
    
    setTimeout(() => {
        startGame();
    }, 1500);
}

if (typeof window !== 'undefined') {
    window.gameEngine = { init: initGame };
}
