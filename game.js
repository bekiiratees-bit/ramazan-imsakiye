/**
 * SPEED RUNNER - Arcade Logic Game
 * Mechanics: Move left/right to avoid obstacles and collect hearts.
 * Levels: 1000 levels of increasing speed.
 */

const gameViewport = document.getElementById('gameViewport');
const gameEntities = document.getElementById('gameEntities');
const speederPlayer = document.getElementById('speederPlayer');
const gameScoreEl = document.getElementById('gameScore');
const gameLevelEl = document.getElementById('gameLevel');
const gameLivesEl = document.getElementById('gameLives');
const gameHintEl = document.getElementById('gameHint');
const startBtn = document.getElementById('startGameBtn');
const btnMaximize = document.getElementById('btnMaximize');
const btnReset = document.getElementById('btnReset');
const gameContainer = document.querySelector('.game-container');

let level = parseInt(localStorage.getItem('runner_game_level') || '1');
let score = 0;
let lives = 3;
let speed = 2 + (level * 0.05); // Global speed multiplier
let isPlaying = false;
let entities = [];
let lastTime = 0;
let spawnTimer = 0;
let playerX = 50; // Percentage
let targetX = 50;

function initGame() {
    gameLevelEl.textContent = level;
    gameScoreEl.textContent = score;
    updateLivesUI();

    startBtn.addEventListener('click', () => {
        if (!isPlaying) startGame();
    });

    btnReset.addEventListener('click', () => {
        resetGame();
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
    });

    // Control: Touch/Mouse
    gameViewport.addEventListener('mousemove', (e) => {
        if (!isPlaying) return;
        const rect = gameViewport.getBoundingClientRect();
        targetX = ((e.clientX - rect.left) / rect.width) * 100;
    });

    gameViewport.addEventListener('touchmove', (e) => {
        if (!isPlaying) return;
        const rect = gameViewport.getBoundingClientRect();
        const touch = e.touches[0];
        targetX = ((touch.clientX - rect.left) / rect.width) * 100;
    }, { passive: false });
}

function updateLivesUI() {
    const hearts = gameLivesEl.querySelectorAll('i');
    hearts.forEach((h, i) => {
        if (i < lives) h.classList.add('active');
        else h.classList.remove('active');
    });
}

function startGame() {
    isPlaying = true;
    score = 0;
    lives = 3;
    speed = 2 + (level * 0.1);
    entities = [];
    gameEntities.innerHTML = '';
    updateLivesUI();
    startBtn.style.display = 'none';
    gameHintEl.textContent = "HAYDİ! Engellerden kaç!";
    
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    isPlaying = false;
    startBtn.style.display = 'inline-block';
    gameHintEl.textContent = "Gaza basmak için hazır mısın?";
    gameEntities.innerHTML = '';
    entities = [];
    playerX = 50;
    speederPlayer.style.left = '50%';
}

function gameLoop(now) {
    if (!isPlaying) return;

    const dt = (now - lastTime) / 1000;
    lastTime = now;

    // Smooth movement
    playerX += (targetX - playerX) * 0.2;
    playerX = Math.max(10, Math.min(90, playerX));
    speederPlayer.style.left = playerX + '%';

    // Spawning
    spawnTimer += dt;
    const spawnRate = Math.max(0.3, 1.5 - (level * 0.01));
    if (spawnTimer > spawnRate) {
        spawnEntity();
        spawnTimer = 0;
    }

    // Update Entities
    entities.forEach((entity, index) => {
        entity.y += speed * 100 * dt;
        entity.el.style.top = entity.y + 'px';

        // Collision Check
        const rect1 = speederPlayer.getBoundingClientRect();
        const rect2 = entity.el.getBoundingClientRect();

        if (checkCollision(rect1, rect2)) {
            handleCollision(entity);
            gameEntities.removeChild(entity.el);
            entities.splice(index, 1);
            return;
        }

        // Out of bounds
        if (entity.y > 500) {
            gameEntities.removeChild(entity.el);
            entities.splice(index, 1);
            score += 10;
            gameScoreEl.textContent = score;
            
            // Level Up logic
            if (score > 0 && score % 200 === 0) {
                levelUp();
            }
        }
    });

    requestAnimationFrame(gameLoop);
}

function spawnEntity() {
    const isHeart = Math.random() < 0.1; // 10% chance for heart
    const div = document.createElement('div');
    div.className = 'entity ' + (isHeart ? 'heart' : 'obstacle');
    
    const x = 10 + Math.random() * 80;
    div.style.left = x + '%';
    div.style.top = '-50px';
    
    gameEntities.appendChild(div);
    entities.push({ el: div, type: isHeart ? 'heart' : 'obstacle', y: -50, x: x });
}

function checkCollision(r1, r2) {
    // Shrink hitboxes a bit for better "feel"
    const buffer = 10;
    return !(r2.left > r1.right - buffer || 
             r2.right < r1.left + buffer || 
             r2.top > r1.bottom - buffer ||
             r2.bottom < r1.top + buffer);
}

function handleCollision(entity) {
    if (entity.type === 'obstacle') {
        lives--;
        speed *= 0.7; // Slow down on hit
        setTimeout(() => speed = 2 + (level * 0.1), 1000); // Speed back up
        updateLivesUI();
        gameViewport.classList.add('shake');
        setTimeout(() => gameViewport.classList.remove('shake'), 400);

        if (lives <= 0) {
            gameOver();
        }
    } else {
        if (lives < 3) lives++;
        updateLivesUI();
        score += 50;
        gameScoreEl.textContent = score;
        if (typeof showConfetti === 'function') showConfetti();
    }
}

function levelUp() {
    level++;
    speed += 0.2;
    gameLevelEl.textContent = level;
    localStorage.setItem('runner_game_level', level);
    // Visual feedback
    gameHintEl.textContent = "SEVİYE ATLANDI! DAHA HIZLI!";
    gameHintEl.style.color = "var(--accent)";
    setTimeout(() => {
        gameHintEl.textContent = "Engellerden kaç!";
        gameHintEl.style.color = "var(--text-dim)";
    }, 2000);
}

function gameOver() {
    isPlaying = false;
    gameHintEl.textContent = "OYUN BİTTİ! Skorun: " + score;
    startBtn.style.display = 'inline-block';
    startBtn.textContent = 'YENİDEN DENE';
}

if (typeof window !== 'undefined') {
    window.gameEngine = { init: initGame };
}
