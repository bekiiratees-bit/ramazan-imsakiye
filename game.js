/**
 * ZEKA KARELERİ - 1000 Level logic game for Ezan Vakti Pro
 */

const gameGrid = document.getElementById('gameGrid');
const gameScoreEl = document.getElementById('gameScore');
const gameLevelEl = document.getElementById('gameLevel');
const gameHighEl = document.getElementById('gameHigh');
const gameHintEl = document.getElementById('gameHint');
const startBtn = document.getElementById('startGameBtn');

let level = parseInt(localStorage.getItem('zeka_game_level') || '1');
let highScore = parseInt(localStorage.getItem('zeka_game_high') || '0');
let score = 0;
let sequence = [];
let userSequence = [];
let isPlaying = false;
let canClick = false;

function initGame() {
    gameLevelEl.textContent = level;
    gameHighEl.textContent = highScore;
    
    startBtn.addEventListener('click', () => {
        if (!isPlaying) startGame();
    });
}

function startGame() {
    isPlaying = true;
    score = 0;
    updateHUD();
    nextLevel();
}

function updateHUD() {
    gameScoreEl.textContent = score;
    gameLevelEl.textContent = level;
    gameHighEl.textContent = highScore;
}

function nextLevel() {
    userSequence = [];
    canClick = false;
    
    // Calculate difficulty
    // Level 1-20: 2x2, sequence 2-4
    // Level 21-100: 3x3, sequence 4-6
    // Level 101-300: 4x4, sequence 6-8
    // Level 301-1000: 5x5+, sequence 8+
    
    let gridDim = 2;
    if (level > 300) gridDim = 5;
    else if (level > 100) gridDim = 4;
    else if (level > 20) gridDim = 3;
    
    renderGrid(gridDim);
    
    // Generate sequence
    sequence = [];
    const sequenceLength = 2 + Math.floor(level / 10) + Math.min(level, 5); 
    const tileCount = gridDim * gridDim;
    
    for (let i = 0; i < sequenceLength; i++) {
        sequence.push(Math.floor(Math.random() * tileCount));
    }
    
    gameHintEl.textContent = "Dikkatle izle...";
    playSequence();
}

function renderGrid(dim) {
    gameGrid.style.gridTemplateColumns = `repeat(${dim}, 1fr)`;
    gameGrid.innerHTML = '';
    for (let i = 0; i < dim * dim; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.dataset.idx = i;
        tile.addEventListener('touchstart', onTileClick);
        tile.addEventListener('click', onTileClick);
        gameGrid.appendChild(tile);
    }
}

async function playSequence() {
    const tiles = gameGrid.querySelectorAll('.tile');
    const delay = Math.max(200, 600 - (level * 2)); // Gets faster
    
    for (const idx of sequence) {
        await new Promise(r => setTimeout(r, delay));
        const tile = tiles[idx];
        if (tile) {
            tile.classList.add('active');
            setTimeout(() => tile.classList.remove('active'), delay / 2);
        }
        await new Promise(r => setTimeout(r, delay / 2));
    }
    
    canClick = true;
    gameHintEl.textContent = "Şimdi senin sıran!";
}

function onTileClick(e) {
    e.preventDefault();
    if (!canClick) return;
    
    const idx = parseInt(e.currentTarget.dataset.idx);
    const expected = sequence[userSequence.length];
    
    const tile = e.currentTarget;
    tile.classList.add('active');
    setTimeout(() => tile.classList.remove('active'), 200);
    
    if (idx === expected) {
        userSequence.push(idx);
        if (userSequence.length === sequence.length) {
            // Level Complete
            score += level * 10;
            level++;
            if (score > highScore) highScore = score;
            localStorage.setItem('zeka_game_level', level);
            localStorage.setItem('zeka_game_high', highScore);
            
            canClick = false;
            gameHintEl.textContent = "Harika! Bir sonraki seviye...";
            setTimeout(nextLevel, 1000);
        }
    } else {
        // Game Over
        tile.classList.add('wrong');
        gameGrid.classList.add('shake');
        gameHintEl.textContent = "Yanlış kare! Seviye 1'den tekrar başla.";
        
        isPlaying = false;
        canClick = false;
        level = 1; // Restart from 1 as requested "every level gets harder" and it's a zeka game
        localStorage.setItem('zeka_game_level', 1);
        
        setTimeout(() => {
            gameGrid.classList.remove('shake');
            tile.classList.remove('wrong');
            updateHUD();
        }, 1000);
    }
    
    updateHUD();
}

// Global initialization
if (typeof window !== 'undefined') {
    window.gameEngine = { init: initGame };
}
