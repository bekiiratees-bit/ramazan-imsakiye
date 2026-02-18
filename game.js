// ===========================================================
// ÇİZGİ ÜZERİNDE TOP — Minimal Arcade Game
// Ball stays at FIXED horizontal position, jumps vertically.
// Line moves between LEFT – CENTER – RIGHT.
// Player must time jumps to land on the moving line.
// ===========================================================
(function () {
    'use strict';

    // === LEVEL CONFIG ===
    const LEVEL_THRESHOLDS = [0, 6, 14, 24, 36, 48, 60, 74, 88, 100];
    const MAX_LEVEL = 10;

    function getLevelConfig(level) {
        const l = Math.min(level, MAX_LEVEL);
        return {
            gravity: 0.32 + l * 0.018,
            lineWidth: Math.max(60, 140 - l * 8),
            shiftInterval: Math.max(600, 2800 - l * 220),
            jumpForce: -(7.5 + l * 0.1),
        };
    }

    // === STATE ===
    let canvas, ctx;
    let game = null;
    let animFrame = null;
    let highScore = parseInt(localStorage.getItem('game_highScore') || '0');

    function getEl(id) { return document.getElementById(id); }

    // === RESIZE ===
    function resizeCanvas() {
        if (!canvas) return;
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = Math.min(520, window.innerHeight * 0.55);
    }

    // === LINE POSITIONS ===
    function getLinePositions(cw) {
        return [cw * 0.2, cw * 0.5, cw * 0.8];
    }

    // === CREATE GAME ===
    function createGame() {
        resizeCanvas();
        const cw = canvas.width;
        const ch = canvas.height;
        const lineY = ch * 0.72;
        const positions = getLinePositions(cw);

        return {
            running: false,
            score: 0,
            startTime: 0,
            level: 1,
            cw, ch,

            ball: {
                x: cw / 2,          // FIXED horizontal center
                y: lineY - 10,
                vy: 0,
                radius: 9,
                trail: [],
                onLine: true,
                dead: false,
                canJump: true,       // No double jump
            },

            line: {
                x: positions[1],    // Start at center
                targetX: positions[1],
                posIdx: 1,
                y: lineY,
                width: 140,
                positions: positions,
            },

            config: getLevelConfig(1),
            lastShift: 0,

            // Touch
            tapCooldown: 0,

            // Particles
            particles: [],
        };
    }

    // === INPUT ===
    function onTap(e) {
        e.preventDefault();
        if (!game || !game.running) return;
        const ball = game.ball;

        // Must be on line to jump (no double jump)
        if (!ball.canJump) return;

        // Overjump protection: if tapped too fast, weaker jump
        const now = performance.now();
        const timeSinceLastTap = now - game.tapCooldown;
        let force = game.config.jumpForce;

        if (timeSinceLastTap < 300) {
            // Tapping too fast → overjump (too high, less control)
            force *= 1.5;
        }

        ball.vy = force;
        ball.onLine = false;
        ball.canJump = false;
        game.tapCooldown = now;
    }

    // === LINE SHIFT ===
    function shiftLine() {
        const positions = game.line.positions;
        const current = game.line.posIdx;

        // Move to a different position
        let next;
        if (current === 1) {
            next = Math.random() < 0.5 ? 0 : 2;
        } else {
            next = 1; // Always return to center first
        }

        game.line.posIdx = next;
        game.line.targetX = positions[next];
    }

    // === PARTICLES ===
    function spawnDeathParticles(x, y) {
        for (let i = 0; i < 24; i++) {
            game.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 7,
                vy: (Math.random() - 0.7) * 7,
                life: 1,
                radius: Math.random() * 3.5 + 1.5,
                hue: Math.random() > 0.5 ? 35 : 10, // amber or red
            });
        }
    }

    // === UPDATE ===
    function update() {
        if (!game.running) return;
        const { ball, line, config } = game;
        const cw = game.cw;

        // Score (elapsed time)
        game.score = (performance.now() - game.startTime) / 1000;

        // Level advancement
        let newLevel = 1;
        for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
            if (game.score >= LEVEL_THRESHOLDS[i]) { newLevel = i + 1; break; }
        }
        if (newLevel !== game.level) {
            game.level = newLevel;
            game.config = getLevelConfig(newLevel);
            line.width = game.config.lineWidth;
        }

        // Line shift timer
        if (performance.now() - game.lastShift > config.shiftInterval) {
            shiftLine();
            game.lastShift = performance.now();
        }

        // Smooth line horizontal transition
        const dx = line.targetX - line.x;
        line.x += dx * 0.06;

        // Ball physics — vertical only
        ball.vy += config.gravity;
        ball.y += ball.vy;

        // Ball x is FIXED at center of screen
        ball.x = cw / 2;

        // Collision: ball landing on line
        const halfW = line.width / 2;
        const ballOnLineX = ball.x >= (line.x - halfW) && ball.x <= (line.x + halfW);

        if (ball.vy >= 0 && ball.y >= line.y - ball.radius) {
            if (ballOnLineX) {
                // Landed on line!
                ball.y = line.y - ball.radius;
                ball.vy = 0;
                ball.onLine = true;
                ball.canJump = true;
            }
        }

        // Fell past the line
        if (ball.y > line.y + 80) {
            die();
            return;
        }

        // Trail (subtle)
        if (!ball.onLine) {
            ball.trail.push({ x: ball.x, y: ball.y, alpha: 0.5 });
            if (ball.trail.length > 8) ball.trail.shift();
        } else {
            ball.trail = [];
        }

        // Particles
        game.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.18;
            p.life -= 0.022;
        });
        game.particles = game.particles.filter(p => p.life > 0);

        // Update HUD
        getEl('gameScore').textContent = Math.floor(game.score);
        getEl('gameLevel').textContent = game.level;
    }

    // === DEATH ===
    function die() {
        game.running = false;
        game.ball.dead = true;
        spawnDeathParticles(game.ball.x, game.ball.y);

        const finalScore = Math.floor(game.score);
        const isNewRecord = finalScore > highScore;
        if (isNewRecord) {
            highScore = finalScore;
            localStorage.setItem('game_highScore', String(highScore));
        }
        getEl('gameHigh').textContent = highScore;

        // Show game over overlay after brief death animation
        setTimeout(() => {
            const overlay = getEl('gameOverlay');
            overlay.style.display = 'flex';
            getEl('gameOverTitle').textContent = '💥 Oyun Bitti!';
            getEl('gameOverMsg').textContent = `Seviye ${game.level} · ${finalScore} saniye`;
            getEl('gameFinalScore').textContent = isNewRecord ? '🏆 Yeni Rekor!' : `En iyi: ${highScore}s`;
            getEl('gameStartBtn').textContent = 'TEKRAR OYNA';
        }, 500);
    }

    // === RENDER ===
    function render() {
        if (!ctx) return;
        const { ball, line, particles, cw, ch } = game;

        // Clear
        ctx.clearRect(0, 0, cw, ch);

        // Background
        ctx.fillStyle = '#08090f';
        ctx.fillRect(0, 0, cw, ch);

        // Subtle grid dots
        ctx.fillStyle = 'rgba(255,255,255,0.015)';
        for (let x = 20; x < cw; x += 40) {
            for (let y = 20; y < ch; y += 40) {
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Line position markers (ghost lines)
        const positions = getLinePositions(cw);
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 1;
        const markerHalf = 40;
        positions.forEach(px => {
            ctx.beginPath();
            ctx.moveTo(px - markerHalf, line.y);
            ctx.lineTo(px + markerHalf, line.y);
            ctx.stroke();
        });

        // Active line
        const halfW = line.width / 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(245,158,11,0.25)';
        ctx.strokeStyle = 'rgba(245,158,11,0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(line.x - halfW, line.y);
        ctx.lineTo(line.x + halfW, line.y);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Line end dots
        ctx.fillStyle = 'rgba(245,158,11,0.4)';
        [line.x - halfW, line.x + halfW].forEach(ex => {
            ctx.beginPath();
            ctx.arc(ex, line.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
        });

        // Ball trail (motion trail when in air)
        ball.trail.forEach((t, i) => {
            const a = (i / ball.trail.length) * 0.2;
            ctx.fillStyle = `rgba(245,158,11,${a})`;
            ctx.beginPath();
            ctx.arc(t.x, t.y, ball.radius * 0.5, 0, Math.PI * 2);
            ctx.fill();
        });

        // Ball
        if (!ball.dead) {
            ctx.shadowBlur = 14;
            ctx.shadowColor = 'rgba(245,158,11,0.45)';
            const grad = ctx.createRadialGradient(
                ball.x - 2, ball.y - 2, 0,
                ball.x, ball.y, ball.radius
            );
            grad.addColorStop(0, '#fcd34d');
            grad.addColorStop(1, '#f59e0b');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Ball highlight
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.beginPath();
            ctx.arc(ball.x - 2, ball.y - 3, ball.radius * 0.35, 0, Math.PI * 2);
            ctx.fill();
        }

        // Death particles
        particles.forEach(p => {
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fillStyle = `hsl(${p.hue}, 90%, 55%)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        // Level progress bar at bottom
        if (game.running && game.level < MAX_LEVEL) {
            const nextT = LEVEL_THRESHOLDS[game.level] || 999;
            const prevT = LEVEL_THRESHOLDS[game.level - 1] || 0;
            const pct = Math.min(1, (game.score - prevT) / (nextT - prevT));
            ctx.fillStyle = 'rgba(245,158,11,0.12)';
            ctx.fillRect(0, ch - 2, cw * pct, 2);
        }
    }

    // === GAME LOOP ===
    function loop() {
        update();
        render();

        if (game.running || game.particles.length > 0) {
            // Continue rendering death particles
            if (!game.running && game.particles.length > 0) {
                game.particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.18;
                    p.life -= 0.022;
                });
                game.particles = game.particles.filter(p => p.life > 0);
            }
            animFrame = requestAnimationFrame(loop);
        }
    }

    // === START GAME ===
    function startGame() {
        if (animFrame) cancelAnimationFrame(animFrame);
        game = createGame();
        game.running = true;
        game.startTime = performance.now();
        game.lastShift = performance.now() + 1500; // Grace period

        getEl('gameOverlay').style.display = 'none';
        getEl('gameHigh').textContent = highScore;

        animFrame = requestAnimationFrame(loop);
    }

    // === INIT (called from app.js) ===
    window.initGame = function () {
        canvas = document.getElementById('gameCanvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');

        resizeCanvas();
        getEl('gameHigh').textContent = highScore;

        // Draw initial idle state
        game = createGame();
        render();

        // Input handlers
        canvas.addEventListener('touchstart', onTap, { passive: false });
        canvas.addEventListener('mousedown', onTap);
        canvas.addEventListener('contextmenu', e => e.preventDefault());

        // Start button
        getEl('gameStartBtn').addEventListener('click', startGame);

        // Resize handling
        window.addEventListener('resize', () => {
            resizeCanvas();
            if (game) {
                game.cw = canvas.width;
                game.ch = canvas.height;
                game.line.y = canvas.height * 0.72;
                game.line.positions = getLinePositions(canvas.width);
                game.ball.x = canvas.width / 2;
            }
        });
    };
})();
