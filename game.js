/**
 * SAYI LABİRENTİ - 1000 Level Creative Logic Game
 * Mekanik: Tüm beyaz kareleri tek bir seferde gezerek yeşil hedefe ulaş.
 */

const gameGrid = document.getElementById('gameGrid');
const gameScoreEl = document.getElementById('gameScore');
const gameLevelEl = document.getElementById('gameLevel');
const gameHighEl = document.getElementById('gameHigh');
const gameHintEl = document.getElementById('gameHint');
const startBtn = document.getElementById('startGameBtn');

let level = parseInt(localStorage.getItem('maze_game_level') || '1');
let highScore = parseInt(localStorage.getItem('maze_game_high') || '0');
let score = 0;
let grid = [];
let path = [];
let currentPos = null;
let goalPos = null;
let isPlaying = false;

function initGame() {
    gameLevelEl.textContent = level;
    gameHighEl.textContent = highScore;
    
    startBtn.addEventListener('click', () => {
        startGame();
    });
}

function startGame() {
    isPlaying = true;
    score = (level - 1) * 100;
    updateHUD();
    generateMaze();
}

function updateHUD() {
    gameScoreEl.textContent = score;
    gameLevelEl.textContent = level;
    gameHighEl.textContent = highScore;
}

function generateMaze() {
    gameGrid.innerHTML = '';
    path = [];
    
    // Grid size grows every 50 levels (min 3x3, max 7x7)
    let size = 3 + Math.floor(level / 50);
    size = Math.min(size, 7);
    
    gameGrid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    
    const totalTiles = size * size;
    const wallCount = Math.floor(totalTiles * 0.15); // 15% walls
    
    grid = [];
    for (let i = 0; i < totalTiles; i++) {
        grid.push({ type: 'empty', visited: false });
    }
    
    // Add walls randomly (avoiding start and end roughly)
    for (let i = 0; i < wallCount; i++) {
        let r = Math.floor(Math.random() * totalTiles);
        if (r !== 0 && r !== totalTiles - 1) {
            grid[r].type = 'wall';
        }
    }
    
    // Set Start and Goal
    currentPos = 0;
    goalPos = totalTiles - 1;
    grid[currentPos].type = 'start';
    grid[goalPos].type = 'goal';
    
    renderGrid(size);
}

function renderGrid(size) {
    gameGrid.innerHTML = '';
    grid.forEach((tile, i) => {
        const div = document.createElement('div');
        div.className = 'tile';
        if (tile.type === 'wall') div.classList.add('wall');
        if (tile.type === 'goal') {
            div.classList.add('goal');
            div.textContent = 'BİTİŞ';
        }
        if (i === currentPos) {
            div.classList.add('current');
            div.classList.add('visited');
        }
        
        div.addEventListener('click', () => handleMove(i, size));
        gameGrid.appendChild(div);
    });
}

function handleMove(idx, size) {
    if (!isPlaying) return;
    
    // Logic: Must be adjacent to currentPos and not a wall
    const row = Math.floor(idx / size);
    const col = idx % size;
    const curRow = Math.floor(currentPos / size);
    const curCol = currentPos % size;
    
    const isAdjacent = (Math.abs(row - curRow) + Math.abs(col - curCol)) === 1;
    
    if (isAdjacent && grid[idx].type !== 'wall' && !grid[idx].visited) {
        currentPos = idx;
        grid[idx].visited = true;
        renderGrid(size);
        checkWin(size);
    } else if (grid[idx].visited) {
        // Simple backtrack logic or reset? Let's reset level on wrong move for challenge
        gameHintEl.textContent = "Buraya zaten uğradın! Baştan başla.";
        startGame();
    }
}

function checkWin(size) {
    if (currentPos === goalPos) {
        // Check if all non-wall tiles are visited
        const targetCount = grid.filter(t => t.type !== 'wall').length;
        const visitedCount = grid.filter(t => t.visited).length;
        
        if (visitedCount === targetCount) {
            level++;
            score += 100;
            if (score > highScore) highScore = score;
            localStorage.setItem('maze_game_level', level);
            localStorage.setItem('maze_game_high', highScore);
            gameHintEl.textContent = "Tebrikler! Seviye Atladın.";
            if (typeof showConfetti === 'function') showConfetti();
            setTimeout(startGame, 1000);
        } else {
            gameHintEl.textContent = "Hala boş kareler var! Her yeri gezmelisin.";
            startGame(); // Hardcore: reset if they reached goal without filling
        }
    }
}

// Global initialization
if (typeof window !== 'undefined') {
    window.gameEngine = { init: initGame };
}
