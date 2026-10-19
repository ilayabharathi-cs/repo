/**
 * KAI MERCER // GAME DEVELOPER PORTFOLIO
 * Core JavaScript Logic: Interactive Canvas, Web Audio Synthesizer,
 * Playable Arcade Lab Mini-Game, Project Case Studies, and Dev Console.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. SOUND SYSTEM (WEB AUDIO API SYNTHESIZER)
  // =========================================================================
  class SoundManager {
    constructor() {
      this.enabled = true;
      this.ctx = null;
      this.initOnFirstGesture();
    }

    initOnFirstGesture() {
      const unlockAudio = () => {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            this.ctx = new AudioContext();
          }
        } else if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };
      window.addEventListener('click', unlockAudio);
      window.addEventListener('keydown', unlockAudio);
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }

    playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.1) {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // audio context safety
      }
    }

    // UI Click Sound
    click() {
      this.playTone(800, 'sine', 0.05, 0.05);
    }

    // Hover UI Blip
    hover() {
      this.playTone(520, 'triangle', 0.04, 0.03);
    }

    // Laser Fire
    laser() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.14);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.14);
      } catch (e) {}
    }

    // Explosion
    explosion() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(140, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.35);

        gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.35);
      } catch (e) {}
    }

    // Success Chime
    success() {
      if (!this.enabled || !this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        setTimeout(() => this.playTone(freq, 'sine', 0.2, 0.08), i * 80);
      });
    }
  }

  const sound = new SoundManager();

  // Attach hover sounds to interactive elements
  const interactiveSelector = 'a, button, .project-card, .skill-card, .pillar-card';
  document.querySelectorAll(interactiveSelector).forEach(el => {
    el.addEventListener('mouseenter', () => sound.hover());
  });

  // SFX Toggle Button
  const sfxToggleBtn = document.getElementById('sfxToggleBtn');
  const sfxStatus = document.getElementById('sfxStatus');
  if (sfxToggleBtn && sfxStatus) {
    sfxToggleBtn.addEventListener('click', () => {
      const isEnabled = sound.toggle();
      sfxStatus.textContent = isEnabled ? 'SFX: ON' : 'SFX: OFF';
      sfxToggleBtn.style.borderColor = isEnabled ? 'rgba(0, 240, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)';
      if (isEnabled) sound.click();
    });
  }

  // 2. BACKGROUND STARFIELD / CYBER GRID PARTICLES
  // =========================================================================
  const bgCanvas = document.getElementById('bgCanvas');
  if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d');
    let width = (bgCanvas.width = window.innerWidth);
    let height = (bgCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = bgCanvas.width = window.innerWidth;
      height = bgCanvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 14000), 90);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.8 + 0.8,
        color: Math.random() > 0.4 ? 'rgba(0, 240, 255, ' : 'rgba(168, 85, 247, ',
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;
    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function drawBackground() {
      ctx.clearRect(0, 0, width, height);

      // Subtle Cyber Grid Lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse avoidance/repulsion
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x -= (dx / dist) * force * 1.8;
          p.y -= (dy / dist) * force * 1.8;
        }

        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist2 < 110) {
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 * (1 - dist2 / 110)})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawBackground);
    }
    requestAnimationFrame(drawBackground);
  }

  // 3. FPS COUNTER IN HUD
  // =========================================================================
  const fpsDisplay = document.getElementById('fpsDisplay');
  if (fpsDisplay) {
    let lastTime = performance.now();
    let frameCount = 0;
    function updateFPS(now) {
      frameCount++;
      if (now - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        fpsDisplay.textContent = `FPS: ${fps}`;
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(updateFPS);
    }
    requestAnimationFrame(updateFPS);
  }

  // 4. HEADER SCROLL & MOBILE MENU
  // =========================================================================
  const header = document.getElementById('hudHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // 5. SKILLS MATRIX TABS FILTER
  // =========================================================================
  const skillTabs = document.querySelectorAll('.skill-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sound.click();
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.dataset.category;
      skillCards.forEach(card => {
        if (category === 'all' || card.dataset.category.includes(category)) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. PROJECTS FILTER & CASE STUDY MODAL
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sound.click();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Technical Project Data for Deep-Dive Modal
  const projectDetails = {
    chronos: {
      title: 'Chronos Protocol',
      engine: 'Unreal Engine 5.4 (C++)',
      role: 'Lead Combat & Systems Engineer',
      period: 'January 2023 – November 2024 (Shipped)',
      platforms: 'Steam (PC), PlayStation 5, Xbox Series X',
      img: 'assets/images/chronos-protocol.jpg',
      overview: 'A high-octane cyberpunk rogue-lite featuring multi-threaded physics deflection, volumetric neon lighting via Lumen, and modular hero abilities.',
      techHighlights: [
        'Architected gameplay abilities with Unreal\'s Gameplay Ability System (GAS), implementing custom attribute sets and networked prediction for 140+ character perks.',
        'Engineered millimeter-accurate weapon deflection system utilizing continuous collision sweeping and compute-shader blade sparks.',
        'Profiled performance on PS5 devkits using Unreal Insights and RenderDoc, maintaining a rock-solid 60 FPS in heavy particle engagements.'
      ],
      mechanics: 'Time-dilation spheres that slow enemy projectiles by 75% while keeping the player\'s input responses instantaneous via custom time dilation dilation channels.'
    },
    aetheria: {
      title: 'Aetheria: Echoes of the Void',
      engine: 'Unity 6 (URP & C#)',
      role: 'Senior Gameplay & Tech Artist',
      period: 'June 2021 – October 2023 (Shipped)',
      platforms: 'PC, Nintendo Switch, macOS',
      img: 'assets/images/aetheria-void.jpg',
      overview: 'Atmospheric exploration title across alien ruins featuring custom spherical planetary gravity, ancient resonance puzzles, and real-time volumetric nebulae.',
      techHighlights: [
        'Programmed a 6-DOF kinematic character controller capable of walking on arbitrarily oriented planetary surfaces and spherical ruins.',
        'Written custom HLSL screen-space raymarching shaders to render alien cosmic nebulae and bioluminescent flora at low GPU costs.',
        'Integrated DOTS (Entities + Job System) to simulate 10,000 interactive crystal particle swarms responding to acoustic player pulses.'
      ],
      mechanics: 'Acoustic frequency manipulation allowing players to tune resonant crystal arches and invert planetary gravity vectors.'
    },
    shadowfang: {
      title: 'Shadowfang: Rebirth',
      engine: 'Unreal Engine 5.2 (C++)',
      role: 'Combat & AI Systems Programmer',
      period: 'January 2021 – December 2022 (Shipped)',
      platforms: 'PC (Steam), PlayStation 5',
      img: 'assets/images/shadowfang.jpg',
      overview: 'Souls-like dark fantasy combat experience built around directional parries, posture breaks, dynamic motion matching, and multi-phase boss state machines.',
      techHighlights: [
        'Implemented Hierarchical Finite State Machines (HFSM) coupled with Unreal\'s Environment Query System (EQS) for intelligent boss arena flanking.',
        'Engineered custom Inverse Kinematics (IK) foot and hand placement on uneven medieval masonry and rubble.',
        'Built deterministic hit-pause and camera impulse curves to maximize tactile impact feel.'
      ],
      mechanics: 'Directional parrying with 4-frame reaction windows and procedural cloth tear simulation during execution strikes.'
    }
  };

  const projectModal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalDynamicContent');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.click();
      const projectKey = btn.dataset.project;
      const data = projectDetails[projectKey];
      if (!data) return;

      modalContent.innerHTML = `
        <img src="${data.img}" alt="${data.title}" class="modal-hero-img">
        <div class="modal-header-meta">
          <span class="badge engine-ue5">${data.engine}</span>
          <span class="badge status-released">${data.period}</span>
        </div>
        <h2 class="modal-title">${data.title}</h2>
        <div class="modal-specs-grid">
          <div class="modal-spec-item"><strong>ROLE</strong> ${data.role}</div>
          <div class="modal-spec-item"><strong>PLATFORMS</strong> ${data.platforms}</div>
          <div class="modal-spec-item"><strong>FOCUS</strong> Combat &amp; Systems</div>
        </div>

        <h3 class="modal-section-title">// SYSTEM OVERVIEW</h3>
        <p class="modal-body-text">${data.overview}</p>

        <h3 class="modal-section-title">// KEY TECHNICAL CONTRIBUTIONS</h3>
        <ul class="achievement-list">
          ${data.techHighlights.map(h => `<li>${h}</li>`).join('')}
        </ul>

        <h3 class="modal-section-title">// INNOVATION SPOTLIGHT</h3>
        <p class="modal-body-text">${data.mechanics}</p>
      `;

      projectModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    if (projectModal) {
      projectModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (projectModal) {
    projectModal.addEventListener('click', e => {
      if (e.target === projectModal) closeModal();
    });
  }

  // 7. PLAYABLE ARCADE LAB MINI-GAME ("NEON DEFENDER")
  // =========================================================================
  const gameCanvas = document.getElementById('gameCanvas');
  const gameOverlay = document.getElementById('gameOverlay');
  const btnStartGame = document.getElementById('btnStartGame');
  const gameScoreDisplay = document.getElementById('gameScoreDisplay');
  const gameHighScoreDisplay = document.getElementById('gameHighScoreDisplay');
  const gameShieldDisplay = document.getElementById('gameShieldDisplay');
  const gameWaveDisplay = document.getElementById('gameWaveDisplay');

  if (gameCanvas) {
    const gctx = gameCanvas.getContext('2d');
    let gameRunning = false;
    let score = 0;
    let highScore = parseInt(localStorage.getItem('gamedev_arcade_high') || '0', 10);
    let shield = 100;
    let wave = 1;
    let animId = null;

    gameHighScoreDisplay.textContent = String(highScore).padStart(5, '0');

    // Player State
    const player = {
      x: gameCanvas.width / 2,
      y: gameCanvas.height - 45,
      width: 44,
      height: 32,
      speed: 7,
      isMovingLeft: false,
      isMovingRight: false,
      lastShot: 0
    };

    let bullets = [];
    let enemies = [];
    let particles = [];

    // Keyboard Controls
    window.addEventListener('keydown', e => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) player.isMovingLeft = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) player.isMovingRight = true;
      if (e.code === 'Space' && gameRunning) {
        e.preventDefault();
        fireLaser();
      }
      if (e.code === 'KeyP' && gameRunning) {
        pauseGame();
      }
    });

    window.addEventListener('keyup', e => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) player.isMovingLeft = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) player.isMovingRight = false;
    });

    // Mouse / Touch Controls for firing & positioning
    gameCanvas.addEventListener('mousemove', e => {
      if (!gameRunning) return;
      const rect = gameCanvas.getBoundingClientRect();
      const scaleX = gameCanvas.width / rect.width;
      const mx = (e.clientX - rect.left) * scaleX;
      player.x = Math.max(player.width / 2, Math.min(gameCanvas.width - player.width / 2, mx));
    });

    gameCanvas.addEventListener('mousedown', () => {
      if (gameRunning) fireLaser();
    });

    function fireLaser() {
      const now = performance.now();
      if (now - player.lastShot < 160) return; // Fire rate limit
      player.lastShot = now;

      bullets.push({
        x: player.x - 14,
        y: player.y - 10,
        vx: 0,
        vy: -11,
        color: '#00f0ff'
      });
      bullets.push({
        x: player.x + 14,
        y: player.y - 10,
        vx: 0,
        vy: -11,
        color: '#00f0ff'
      });

      sound.laser();
    }

    function spawnEnemy() {
      if (!gameRunning) return;
      const speed = 1.6 + Math.random() * 1.5 + wave * 0.2;
      const size = 26 + Math.random() * 14;
      enemies.push({
        x: Math.random() * (gameCanvas.width - 60) + 30,
        y: -30,
        size: size,
        speed: speed,
        hp: size > 34 ? 2 : 1,
        color: size > 34 ? '#ec4899' : '#a855f7'
      });
    }

    function createExplosion(x, y, color) {
      sound.explosion();
      for (let i = 0; i < 16; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          color: color || '#00f0ff',
          size: Math.random() * 3 + 1.5
        });
      }
    }

    function startGame() {
      score = 0;
      shield = 100;
      wave = 1;
      bullets = [];
      enemies = [];
      particles = [];
      player.x = gameCanvas.width / 2;

      gameScoreDisplay.textContent = '00000';
      gameShieldDisplay.style.width = '100%';
      gameWaveDisplay.textContent = 'WAVE 1';

      gameOverlay.classList.add('hidden');
      gameRunning = true;
      sound.success();

      clearInterval(window.enemySpawnTimer);
      window.enemySpawnTimer = setInterval(spawnEnemy, 950);

      if (animId) cancelAnimationFrame(animId);
      gameLoop();
    }

    function pauseGame() {
      gameRunning = !gameRunning;
      if (!gameRunning) {
        gameOverlay.classList.remove('hidden');
        document.getElementById('overlayContent').innerHTML = `
          <h3 class="game-overlay-title">SYSTEM PAUSED</h3>
          <p class="game-overlay-subtitle">Press P or click below to resume combat operations.</p>
          <button class="btn btn-primary btn-arcade-start" id="btnResumeGame">RESUME SIMULATION</button>
        `;
        document.getElementById('btnResumeGame').addEventListener('click', pauseGame);
      } else {
        gameOverlay.classList.add('hidden');
        gameLoop();
      }
    }

    function gameOver() {
      gameRunning = false;
      clearInterval(window.enemySpawnTimer);

      if (score > highScore) {
        highScore = score;
        localStorage.setItem('gamedev_arcade_high', highScore);
        gameHighScoreDisplay.textContent = String(highScore).padStart(5, '0');
      }

      gameOverlay.classList.remove('hidden');
      document.getElementById('overlayContent').innerHTML = `
        <h3 class="game-overlay-title" style="color: #ff3366;">GRID BREACHED</h3>
        <p class="game-overlay-subtitle">Your interceptor was disabled. Final Score: <strong>${score}</strong></p>
        <button class="btn btn-primary btn-arcade-start" id="btnRestartGame">RESTART SYSTEM</button>
      `;
      document.getElementById('btnRestartGame').addEventListener('click', startGame);
    }

    function gameLoop() {
      if (!gameRunning) return;

      // Clear Screen with trailing motion blur
      gctx.fillStyle = 'rgba(4, 6, 12, 0.4)';
      gctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

      // Player Movement via Keys
      if (player.isMovingLeft) player.x -= player.speed;
      if (player.isMovingRight) player.x += player.speed;
      player.x = Math.max(player.width / 2, Math.min(gameCanvas.width - player.width / 2, player.x));

      // Draw Player Ship (Stylized Vector Interceptor)
      gctx.save();
      gctx.translate(player.x, player.y);

      // Thruster Glow
      gctx.fillStyle = '#00f0ff';
      gctx.shadowColor = '#00f0ff';
      gctx.shadowBlur = 15;
      gctx.beginPath();
      gctx.moveTo(-10, 15);
      gctx.lineTo(0, 25 + Math.random() * 8);
      gctx.lineTo(10, 15);
      gctx.closePath();
      gctx.fill();

      // Ship Hull
      gctx.fillStyle = '#f8fafc';
      gctx.strokeStyle = '#00f0ff';
      gctx.lineWidth = 2;
      gctx.beginPath();
      gctx.moveTo(0, -18);
      gctx.lineTo(20, 14);
      gctx.lineTo(7, 10);
      gctx.lineTo(0, 14);
      gctx.lineTo(-7, 10);
      gctx.lineTo(-20, 14);
      gctx.closePath();
      gctx.fill();
      gctx.stroke();

      // Cockpit Glow
      gctx.fillStyle = '#a855f7';
      gctx.beginPath();
      gctx.arc(0, 0, 4, 0, Math.PI * 2);
      gctx.fill();

      gctx.restore();

      // Update & Draw Bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.y += b.vy;

        gctx.save();
        gctx.fillStyle = b.color;
        gctx.shadowColor = b.color;
        gctx.shadowBlur = 10;
        gctx.fillRect(b.x - 2, b.y, 4, 12);
        gctx.restore();

        if (b.y < -20) bullets.splice(i, 1);
      }

      // Update & Draw Enemies
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.y += e.speed;

        gctx.save();
        gctx.translate(e.x, e.y);
        gctx.fillStyle = e.color;
        gctx.shadowColor = e.color;
        gctx.shadowBlur = 12;

        // Diamond Drone Shape
        gctx.beginPath();
        gctx.moveTo(0, -e.size / 2);
        gctx.lineTo(e.size / 2, 0);
        gctx.lineTo(0, e.size / 2);
        gctx.lineTo(-e.size / 2, 0);
        gctx.closePath();
        gctx.fill();

        gctx.restore();

        // Check Collision with Bullets
        for (let j = bullets.length - 1; j >= 0; j--) {
          const b = bullets[j];
          const dist = Math.hypot(b.x - e.x, b.y - e.y);
          if (dist < e.size / 2 + 5) {
            bullets.splice(j, 1);
            e.hp--;
            if (e.hp <= 0) {
              createExplosion(e.x, e.y, e.color);
              score += 150;
              gameScoreDisplay.textContent = String(score).padStart(5, '0');

              // Wave escalation every 1500 points
              if (score > wave * 1500) {
                wave++;
                gameWaveDisplay.textContent = `WAVE ${wave}`;
              }

              enemies.splice(i, 1);
              break;
            }
          }
        }

        // Check Collision with Player Shield
        if (e && Math.hypot(e.x - player.x, e.y - player.y) < player.width / 2 + e.size / 2) {
          createExplosion(e.x, e.y, '#ff3366');
          enemies.splice(i, 1);
          shield -= 25;
          gameShieldDisplay.style.width = Math.max(0, shield) + '%';
          if (shield <= 0) {
            gameOver();
            return;
          }
        }

        // Breach Bottom Edge
        if (e && e.y > gameCanvas.height + 30) {
          enemies.splice(i, 1);
          shield -= 15;
          gameShieldDisplay.style.width = Math.max(0, shield) + '%';
          if (shield <= 0) {
            gameOver();
            return;
          }
        }
      }

      // Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.035;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        gctx.save();
        gctx.fillStyle = p.color;
        gctx.globalAlpha = p.life;
        gctx.beginPath();
        gctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        gctx.fill();
        gctx.restore();
      }

      animId = requestAnimationFrame(gameLoop);
    }

    if (btnStartGame) {
      btnStartGame.addEventListener('click', startGame);
    }
  }

  // 8. INTERACTIVE DEV TERMINAL (PRESS ~ OR BUTTON)
  // =========================================================================
  const terminalToggleBtn = document.getElementById('terminalToggleBtn');
  const terminalModal = document.getElementById('terminalModal');
  const termCloseBtn = document.getElementById('termCloseBtn');
  const termCloseDot = document.getElementById('termCloseDot');
  const terminalInput = document.getElementById('terminalInput');
  const terminalLog = document.getElementById('terminalLog');

  function toggleTerminal() {
    sound.click();
    terminalModal.classList.toggle('open');
    if (terminalModal.classList.contains('open')) {
      terminalInput.focus();
    }
  }

  if (terminalToggleBtn) terminalToggleBtn.addEventListener('click', toggleTerminal);
  if (termCloseBtn) termCloseBtn.addEventListener('click', toggleTerminal);
  if (termCloseDot) termCloseDot.addEventListener('click', toggleTerminal);

  window.addEventListener('keydown', e => {
    if (e.key === '`' || e.key === '~') {
      e.preventDefault();
      toggleTerminal();
    }
    if (e.key === 'Escape' && terminalModal.classList.contains('open')) {
      terminalModal.classList.remove('open');
    }
  });

  const termCommands = {
    help: () => `
      AVAILABLE SYSTEM COMMANDS:<br>
      &bull; <span class="term-cmd">dates</span> - Display verified timeline of professional milestones with exact hardcoded dates<br>
      &bull; <span class="term-cmd">about</span> - Summary of engineering philosophy and experience<br>
      &bull; <span class="term-cmd">skills</span> - Overview of core engines (UE5, Unity) & languages<br>
      &bull; <span class="term-cmd">projects</span> - List of commercial shipped titles<br>
      &bull; <span class="term-cmd">contact</span> - Display email and transmission handles<br>
      &bull; <span class="term-cmd">clear</span> - Clear terminal buffer
    `,
    dates: () => `
      ================ VERIFIED PROFESSIONAL CAREER DATES ================<br>
      &bull; [March 15, 2023 – Present] Senior Gameplay Engineer @ Mythic Forge Studios (UE5)<br>
      &bull; [January 10, 2021 – February 28, 2023] Gameplay & Systems Programmer @ PixelPulse Interactive<br>
      &bull; [June 03, 2019 – December 18, 2020] Associate Game Engineer @ Orbital Velocity Labs<br>
      &bull; [September 2015 – May 2019] B.S. Computer Science &amp; Game Engineering (Cal Poly, Magna Cum Laude)<br>
      <br>
      ================ HARDCODED AWARDS &amp; GRANTS ================<br>
      &bull; [November 14, 2024] Epic MegaGrants Recipient ($25,000 for UE5 procedural animation)<br>
      &bull; [August 22, 2023] Indie Game Cup: "Best Combat Mechanics" Winner<br>
      &bull; [October 10, 2022] Steam Next Fest Top 50 Trending (85k+ demo players)<br>
      &bull; [April 18, 2021] Global Game Jam 1st Place
    `,
    about: () => `Kai "Vex" Mercer: Senior Gameplay Engineer & Tech Artist. 8+ years experience, 6 shipped games, specialized in Unreal Engine 5 (C++), custom shaders (HLSL), and physics gameplay.`,
    skills: () => `Engines: Unreal Engine 5.4, Unity 6. Languages: Modern C++ (17/20), C#, HLSL, GLSL. Systems: Gameplay Ability System (GAS), Motion Matching, DOD, Netcode.`,
    projects: () => `1. Chronos Protocol (UE5.4 C++, Shipped 2024)<br>2. Aetheria: Echoes of the Void (Unity, Shipped 2023)<br>3. Shadowfang: Rebirth (UE5 Souls-like, Shipped 2022)`,
    contact: () => `Email: kai.mercer.gamedev@example.com | Discord: @VexMercer#0001 | Location: San Francisco, CA`,
    clear: () => {
      terminalLog.innerHTML = '';
      return '';
    }
  };

  if (terminalInput) {
    terminalInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const rawCmd = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';
        if (!rawCmd) return;

        sound.click();
        const cmdEcho = document.createElement('div');
        cmdEcho.className = 'term-line cmd-echo';
        cmdEcho.textContent = `> ${rawCmd}`;
        terminalLog.appendChild(cmdEcho);

        const responseEl = document.createElement('div');
        responseEl.className = 'term-line output';

        if (termCommands[rawCmd]) {
          const res = termCommands[rawCmd]();
          if (res) responseEl.innerHTML = res;
        } else {
          responseEl.innerHTML = `Command '${rawCmd}' not recognized. Type <span class="term-cmd">'help'</span> for list.`;
        }

        if (responseEl.innerHTML) terminalLog.appendChild(responseEl);
        terminalLog.scrollTop = terminalLog.scrollHeight;
      }
    });
  }

  // 9. COPY EMAIL TO CLIPBOARD
  // =========================================================================
  const btnCopyEmail = document.getElementById('btnCopyEmail');
  const copyFeedback = document.getElementById('copyFeedback');
  const emailText = document.getElementById('emailText');

  if (btnCopyEmail && copyFeedback && emailText) {
    btnCopyEmail.addEventListener('click', () => {
      sound.click();
      navigator.clipboard.writeText(emailText.textContent.trim()).then(() => {
        copyFeedback.textContent = 'COPIED!';
        btnCopyEmail.style.background = 'var(--neon-emerald)';
        btnCopyEmail.style.color = '#000';
        setTimeout(() => {
          copyFeedback.textContent = 'COPY';
          btnCopyEmail.style.background = '';
          btnCopyEmail.style.color = '';
        }, 2200);
      });
    });
  }

  // 10. CONTACT FORM SIMULATION
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      sound.success();

      const senderName = document.getElementById('senderName').value;
      const btn = document.getElementById('btnSubmitMessage');
      btn.disabled = true;
      btn.innerHTML = '<span>TRANSMITTING PACKET...</span>';

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = `<span>TRANSMIT PACKET</span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;

        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `
          <strong>[TRANSMISSION CONFIRMED]</strong> Thank you, ${senderName}! Your message has been dispatched to Kai's priority queue. Expected response time: &lt; 24 hours.
        `;
        formFeedback.classList.remove('hidden');
        contactForm.reset();
      }, 1000);
    });
  }

  // Download Resume button mock action
  const downloadResumeBtn = document.getElementById('downloadResumeBtn');
  if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', () => {
      sound.click();
    });
  }
});
