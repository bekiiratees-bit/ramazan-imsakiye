// ==========================================================
// YILDIZ KAÇIŞ — Falling Stars Dodge Game
// Minimalist arcade: dodge falling stars by swiping left/right
// ==========================================================

(function () {
    'use strict';

    // ---- DOM ----
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const overlay = document.getElementById('gameOverlay');
    const startBtn = document.getElementById('gameStartBtn');
    const scoreEl = document.getElementById('gameScore');
    const levelEl = document.getElementById('gameLevel');
    const highEl = document.getElementById('gameHigh');
    const titleEl = document.getElementById('gameOverTitle');
    const msgEl = document.getElementById('gameOverMsg');
    const finalEl = document.getElementById('gameFinalScore');

    // ---- CONSTANTS ----
    const PLAYER_W = 28;
    const PLAYER_H = 28;
    const STAR_SIZE = 14;
    const PLAYER_Y_OFFSET = 60; // from bottom
    const SPEED_BASE = 2;
    const SPAWN_INTERVAL_BASE = 800; // ms
    const LEVEL_UP_SCORE = 15; // score per level
    const MAX_LEVEL = 10;

    // ---- STATE ----
    let W, H;
    let running = false;
    let animId = null;
    let score = 0;
    let level = 1;
    let highScore = parseInt(localStorage.getItem('starDodge_high') || '0');
    let playerX = 0;
    let stars = [];
    let particles = [];
    let lastSpawn = 0;
    let touchStartX = null;
    let playerTargetX = 0;
    let gameTime = 0;

    // ---- LEVEL CONFIG ----
    function getLevel() {
        return {
            starSpeed: SPEED_BASE + (level - 1) * 0.5,
            spawnInterval: Math.max(200, SPAWN_INTERVAL_BASE - (level - 1) * 60),
            maxStars: 4 + level,
        };
    }

    // ---- RESIZE ----
    function resize() {
        const wrap = canvas.parentElement;
        const rect = wrap.getBoundingClientRect();
        W = canvas.width = rect.width;
        H = canvas.height = rect.height;
    }

    // ---- PLAYER ----
    function drawPlayer() {
        const y = H - PLAYER_Y_OFFSET;
        const x = playerX;

        // Body (crescent moon figure — Ramazan themed)
        ctx.save();
        ctx.translate(x, y);

        // Glow
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;

        // Body circle
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(0, 0, PLAYER_W / 2, 0, Math.PI * 2);
        ctx.fill();

        // Inner circle (crescent effect)
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(5, -3, PLAYER_W / 2.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.restore();
    }

    // ---- STARS ----
    function spawnStar() {
        const conf = getLevel();
        const x = Math.random() * (W - STAR_SIZE * 2) + STAR_SIZE;
        const speed = conf.starSpeed * (0.7 + Math.random() * 0.6);
        const rotation = Math.random() * Math.PI * 2;
        const rotSpeed = (Math.random() - 0.5) * 0.08;
        stars.push({ x, y: -STAR_SIZE, speed, rotation, rotSpeed, size: STAR_SIZE * (0.7 + Math.random() * 0.6) });
    }

    function drawStar(s) {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);

        // Star shape
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        const spikes = 5;
        const outerR = s.size;
        const innerR = s.size * 0.4;
        for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const angle = (Math.PI / spikes) * i - Math.PI / 2;
            if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
            else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.restore();
    }

    // ---- PARTICLES ----
    function spawnParticles(x, y) {
        for (let i = 0; i < 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 3;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                color: Math.random() > 0.5 ? '#f59e0b' : '#ef4444',
                size: 2 + Math.random() * 3
            });
        }
    }

    function updateParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.03;
            if (p.life <= 0) particles.splice(i, 1);
        }
    }

    function drawParticles() {
        for (const p of particles) {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    // ---- COLLISION ----
    function checkCollision() {
        const py = H - PLAYER_Y_OFFSET;
        const pr = PLAYER_W / 2;
        for (const s of stars) {
            const dx = s.x - playerX;
            const dy = s.y - py;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < pr + s.size * 0.6) {
                return s;
            }
        }
        return null;
    }

    // ---- BACKGROUND ----
    function drawBackground() {
        // Dark gradient
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#0a0a1a');
        grad.addColorStop(1, '#1a1a2e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Subtle ambient dots
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        for (let i = 0; i < 30; i++) {
            const x = (Math.sin(i * 97 + gameTime * 0.0003) * 0.5 + 0.5) * W;
            const y = (Math.cos(i * 73 + gameTime * 0.0002) * 0.5 + 0.5) * H;
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fill();
        }

        // Ground line
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, H - 30);
        ctx.lineTo(W, H - 30);
        ctx.stroke();
    }

    // ---- GAME LOOP ----
    function gameLoop(timestamp) {
        if (!running) return;

        gameTime = timestamp;
        const conf = getLevel();

        // Spawn stars
        if (timestamp - lastSpawn > conf.spawnInterval) {
            if (stars.length < conf.maxStars) {
                spawnStar();
            }
            lastSpawn = timestamp;
        }

        // Move player towards target
        const dx = playerTargetX - playerX;
        playerX += dx * 0.15;

        // Clamp player
        playerX = Math.max(PLAYER_W / 2, Math.min(W - PLAYER_W / 2, playerX));

        // Update stars
        for (let i = stars.length - 1; i >= 0; i--) {
            const s = stars[i];
            s.y += s.speed;
            s.rotation += s.rotSpeed;

            // Off screen — score
            if (s.y > H + STAR_SIZE) {
                stars.splice(i, 1);
                score++;
                scoreEl.textContent = score;

                // Level up
                const newLevel = Math.min(MAX_LEVEL, Math.floor(score / LEVEL_UP_SCORE) + 1);
                if (newLevel !== level) {
                    level = newLevel;
                    levelEl.textContent = level;
                }
            }
        }

        // Check collision
        const hit = checkCollision();
        if (hit) {
            spawnParticles(hit.x, hit.y);
            spawnParticles(playerX, H - PLAYER_Y_OFFSET);
            gameOver();
            return;
        }

        // Update particles
        updateParticles();

        // Draw
        drawBackground();
        for (const s of stars) drawStar(s);
        drawPlayer();
        drawParticles();

        // Score overlay (top center)
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.font = 'bold 60px Outfit';
        ctx.textAlign = 'center';
        ctx.fillText(score, W / 2, H / 2 - 20);

        animId = requestAnimationFrame(gameLoop);
    }

    // ---- GAME OVER ----
    function gameOver() {
        running = false;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('starDodge_high', highScore);
        }
        highEl.textContent = highScore;

        titleEl.textContent = 'Oyun Bitti!';
        msgEl.textContent = `Seviye ${level} · ${score} yıldız kaçırdın`;
        finalEl.textContent = score > 0 ? `Skor: ${score}` : '';
        startBtn.textContent = 'TEKRAR OYNA';
        overlay.style.display = 'flex';

        // Continue drawing particles briefly
        let frames = 0;
        function deathAnim() {
            if (frames > 40) return;
            frames++;
            updateParticles();
            drawBackground();
            for (const s of stars) drawStar(s);
            drawParticles();
            requestAnimationFrame(deathAnim);
        }
        deathAnim();
    }

    // ---- START ----
    function startGame() {
        resize();
        score = 0;
        level = 1;
        stars = [];
        particles = [];
        lastSpawn = 0;
        playerX = W / 2;
        playerTargetX = W / 2;

        scoreEl.textContent = '0';
        levelEl.textContent = '1';
        highEl.textContent = highScore;
        overlay.style.display = 'none';

        running = true;
        animId = requestAnimationFrame(gameLoop);
    }

    // ---- CONTROLS ----
    // Touch: drag left/right
    canvas.addEventListener('touchstart', (e) => {
        if (!running) return;
        e.preventDefault();
        touchStartX = e.touches[0].clientX;
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        if (!running) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touchX = e.touches[0].clientX - rect.left;
        playerTargetX = touchX;
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
        touchStartX = null;
    });

    // Mouse fallback
    canvas.addEventListener('mousemove', (e) => {
        if (!running) return;
        const rect = canvas.getBoundingClientRect();
        playerTargetX = e.clientX - rect.left;
    });

    // Click/tap on canvas when overlay hidden starts game
    canvas.addEventListener('click', () => {
        if (!running && overlay.style.display === 'none') {
            startGame();
        }
    });

    // ---- INIT ----
    function initGame() {
        resize();
        highEl.textContent = highScore;
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            startGame();
        });
        window.addEventListener('resize', () => {
            if (running) resize();
        });

        // Initial draw
        drawBackground();
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.font = 'bold 60px Outfit';
        ctx.textAlign = 'center';
        ctx.fillText('⭐', W / 2, H / 2);
    }

    // Expose
    window.initGame = initGame;
})();
