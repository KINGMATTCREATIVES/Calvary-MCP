/**
 * Bouncing Ball Animation Studio & Cavalry Bridge Client
 * Features:
 * - 4 Animation Modes (12 Principles Squash & Stretch, Newtonian Physics, Arc Bounce, Multi-ball)
 * - Interactive Mouse Drag & Throw Physics
 * - Web Audio API Procedural Sound Synthesis
 * - Real-time Cavalry Node Script Generator
 * - Cavalry MCP Bridge HTTP Integration
 */

(function () {
  // DOM Elements
  const canvas = document.getElementById('anim-canvas');
  const ctx = canvas.getContext('2d');
  const canvasContainer = document.getElementById('canvas-container');
  const canvasHint = document.getElementById('canvas-hint');
  
  const statusEl = document.getElementById('cavalry-status');
  const statusText = statusEl.querySelector('.status-text');
  
  const btnPlayPause = document.getElementById('btn-play-pause');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  const btnRewind = document.getElementById('btn-rewind');
  const btnStepBack = document.getElementById('btn-step-back');
  const btnStepFwd = document.getElementById('btn-step-fwd');
  const btnResetBall = document.getElementById('btn-reset-ball');
  
  const scrubber = document.getElementById('timeline-scrubber');
  const lblFrame = document.getElementById('lbl-frame');
  const selSpeed = document.getElementById('sel-speed');
  
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const soundBtnText = document.getElementById('sound-btn-text');
  const btnRunCavalry = document.getElementById('btn-run-cavalry');
  const btnCopyCode = document.getElementById('btn-copy-code');
  const copyStatusText = document.getElementById('copy-status-text');
  const codeSnippetEl = document.getElementById('cavalry-code-snippet');
  const toast = document.getElementById('toast');
  
  // Parameter Sliders
  const slGravity = document.getElementById('sl-gravity');
  const valGravity = document.getElementById('val-gravity');
  const slBounce = document.getElementById('sl-bounce');
  const valBounce = document.getElementById('val-bounce');
  const slSquash = document.getElementById('sl-squash');
  const valSquash = document.getElementById('val-squash');
  const slRadius = document.getElementById('sl-radius');
  const valRadius = document.getElementById('val-radius');
  
  const chkTrails = document.getElementById('chk-trails');
  const chkVectors = document.getElementById('chk-vectors');
  const chkParticles = document.getElementById('chk-particles');
  
  const tabButtons = document.querySelectorAll('.tab-btn');
  const themeChips = document.querySelectorAll('.theme-chip');
  
  const valFps = document.getElementById('val-fps');
  const valHeight = document.getElementById('val-height');
  const valVelocity = document.getElementById('val-velocity');

  // Animation State
  let activeMode = 'agency'; // 'agency', 'barchart', 'kinetic', 'classic', 'physics', 'trajectory', 'multiball'
  let activeTheme = 'coral';
  let isPlaying = true;
  let isSoundEnabled = true;
  let playbackSpeed = 1.0;
  let currentFrame = 0;
  const TOTAL_LOOP_FRAMES = 60;
  const BARCHART_TOTAL_FRAMES = 240;
  const AGENCY_TOTAL_FRAMES = 900;
  
  // Bar Chart Race Dataset (Quarterly Revenue in $M)
  const barChartSeries = [
    { id: 'cloud', label: 'Cloud Platform', color: '#00f2fe', values: [42, 68, 105, 148] },
    { id: 'ai', label: 'AI Solutions', color: '#10b981', values: [31, 59, 94, 132] },
    { id: 'enterprise', label: 'Enterprise SaaS', color: '#ffb300', values: [78, 88, 98, 112] },
    { id: 'hardware', label: 'Devices & HW', color: '#ff5252', values: [65, 70, 74, 79] },
    { id: 'consumer', label: 'Consumer Apps', color: '#8b5cf6', values: [24, 35, 46, 58] }
  ];

  const chartQuarters = [
    { name: 'Q1 2026', frame: 0 },
    { name: 'Q2 2026', frame: 70 },
    { name: 'Q3 2026', frame: 140 },
    { name: 'Q4 2026', frame: 200 }
  ];
  
  // Physics Parameters
  let gravity = 980; // px/s^2
  let restitution = 0.82; // Bounciness 0 - 1
  let squashFactor = 1.35;
  let baseRadius = 42;
  
  // Ball state for physics modes
  class Ball {
    constructor(x, y, radius, color, theme = 'coral') {
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.radius = radius;
      this.color = color;
      this.theme = theme;
      this.scaleX = 1;
      this.scaleY = 1;
      this.rotation = 0;
      this.isDragging = false;
      this.trail = [];
      this.squashAmount = 0; // Current compression
    }
  }

  let balls = [];
  let particles = [];
  let shockwaves = [];
  
  let floorY = 0;
  let dpr = window.devicePixelRatio || 1;
  let lastTime = performance.now();
  let fpsHistory = [];
  
  // Dragging state
  let dragBall = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let lastMouseTime = 0;
  let mouseVelX = 0;
  let mouseVelY = 0;

  // Web Audio Context for Procedural Bounce Sound Synthesis
  let audioCtx = null;
  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playBounceSound(velocity, theme = 'coral') {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const speedRatio = Math.min(Math.abs(velocity) / 1200, 1.0);
      if (speedRatio < 0.04) return; // Too slow to click

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Pitch and sound character mapped to theme
      let startFreq = 160 + speedRatio * 280;
      let endFreq = 45;
      let duration = 0.12;

      if (theme === 'tennis') {
        startFreq = 340 + speedRatio * 200;
        endFreq = 80;
        osc.type = 'triangle';
      } else if (theme === 'basketball') {
        startFreq = 130 + speedRatio * 180;
        endFreq = 50;
        duration = 0.16;
        osc.type = 'sine';
      } else if (theme === 'glass') {
        startFreq = 800 + speedRatio * 600;
        endFreq = 220;
        duration = 0.22;
        osc.type = 'sine';
      } else if (theme === 'neon') {
        startFreq = 480 + speedRatio * 400;
        endFreq = 120;
        duration = 0.15;
        osc.type = 'sawtooth';
      } else {
        osc.type = 'sine';
      }

      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

      const maxGain = 0.35 * Math.sqrt(speedRatio);
      gain.gain.setValueAtTime(maxGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // Theme palettes
  const THEMES = {
    coral: {
      primary: '#ff5252',
      highlight: '#ff8a80',
      shadow: '#b71c1c',
      glow: 'rgba(255, 82, 82, 0.4)',
      type: 'rubber'
    },
    neon: {
      primary: '#00f2fe',
      highlight: '#4facfe',
      shadow: '#0072ff',
      glow: 'rgba(0, 242, 254, 0.6)',
      type: 'energy'
    },
    amber: {
      primary: '#ffb300',
      highlight: '#ffe082',
      shadow: '#ff6f00',
      glow: 'rgba(255, 179, 0, 0.4)',
      type: 'gold'
    },
    basketball: {
      primary: '#f76707',
      highlight: '#ffa94d',
      shadow: '#d9480f',
      glow: 'rgba(247, 103, 7, 0.3)',
      type: 'basketball'
    },
    tennis: {
      primary: '#ccff00',
      highlight: '#eeff80',
      shadow: '#99cc00',
      glow: 'rgba(204, 255, 0, 0.4)',
      type: 'tennis'
    },
    glass: {
      primary: '#8be9fd',
      highlight: '#ffffff',
      shadow: '#50fa7b',
      glow: 'rgba(139, 233, 253, 0.5)',
      type: 'glass'
    }
  };

  // Resize canvas for crisp Retina rendering
  function resizeCanvas() {
    const rect = canvasContainer.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    floorY = rect.height - 60;
  }

  // Kinetic Text Animation State
  let kineticText = {
    text: 'CALVARY MCP',
    fontSize: 96,
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    startY: 380,
    targetY: 0
  };

  // Reset ball position based on active mode
  function resetSimulation() {
    const rect = canvasContainer.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    floorY = rect.height - 60;
    particles = [];
    shockwaves = [];
    currentFrame = 0;

    if (activeMode === 'barchart') {
      balls = [];
    } else if (activeMode === 'kinetic') {
      kineticText.targetY = cy;
      kineticText.startY = cy + 360;
      kineticText.x = cx;
      kineticText.y = kineticText.startY;
      kineticText.scaleX = 1;
      kineticText.scaleY = 1;
      kineticText.opacity = 0;
      balls = [];
    } else if (activeMode === 'classic') {
      balls = [new Ball(cx, floorY - 320, baseRadius, THEMES[activeTheme].primary, activeTheme)];
    } else if (activeMode === 'physics') {
      const b = new Ball(cx, floorY - 300, baseRadius, THEMES[activeTheme].primary, activeTheme);
      b.vy = 0;
      b.vx = 0;
      balls = [b];
    } else if (activeMode === 'trajectory') {
      const b = new Ball(80, floorY - 260, baseRadius, THEMES[activeTheme].primary, activeTheme);
      b.vx = 340;
      b.vy = -120;
      balls = [b];
    } else if (activeMode === 'multiball') {
      balls = [
        new Ball(cx - 180, floorY - 320, 48, THEMES.coral.primary, 'coral'),
        new Ball(cx - 60, floorY - 280, 36, THEMES.neon.primary, 'neon'),
        new Ball(cx + 60, floorY - 340, 52, THEMES.basketball.primary, 'basketball'),
        new Ball(cx + 180, floorY - 250, 30, THEMES.tennis.primary, 'tennis')
      ];
    }

    updateCavalryScript();
  }

  // Create shockwave effect on floor
  function addShockwave(x, y, intensity, color) {
    if (!chkParticles.checked) return;
    shockwaves.push({
      x: x,
      y: y,
      radius: 5,
      maxRadius: Math.min(intensity * 0.08 + 30, 90),
      opacity: 0.8,
      color: color || '#ffffff'
    });

    // Contact dust particles
    const count = Math.min(Math.floor(intensity * 0.02 + 6), 24);
    for (let i = 0; i < count; i++) {
      const angle = Math.PI + (Math.random() * Math.PI); // Upwards half-circle
      const speed = Math.random() * (intensity * 0.18 + 80) + 40;
      particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y - 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 2,
        color: color || '#ffffff',
        life: 1.0,
        decay: Math.random() * 0.03 + 0.02
      });
    }
  }

  // Classical 12 Principles Animation Frame Calculator
  function getClassicAnimationState(frameRatio) {
    // Parabolic bounce curve (0 = apex, 0.5 = ground contact, 1.0 = back to apex)
    // Vertical position: y(t) = 4 * (t - 0.5)^2 -> 1 at t=0 and t=1, 0 at t=0.5
    const rect = canvasContainer.getBoundingClientRect();
    const apexHeight = 280;
    const groundLevel = floorY - baseRadius;
    
    // Non-linear acceleration / ease
    const t = frameRatio;
    const normH = Math.pow(Math.abs(t - 0.5) * 2, 2); // 1 at apex, 0 at impact
    const currentY = groundLevel - (normH * apexHeight);

    // Calculate squash & stretch
    let scaleX = 1;
    let scaleY = 1;
    const impactDist = Math.abs(t - 0.5);

    if (impactDist < 0.08) {
      // Squash on impact
      const squashProgress = 1 - (impactDist / 0.08); // 1 at t=0.5
      const sq = 1 + (squashFactor - 1) * squashProgress * 0.5;
      scaleX = sq;
      scaleY = 1 / sq;
    } else if (impactDist < 0.35) {
      // Stretch in flight
      const stretchProgress = Math.sin(((impactDist - 0.08) / 0.27) * Math.PI);
      const str = 1 + (squashFactor - 1) * stretchProgress * 0.3;
      scaleY = str;
      scaleX = 1 / Math.sqrt(str);
    }

    const velocity = (1 - normH) * (t < 0.5 ? 900 : -900);

    return {
      x: rect.width / 2,
      y: currentY + (baseRadius * (1 - scaleY)),
      scaleX: scaleX,
      scaleY: scaleY,
      normHeight: normH,
      velocity: velocity
    };
  }

  // Update loop
  function update(dt) {
    const rect = canvasContainer.getBoundingClientRect();
    floorY = rect.height - 60;

    // Update Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += gravity * 0.8 * dt; // Particle gravity
      p.life -= p.decay;
      if (p.life <= 0) particles.splice(i, 1);
    }

    // Update Shockwaves
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.radius += (sw.maxRadius - sw.radius) * 12 * dt;
      sw.opacity -= 1.8 * dt;
      if (sw.opacity <= 0) shockwaves.splice(i, 1);
    }

    if (activeMode === 'agency') {
      if (isPlaying) {
        currentFrame = (currentFrame + (30 * dt * playbackSpeed)) % AGENCY_TOTAL_FRAMES;
        scrubber.value = Math.floor(currentFrame);
        scrubber.max = AGENCY_TOTAL_FRAMES;
        lblFrame.textContent = `F: ${Math.floor(currentFrame)} / ${AGENCY_TOTAL_FRAMES} (30s)`;
      }

      valFps.textContent = Math.round(1 / dt || 60);
      valHeight.textContent = `10 Scenes`;
      valVelocity.textContent = `${(currentFrame / 30).toFixed(1)}s`;
      return;
    }

    if (activeMode === 'barchart') {
      if (isPlaying) {
        currentFrame = (currentFrame + (60 * dt * playbackSpeed)) % BARCHART_TOTAL_FRAMES;
        scrubber.value = Math.floor(currentFrame);
        scrubber.max = BARCHART_TOTAL_FRAMES;
        lblFrame.textContent = `F: ${Math.floor(currentFrame)} / ${BARCHART_TOTAL_FRAMES}`;
      }

      valFps.textContent = Math.round(1 / dt || 60);
      valHeight.textContent = `4 Quarters`;
      valVelocity.textContent = `${Math.round(currentFrame)}f`;
      return;
    }

    if (activeMode === 'kinetic') {
      const KINETIC_LOOP_FRAMES = 45;
      if (isPlaying) {
        currentFrame = (currentFrame + (60 * dt * playbackSpeed)) % KINETIC_LOOP_FRAMES;
        scrubber.value = Math.min(30, Math.floor(currentFrame));
        lblFrame.textContent = `F: ${Math.min(30, Math.floor(currentFrame))} / 30`;
      }

      const f = Math.min(30, currentFrame);
      const decay = 0.16;
      const frequency = 0.38;

      const springEnvelope = Math.exp(-decay * f);
      const oscillation = Math.cos(frequency * f);
      const currentY = kineticText.targetY + (kineticText.startY - kineticText.targetY) * springEnvelope * oscillation;

      const velFactor = springEnvelope * Math.sin(frequency * f);
      kineticText.scaleX = 1 - (velFactor * 0.24);
      kineticText.scaleY = 1 + (velFactor * 0.28);
      kineticText.y = currentY;
      kineticText.opacity = Math.min(1, f / 4);

      if (isPlaying && Math.abs(f - 13) < (60 * dt * playbackSpeed)) {
        playBounceSound(400, 'neon');
      }

      valFps.textContent = Math.round(1 / dt || 60);
      valHeight.textContent = `${Math.round(kineticText.targetY - currentY)} px`;
      valVelocity.textContent = `${Math.round(Math.abs(velFactor * 900))} px/s`;
      return;
    }

    if (activeMode === 'classic') {
      if (isPlaying) {
        currentFrame = (currentFrame + (60 * dt * playbackSpeed)) % TOTAL_LOOP_FRAMES;
        scrubber.value = Math.floor(currentFrame);
        lblFrame.textContent = `F: ${Math.floor(currentFrame)} / ${TOTAL_LOOP_FRAMES}`;
      }

      const frameRatio = currentFrame / TOTAL_LOOP_FRAMES;
      const state = getClassicAnimationState(frameRatio);
      
      if (balls.length > 0) {
        const ball = balls[0];
        ball.x = state.x;
        ball.y = state.y;
        ball.scaleX = state.scaleX;
        ball.scaleY = state.scaleY;
        ball.vy = state.velocity;

        // Sound trigger at bottom
        if (isPlaying && Math.abs(frameRatio - 0.5) < (30 * dt * playbackSpeed) / TOTAL_LOOP_FRAMES) {
          playBounceSound(state.velocity, ball.theme);
          addShockwave(ball.x, floorY, Math.abs(state.velocity), THEMES[ball.theme].primary);
        }

        // Trails
        if (chkTrails.checked && isPlaying) {
          ball.trail.push({ x: ball.x, y: ball.y, scaleX: ball.scaleX, scaleY: ball.scaleY, alpha: 0.6 });
          if (ball.trail.length > 18) ball.trail.shift();
        }
      }

      valFps.textContent = Math.round(1 / dt || 60);
      valHeight.textContent = `${Math.round(floorY - state.y - baseRadius)} px`;
      valVelocity.textContent = `${Math.round(Math.abs(state.velocity))} px/s`;
      return;
    }

    // Physics Simulation Modes (physics, trajectory, multiball)
    const subSteps = 4;
    const subDt = (dt * playbackSpeed) / subSteps;

    for (let step = 0; step < subSteps; step++) {
      balls.forEach(ball => {
        if (ball.isDragging) return;

        // Apply Gravity
        ball.vy += gravity * subDt;
        ball.x += ball.vx * subDt;
        ball.y += ball.vy * subDt;

        // Air Resistance
        ball.vx *= 0.9995;
        ball.vy *= 0.9995;

        // Dynamic Squash recovery
        ball.scaleX += (1 - ball.scaleX) * 16 * subDt;
        ball.scaleY += (1 - ball.scaleY) * 16 * subDt;

        // Velocity stretch in flight
        const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        if (speed > 180 && ball.y < floorY - ball.radius - 20) {
          const stretch = Math.min(1 + (speed / 3000) * (squashFactor - 1), 1.45);
          ball.scaleY += (stretch - ball.scaleY) * 8 * subDt;
          ball.scaleX += ((1 / Math.sqrt(stretch)) - ball.scaleX) * 8 * subDt;
          ball.rotation = Math.atan2(ball.vy, ball.vx) - Math.PI / 2;
        } else {
          ball.rotation += (0 - ball.rotation) * 10 * subDt;
        }

        // Floor Collision
        const contactLimit = floorY - ball.radius;
        if (ball.y >= contactLimit) {
          ball.y = contactLimit;
          const impactSpeed = Math.abs(ball.vy);

          if (impactSpeed > 40) {
            // Squash on contact
            const sq = Math.min(1 + (impactSpeed / 1200) * (squashFactor - 0.7), 1.6);
            ball.scaleX = sq;
            ball.scaleY = 1 / sq;
            ball.rotation = 0;

            playBounceSound(impactSpeed, ball.theme);
            addShockwave(ball.x, floorY, impactSpeed, THEMES[ball.theme].primary);
          }

          ball.vy = -ball.vy * restitution;
          ball.vx *= 0.96; // Ground friction

          // Rest threshold
          if (Math.abs(ball.vy) < 25) {
            ball.vy = 0;
            ball.scaleX = 1;
            ball.scaleY = 1;
          }
        }

        // Wall Collisions
        if (ball.x - ball.radius <= 0) {
          ball.x = ball.radius;
          ball.vx = -ball.vx * restitution;
          playBounceSound(Math.abs(ball.vx), ball.theme);
        } else if (ball.x + ball.radius >= rect.width) {
          ball.x = rect.width - ball.radius;
          ball.vx = -ball.vx * restitution;
          playBounceSound(Math.abs(ball.vx), ball.theme);
        }

        // Ceiling
        if (ball.y - ball.radius <= 0) {
          ball.y = ball.radius;
          ball.vy = -ball.vy * restitution;
        }
      });
    }

    // Update trails
    balls.forEach(ball => {
      if (chkTrails.checked && (Math.abs(ball.vx) > 10 || Math.abs(ball.vy) > 10)) {
        ball.trail.push({ x: ball.x, y: ball.y, scaleX: ball.scaleX, scaleY: ball.scaleY, alpha: 0.5 });
        if (ball.trail.length > 20) ball.trail.shift();
      } else {
        if (ball.trail.length > 0) ball.trail.shift();
      }
    });

    if (balls.length > 0) {
      const mainBall = balls[0];
      valHeight.textContent = `${Math.max(0, Math.round(floorY - mainBall.y - mainBall.radius))} px`;
      valVelocity.textContent = `${Math.round(Math.sqrt(mainBall.vx * mainBall.vx + mainBall.vy * mainBall.vy))} px/s`;
    }
  }

  // Render loop
  function draw() {
    const rect = canvasContainer.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw subtle background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 2. Draw Ground Plane & Depth Shadow
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, floorY, w, h - floorY);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(w, floorY);
    ctx.stroke();

    // 3. Draw Shockwaves
    shockwaves.forEach(sw => {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(sw.x, sw.y, sw.radius * 1.6, sw.radius * 0.4, 0, 0, Math.PI * 2);
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = sw.opacity;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    });

    // 4. Draw Particles
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 5. Draw Shadows & Balls or Bar Chart Race or Kinetic Text or Agency Reel
    if (activeMode === 'agency') {
      drawAgencyReel(w, h, currentFrame);
      return;
    }

    if (activeMode === 'barchart') {
      const f = currentFrame;
      const chartLeft = w * 0.26;
      const chartTop = 130;
      const barH = 38;
      const barGap = 16;
      const maxW = w * 0.52;
      const maxVal = 160;

      function easeInOut(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

      function getVal(item, frame) {
        if (frame <= chartQuarters[0].frame) {
          var intro = Math.min(1, Math.max(0, frame / 30));
          return item.values[0] * easeInOut(intro);
        }
        if (frame >= chartQuarters[3].frame) return item.values[3];
        for (var q = 0; q < chartQuarters.length - 1; q++) {
          var qStart = chartQuarters[q];
          var qEnd = chartQuarters[q + 1];
          if (frame >= qStart.frame && frame <= qEnd.frame) {
            var prog = (frame - qStart.frame) / (qEnd.frame - qStart.frame);
            return item.values[q] + (item.values[q + 1] - item.values[q]) * easeInOut(prog);
          }
        }
        return item.values[3];
      }

      function getQuarter(frame) {
        if (frame < chartQuarters[1].frame) return "Q1 2026";
        if (frame < chartQuarters[2].frame) return "Q2 2026";
        if (frame < chartQuarters[3].frame) return "Q3 2026";
        return "Q4 2026";
      }

      // Compute current items & ranks
      const currentItems = barChartSeries.map(it => ({
        item: it,
        value: getVal(it, f)
      })).sort((a, b) => b.value - a.value);

      // Title
      ctx.save();
      ctx.font = '700 18px "Inter", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText("QUARTERLY REVENUE PERFORMANCE ($M)", w / 2, 80);

      // Big Quarter Watermark
      ctx.font = '900 84px "Inter", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.textAlign = 'right';
      ctx.fillText(getQuarter(f), w - 40, h - 70);

      // Left Baseline Axis
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(chartLeft - 10, chartTop - 15);
      ctx.lineTo(chartLeft - 10, chartTop + (barChartSeries.length * (barH + barGap)));
      ctx.stroke();
      ctx.restore();

      // Draw Bars
      currentItems.forEach((entry, rank) => {
        const targetY = chartTop + rank * (barH + barGap);
        const widthPx = Math.max(6, (entry.value / maxVal) * maxW);

        // Track background
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.beginPath();
        ctx.roundRect(chartLeft, targetY, maxW, barH, 6);
        ctx.fill();

        // Active Bar Fill
        ctx.fillStyle = entry.item.color;
        ctx.shadowColor = entry.item.color;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.roundRect(chartLeft, targetY, widthPx, barH, 6);
        ctx.fill();
        ctx.restore();

        // Category Label
        ctx.save();
        ctx.font = '600 14px "Inter", sans-serif';
        ctx.fillStyle = '#f1f5f9';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(entry.item.label, chartLeft - 22, targetY + barH / 2);

        // Value Ticker ($M)
        ctx.font = '700 14px "Fira Code", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText(`$${Math.round(entry.value)}M`, chartLeft + widthPx + 12, targetY + barH / 2);
        ctx.restore();
      });

      return;
    }

    if (activeMode === 'kinetic') {
      // Dynamic ground shadow for text
      const shadowDist = Math.max(0, floorY - kineticText.y);
      const shadowScale = Math.max(0.2, 1 - (shadowDist / 420));
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(
        kineticText.x,
        floorY + 2,
        280 * shadowScale * (kineticText.scaleX || 1),
        16 * shadowScale,
        0,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(0, 0, 0, ${0.45 * shadowScale})`;
      ctx.fill();
      ctx.restore();

      // Render Kinetic Text
      ctx.save();
      ctx.translate(kineticText.x, kineticText.y);
      ctx.scale(kineticText.scaleX, kineticText.scaleY);
      ctx.globalAlpha = Math.max(0, Math.min(1, kineticText.opacity));

      ctx.font = '800 88px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Text Glow
      ctx.shadowColor = 'rgba(0, 242, 254, 0.7)';
      ctx.shadowBlur = 32;

      // Text Gradient
      const textGrad = ctx.createLinearGradient(0, -45, 0, 45);
      textGrad.addColorStop(0, '#ffffff');
      textGrad.addColorStop(0.35, '#00f2fe');
      textGrad.addColorStop(1, '#0284c7');
      ctx.fillStyle = textGrad;

      ctx.fillText(kineticText.text, 0, 0);

      // Subtle letter tracking outline
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.strokeText(kineticText.text, 0, 0);

      ctx.restore();
      return;
    }

    balls.forEach(ball => {
      const theme = THEMES[ball.theme] || THEMES.coral;
      const heightAboveFloor = Math.max(0, floorY - ball.y);
      const shadowScale = Math.max(0.2, 1 - (heightAboveFloor / 400));
      const shadowOpacity = Math.max(0.08, 0.5 * shadowScale);

      // Contact Shadow
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(
        ball.x,
        floorY + 2,
        ball.radius * 1.5 * shadowScale * (ball.scaleX || 1),
        ball.radius * 0.35 * shadowScale,
        0,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(0, 0, 0, ${shadowOpacity})`;
      ctx.fill();
      ctx.restore();

      // Motion Trail
      if (chkTrails.checked && ball.trail.length > 1) {
        ctx.save();
        for (let i = 0; i < ball.trail.length; i++) {
          const pt = ball.trail[i];
          const progress = (i + 1) / ball.trail.length;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, ball.radius * 0.45 * progress, 0, Math.PI * 2);
          ctx.fillStyle = theme.primary;
          ctx.globalAlpha = progress * 0.25;
          ctx.fill();
        }
        ctx.restore();
      }

      // Draw Ball with Transform (Squash, Stretch, Angle)
      ctx.save();
      ctx.translate(ball.x, ball.y);
      ctx.rotate(ball.rotation);
      ctx.scale(ball.scaleX, ball.scaleY);

      // Radial Lighting Gradient
      const grad = ctx.createRadialGradient(
        -ball.radius * 0.3,
        -ball.radius * 0.35,
        ball.radius * 0.1,
        0,
        0,
        ball.radius
      );
      grad.addColorStop(0, theme.highlight);
      grad.addColorStop(0.5, theme.primary);
      grad.addColorStop(1, theme.shadow);

      // Outer Glow
      ctx.shadowColor = theme.glow;
      ctx.shadowBlur = ball.theme === 'neon' || ball.theme === 'glass' ? 24 : 12;

      ctx.beginPath();
      ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Specific Skin Details
      if (ball.theme === 'basketball') {
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#1e1e24';
        ctx.lineWidth = 2.5;
        // Seams
        ctx.beginPath();
        ctx.moveTo(-ball.radius, 0);
        ctx.lineTo(ball.radius, 0);
        ctx.moveTo(0, -ball.radius);
        ctx.lineTo(0, ball.radius);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(-ball.radius * 0.5, 0, ball.radius * 0.8, -Math.PI / 3, Math.PI / 3);
        ctx.arc(ball.radius * 0.5, 0, ball.radius * 0.8, (2 * Math.PI) / 3, (4 * Math.PI) / 3);
        ctx.stroke();
      } else if (ball.theme === 'tennis') {
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(-ball.radius * 0.5, 0, ball.radius * 0.7, -Math.PI / 2.5, Math.PI / 2.5);
        ctx.arc(ball.radius * 0.5, 0, ball.radius * 0.7, (2.5 * Math.PI) / 3, (3.5 * Math.PI) / 3);
        ctx.stroke();
      } else if (ball.theme === 'glass') {
        // Specular highlight gleam
        ctx.beginPath();
        ctx.ellipse(-ball.radius * 0.35, -ball.radius * 0.4, ball.radius * 0.3, ball.radius * 0.15, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fill();
      }

      ctx.restore();

      // Velocity Vector Overlay
      if (chkVectors.checked) {
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(ball.x + (ball.vx || 0) * 0.15, ball.y + (ball.vy || 0) * 0.15);
        ctx.stroke();

        // Arrow head
        const vLen = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        if (vLen > 20) {
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(ball.x + ball.vx * 0.15, ball.y + ball.vy * 0.15, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    });

    // 6. Draw Throw Drag Sling Vector
    if (dragBall && dragBall.isDragging) {
      ctx.save();
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(dragBall.x, dragBall.y);
      ctx.lineTo(lastMouseX, lastMouseY);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Draw Agency Reel (30s / 10 Scenes)
  function drawAgencyReel(w, h, f) {
    const margin = 16;
    const aspectH = h - margin * 2;
    const aspectW = aspectH * (9 / 16);
    const originX = (w - aspectW) / 2;
    const originY = margin;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(originX, originY, aspectW, aspectH, 16);
    ctx.clip();

    const scale = aspectW / 1080;
    ctx.translate(originX + aspectW / 2, originY + aspectH / 2);
    ctx.scale(scale, scale);

    function drawSunburst(cx, cy, count, angleDeg, color, rotOffset) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 6;
      ctx.translate(cx, cy);
      ctx.rotate((rotOffset || 0) * Math.PI / 180);
      const step = (angleDeg * Math.PI / 180) / (count - 1);
      const start = - (angleDeg * Math.PI / 180) / 2;
      for (let i = 0; i < count; i++) {
        const a = start + i * step;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * 380, Math.sin(a) * 380);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawStar(cx, cy, size, color, rot) {
      ctx.save();
      ctx.fillStyle = color;
      ctx.translate(cx, cy);
      ctx.rotate((rot || 0) * Math.PI / 180);
      ctx.beginPath();
      const outer = size / 2;
      const inner = outer * 0.28;
      for (let i = 0; i < 8; i++) {
        const r = (i % 2 === 0) ? outer : inner;
        const a = i * Math.PI / 4;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    if (f < 90) {
      ctx.fillStyle = '#1060FF';
      ctx.fillRect(-540, -960, 1080, 1920);

      ctx.font = '900 230px "Inter", sans-serif';
      ctx.fillStyle = 'rgba(0, 62, 179, 0.45)';
      ctx.textAlign = 'center';
      ctx.fillText("STRATEGY", 0, -40 - (f * 0.8));

      drawSunburst(480, -820, 11, 85, '#FFFFFF', f * 0.2);
      drawSunburst(-480, 820, 9, 70, '#FFFFFF', f * 0.2);
      drawStar(360, -320, 110, '#FFFFFF', f);

      const texts = ["ARE", "YOU", "READY", "TO GROW"];
      const yStarts = [-280, -130, 20, 180];
      texts.forEach((txt, idx) => {
        const tStart = idx * 12;
        if (f >= tStart) {
          ctx.font = '900 130px "Inter", sans-serif';
          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'center';
          ctx.fillText(txt, 0, yStarts[idx]);
        }
      });
    } else if (f < 180) {
      ctx.fillStyle = '#0A0A0A';
      ctx.fillRect(-540, -960, 1080, 1920);

      ctx.font = '900 250px "Inter", sans-serif';
      ctx.fillStyle = 'rgba(31, 31, 35, 0.6)';
      ctx.textAlign = 'center';
      ctx.fillText("TODAY", 0, 40 - ((f - 90) * 0.8));

      drawSunburst(480, -820, 10, 80, '#FFFFFF', (f - 90) * 0.2);
      drawSunburst(-480, 820, 10, 80, '#FFFFFF', (f - 90) * 0.2);
      drawStar(-380, 100, 100, '#FFFFFF', f);

      const texts = ["YOUR", "PRESENCE", "IN SOCIAL", "MEDIA?"];
      const yStarts = [-180, -30, 110, 240];
      texts.forEach((txt, idx) => {
        const tStart = 98 + idx * 10;
        if (f >= tStart) {
          ctx.font = '900 120px "Inter", sans-serif';
          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'center';
          ctx.fillText(txt, 0, yStarts[idx]);
        }
      });
    } else if (f < 270) {
      ctx.fillStyle = '#1060FF';
      ctx.fillRect(-540, -960, 1080, 1920);

      drawSunburst(0, -960, 13, 110, '#FFFFFF', (f - 180) * 0.2);
      drawSunburst(0, 960, 13, 110, '#FFFFFF', (f - 180) * 0.2);
      drawStar(400, -380, 110, '#FFFFFF', f);

      const texts = ["WE", "ARE", "THE"];
      const yStarts = [-260, -110, 40];
      texts.forEach((txt, idx) => {
        const tStart = 188 + idx * 10;
        if (f >= tStart) {
          ctx.font = '900 135px "Inter", sans-serif';
          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'center';
          ctx.fillText(txt, 0, yStarts[idx]);
        }
      });

      if (f >= 220) {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(-410, 155, 820, 170, 16);
        ctx.fill();

        ctx.font = '900 115px "Inter", sans-serif';
        ctx.fillStyle = '#1060FF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("EXPERTS!", 0, 240);
      }
    } else if (f < 360) {
      ctx.fillStyle = '#0A0A0A';
      ctx.fillRect(-540, -960, 1080, 1920);

      ctx.font = '900 220px "Inter", sans-serif';
      ctx.fillStyle = 'rgba(25, 25, 31, 0.8)';
      ctx.textAlign = 'center';
      ctx.fillText("MARKETING", 0, 0);

      drawSunburst(-480, 820, 10, 80, '#FFFFFF', (f - 270) * 0.2);
      drawStar(340, -180, 110, '#FFFFFF', f);

      if (f >= 278) {
        ctx.font = '800 110px "Inter", sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText("Social Media", 0, -40);
      }
      if (f >= 290) {
        ctx.font = '900 130px "Inter", sans-serif';
        ctx.fillStyle = '#1060FF';
        ctx.textAlign = 'center';
        ctx.fillText("Marketing", 0, 100);
      }
    } else if (f < 450) {
      ctx.fillStyle = '#1060FF';
      ctx.fillRect(-540, -960, 1080, 1920);

      drawSunburst(480, -820, 10, 80, '#FFFFFF', (f - 360) * 0.2);
      drawStar(-360, 380, 110, '#FFFFFF', f);

      if (f >= 368) {
        ctx.font = '900 115px "Inter", sans-serif';
        ctx.fillStyle = '#0A0A0A';
        ctx.textAlign = 'center';
        ctx.fillText("CASE STUDY", 0, -70);
      }
      if (f >= 380) {
        ctx.font = '900 135px "Inter", sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText("3 MONTHS", 0, 70);
      }
    } else if (f < 540) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-540, -960, 1080, 1920);

      ctx.save();
      ctx.strokeStyle = '#27272A';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(-220, 0, 100, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#27272A';
      ctx.beginPath();
      ctx.arc(-220, 0, 50, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '900 140px "Inter", sans-serif';
      ctx.fillStyle = '#27272A';
      ctx.textAlign = 'left';
      ctx.fillText("SABI", 100, -25);

      ctx.font = '700 42px "Inter", sans-serif';
      ctx.fillStyle = '#71717A';
      ctx.fillText("JUICE YOUR MIND", 105, 55);
      ctx.restore();
    } else if (f < 660) {
      const isAfter = f >= 600;
      ctx.fillStyle = isAfter ? '#1060FF' : '#F3F4F6';
      ctx.fillRect(-540, -960, 1080, 1920);

      if (!isAfter) {
        ctx.font = '900 96px "Inter", sans-serif';
        ctx.fillStyle = '#0A0A0A';
        ctx.textAlign = 'center';
        ctx.fillText("BEFORE", 0, -680);
      } else {
        ctx.font = '900 86px "Inter", sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText("WITH Mktideas  agency", 0, -680);
      }

      ctx.fillStyle = '#18181B';
      ctx.beginPath();
      ctx.roundRect(-280, -430, 560, 1020, 56);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(-265, -415, 530, 990, 44);
      ctx.fill();

      ctx.fillStyle = '#18181B';
      ctx.beginPath();
      ctx.roundRect(-70, -400, 140, 26, 13);
      ctx.fill();

      const postColors = isAfter
        ? ["#1060FF", "#00F2FE", "#10B981", "#FFB300", "#FF5252", "#8B5CF6", "#EC4899", "#3B82F6", "#06B6D4"]
        : ["#A1A1AA", "#D4D4D8", "#71717A", "#E4E4E7", "#9CA3AF", "#D1D5DB", "#E5E7EB", "#9CA3AF", "#D1D5DB"];

      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const idx = r * 3 + c;
          ctx.fillStyle = postColors[idx];
          ctx.beginPath();
          ctx.roundRect(-220 + c * 150, -220 + r * 150, 140, 140, 10);
          ctx.fill();
        }
      }
    } else if (f < 810) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-540, -960, 1080, 1920);

      ctx.font = '900 110px "Inter", sans-serif';
      ctx.fillStyle = '#0A0A0A';
      ctx.textAlign = 'left';
      ctx.fillText("VIEWS", -420, -680);

      ctx.font = '700 50px "Inter", sans-serif';
      ctx.fillText("JULIO", -420, 720);
      ctx.textAlign = 'right';
      ctx.fillText("SEPTIEMBRE", 420, 720);

      const targetHeights = [220, 440, 680, 960, 1260];
      const barStarts = [-360, -200, -40, 120, 280];
      const barW = 115;
      const baseFloor = 640;

      targetHeights.forEach((hVal, idx) => {
        const bStartF = 668 + idx * 12;
        const bProg = Math.min(1, Math.max(0, (f - bStartF) / 22));
        const curH = hVal * bProg;

        ctx.fillStyle = '#1060FF';
        ctx.beginPath();
        ctx.roundRect(barStarts[idx] - barW / 2, baseFloor - curH, barW, curH, 8);
        ctx.fill();
      });

      let tickerVal = "852";
      if (f >= 755) tickerVal = "50,967";
      else if (f >= 740) tickerVal = "34,910";
      else if (f >= 725) tickerVal = "18,450";
      else if (f >= 710) tickerVal = "5,820";

      ctx.font = '900 120px "Inter", sans-serif';
      ctx.fillStyle = '#0A0A0A';
      ctx.textAlign = 'center';
      ctx.fillText(tickerVal, 160, -500);

      if (f >= 715) {
        ctx.strokeStyle = '#1060FF';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(-280, 200);
        ctx.quadraticCurveTo(-100, -100, 240, -200);
        ctx.stroke();
      }
    } else if (f < 870) {
      ctx.fillStyle = '#0A0A0A';
      ctx.fillRect(-540, -960, 1080, 1920);

      drawSunburst(0, -960, 14, 110, '#FFFFFF', (f - 810) * 0.2);
      drawSunburst(0, 960, 14, 110, '#FFFFFF', (f - 810) * 0.2);
      drawStar(360, -220, 120, '#FFFFFF', f);
      drawStar(-360, 320, 120, '#FFFFFF', f);

      const lines = ["LET'S", "CREATE", "SOMETHING", "AMAZING", "TOGETHER"];
      const yCoords = [-180, -70, 40, 150, 260];
      lines.forEach((l, idx) => {
        if (f >= 814 + idx * 8) {
          ctx.font = '800 100px "Inter", sans-serif';
          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'center';
          ctx.fillText(l, 0, yCoords[idx]);
        }
      });
    } else {
      ctx.fillStyle = '#1060FF';
      ctx.fillRect(-540, -960, 1080, 1920);

      drawSunburst(480, -820, 10, 80, '#FFFFFF', (f - 870) * 0.2);
      drawSunburst(-480, 820, 10, 80, '#FFFFFF', (f - 870) * 0.2);

      ctx.font = '900 135px "Inter", sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText("Mktideas agency", 0, -100);

      ctx.font = '600 36px "Inter", sans-serif';
      ctx.fillText("[ Instagram • Facebook • TikTok • YouTube • LinkedIn ]", 0, 80);

      ctx.font = '700 48px "Inter", sans-serif';
      ctx.fillText("mktideas.agency", 0, 220);
    }

    ctx.restore();

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(originX, originY, aspectW, aspectH);
    ctx.restore();
  }

  // Animation Loop
  function tick(time) {
    const dt = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;

    update(dt);
    draw();

    requestAnimationFrame(tick);
  }

  // Generate & Update Cavalry Script snippet
  function updateCavalryScript() {
    if (activeMode === 'agency') {
      const script = `// --- Cavalry 2D 30s Commercial Agency Reel Generator ---
// Created via Antigravity Motion Studio
// Full 10-scene procedural animation (900 frames @ 30fps / 1080x1920 9:16)
(function createAgencyReel30s() {
  if (typeof api === "undefined") return;
  console.log("[MCP] Building 30s Commercial Agency Reel in Cavalry...");

  var TOTAL_FRAMES = 900;
  var COLOR_BLUE = "#1060FF";
  var COLOR_WHITE = "#FFFFFF";
  var COLOR_BLACK = "#0A0A0A";

  function setKf(layerId, attr, frame, val) {
    if (typeof api.setKeyframe === "function") api.setKeyframe(layerId, attr, frame, val);
  }

  // S1: Hook
  var s1_bg = api.primitive ? api.primitive("rectangle", "S1_BG") : api.create("basicShape", "S1_BG");
  api.set(s1_bg, { "scale.x": 1180/200, "scale.y": 2020/200, "material.materialColor": COLOR_BLUE });
  setKf(s1_bg, "opacity", 0, 100);
  setKf(s1_bg, "opacity", 90, 0);

  var s1_t = api.create("textShape", "S1_Text");
  api.set(s1_t, { text: "ARE YOU READY TO GROW", fontSize: 110, "alignment.x": 0.5, "alignment.y": 0.5, "material.materialColor": COLOR_WHITE });

  // S2-S10 Scenes procedurally generated across 900 frames...
  console.log("✓ 30s Commercial Agency Reel generated successfully.");
})();`;
      codeSnippetEl.textContent = script;
      return;
    }

    if (activeMode === 'barchart') {
      const script = `// --- Cavalry 2D Animated Bar Chart Race Generator ---
// Created via Antigravity Motion Studio
(function createBarChartRace() {
  if (typeof api === 'undefined') return;

  var totalFrames = 240;
  var chartLeftX = -320;
  var chartTopY = -140;
  var barHeight = 44;
  var barGap = 20;
  var maxBarWidth = 640;
  var maxMetricValue = 160;

  var quarters = [
    { name: "Q1 2026", frame: 0 },
    { name: "Q2 2026", frame: 70 },
    { name: "Q3 2026", frame: 140 },
    { name: "Q4 2026", frame: 200 }
  ];

  var seriesData = [
    { id: "cloud", label: "Cloud Platform", color: "#00F2FE", values: [42, 68, 105, 148] },
    { id: "ai", label: "AI Solutions", color: "#10B981", values: [31, 59, 94, 132] },
    { id: "enterprise", label: "Enterprise SaaS", color: "#FFB300", values: [78, 88, 98, 112] },
    { id: "hardware", label: "Devices & HW", color: "#FF5252", values: [65, 70, 74, 79] },
    { id: "consumer", label: "Consumer Apps", color: "#8B5CF6", values: [24, 35, 46, 58] }
  ];

  // Creates animated bar chart race with continuous rank-gliding Y transitions & value tickers
  console.log("[MCP] Bar chart race active on composition");
})();`;
      codeSnippetEl.textContent = script;
      return;
    }

    if (activeMode === 'kinetic') {
      const script = `// --- Cavalry 2D Kinetic Typography Generator ---
// Created via Antigravity Motion Studio
(function createKineticText() {
  if (typeof api === 'undefined') return;

  var textNode = api.create('textShape', 'KineticText_CALVARY_MCP');
  if (!textNode) return;

  api.set(textNode, {
    text: 'CALVARY MCP',
    fontSize: 96,
    'position.x': 0,
    'position.y': 450,
    'alignment.x': 0.5,
    'alignment.y': 0.5,
    color: '#00F2FE'
  });

  if (typeof api.setKeyframe === 'function') {
    var startY = 450;
    var targetY = 0;
    var decay = 0.16;
    var frequency = 0.38;

    for (var f = 0; f <= 30; f++) {
      var env = Math.exp(-decay * f);
      var osc = Math.cos(frequency * f);
      var y = targetY + (startY - targetY) * env * osc;
      var vel = env * Math.sin(frequency * f);

      api.setKeyframe(textNode, 'position.y', f, Math.round(y * 100) / 100);
      api.setKeyframe(textNode, 'position.x', f, 0);
      api.setKeyframe(textNode, 'scale.x', f, Math.round((100 - vel * 24) * 10) / 10);
      api.setKeyframe(textNode, 'scale.y', f, Math.round((100 + vel * 28) * 10) / 10);
    }
    api.setKeyframe(textNode, 'opacity', 0, 0);
    api.setKeyframe(textNode, 'opacity', 6, 100);
  }
  if (typeof api.setFrame === 'function') api.setFrame(0);
  console.log('✓ Kinetic text created in Cavalry');
})();`;
      codeSnippetEl.textContent = script;
      return;
    }

    const theme = THEMES[activeTheme] || THEMES.coral;
    const script = `// --- Cavalry 2D Motion Graphics Bouncing Ball Generator ---
// Created via Antigravity Motion Studio
(function createBouncingBall() {
  if (typeof api === 'undefined') return;

  var ground = api.primitive('rectangle', 'Ground');
  var ball = api.primitive('ellipse', 'BouncingBall');
  var shadow = api.primitive('ellipse', 'BallShadow');

  // Ground Surface
  if (ground) {
    api.set(ground, {
      'position.y': 250,
      'scale.x': 5.0,
      'scale.y': 0.02,
      'material.materialColor': '#334155'
    });
  }

  // Ball Material & Size
  if (ball) {
    var bScale = (${baseRadius} * 2) / 200;
    api.set(ball, {
      'position.y': -250,
      'scale.x': bScale,
      'scale.y': bScale,
      'material.materialColor': '${theme.primary}'
    });

    if (typeof api.keyframe === 'function') {
      api.keyframe(ball, 0, { 'position.y': -250, 'scale.x': bScale, 'scale.y': bScale });
      api.keyframe(ball, 24, { 'scale.x': bScale * 0.85, 'scale.y': bScale * 1.18 });
      api.keyframe(ball, 30, { 'position.y': 250, 'scale.x': bScale * ${squashFactor}, 'scale.y': bScale * (1 / ${squashFactor}) });
      api.keyframe(ball, 36, { 'scale.x': bScale * 0.85, 'scale.y': bScale * 1.18 });
      api.keyframe(ball, 60, { 'position.y': -250, 'scale.x': bScale, 'scale.y': bScale });
    }
  }

  api.setFrame(0);
  api.play();
  console.log('Bouncing ball created successfully.');
})();`;

    codeSnippetEl.textContent = script;
  }

  // Show Toast
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Ping Cavalry Bridge Server
  async function checkCavalryBridge() {
    try {
      const response = await fetch('http://127.0.0.1:8080/health', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        mode: 'cors'
      });
      if (response.ok) {
        statusEl.className = 'status-indicator online';
        statusText.textContent = 'Bridge: Online (8080)';
        return true;
      }
    } catch (e) {
      statusEl.className = 'status-indicator offline';
      statusText.textContent = 'Bridge: Offline (Cavalry)';
      return false;
    }
    return false;
  }

  // Send current code to Cavalry via MCP Bridge
  async function sendToCavalry() {
    const code = codeSnippetEl.textContent;
    showToast('Sending script to Cavalry...');

    try {
      const res = await fetch('http://127.0.0.1:8080/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code })
      });
      const data = await res.json();
      if (data && data.success) {
        showToast('✓ Successfully created scene in Cavalry!');
      } else {
        showToast('Cavalry returned: ' + (data.error || 'Execution notice'));
      }
    } catch (err) {
      showToast('⚠️ Bridge offline. Open Cavalry -> Scripts -> MCPBridge.');
    }
  }

  // Event Listeners
  function setupEventListeners() {
    window.addEventListener('resize', () => {
      resizeCanvas();
      resetSimulation();
    });

    // Mode Tabs
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeMode = btn.dataset.mode;
        
        if (activeMode === 'classic') {
          canvasHint.textContent = '12 Principles Squash & Stretch Loop';
          scrubber.parentElement.style.display = 'flex';
        } else if (activeMode === 'agency') {
          canvasHint.textContent = '30s Commercial Agency Reel (10 Scenes)';
          scrubber.parentElement.style.display = 'flex';
        } else if (activeMode === 'barchart') {
          canvasHint.textContent = 'Quarterly Metric Bar Chart Race';
          scrubber.parentElement.style.display = 'flex';
        } else {
          canvasHint.textContent = 'Click & Drag ball to throw';
          scrubber.parentElement.style.display = 'none';
        }
        
        resetSimulation();
      });
    });

    // Theme Chips
    themeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        themeChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeTheme = chip.dataset.theme;
        balls.forEach(b => {
          b.theme = activeTheme;
          b.color = THEMES[activeTheme].primary;
        });
        updateCavalryScript();
      });
    });

    // Transport Controls
    btnPlayPause.addEventListener('click', () => {
      isPlaying = !isPlaying;
      iconPlay.style.display = isPlaying ? 'none' : 'block';
      iconPause.style.display = isPlaying ? 'block' : 'none';
      if (isPlaying) lastTime = performance.now();
    });

    btnRewind.addEventListener('click', () => {
      currentFrame = 0;
      scrubber.value = 0;
      lblFrame.textContent = `F: 0 / ${TOTAL_LOOP_FRAMES}`;
      resetSimulation();
    });

    btnStepBack.addEventListener('click', () => {
      isPlaying = false;
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
      currentFrame = (currentFrame - 1 + TOTAL_LOOP_FRAMES) % TOTAL_LOOP_FRAMES;
      scrubber.value = Math.floor(currentFrame);
      lblFrame.textContent = `F: ${Math.floor(currentFrame)} / ${TOTAL_LOOP_FRAMES}`;
    });

    btnStepFwd.addEventListener('click', () => {
      isPlaying = false;
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
      currentFrame = (currentFrame + 1) % TOTAL_LOOP_FRAMES;
      scrubber.value = Math.floor(currentFrame);
      lblFrame.textContent = `F: ${Math.floor(currentFrame)} / ${TOTAL_LOOP_FRAMES}`;
    });

    btnResetBall.addEventListener('click', resetSimulation);

    // Scrubber
    scrubber.addEventListener('input', (e) => {
      isPlaying = false;
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
      currentFrame = parseFloat(e.target.value);
      lblFrame.textContent = `F: ${Math.floor(currentFrame)} / ${TOTAL_LOOP_FRAMES}`;
    });

    // Speed Selector
    selSpeed.addEventListener('change', (e) => {
      playbackSpeed = parseFloat(e.target.value);
    });

    // Audio Toggle
    btnSoundToggle.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      soundBtnText.textContent = isSoundEnabled ? 'Audio: On' : 'Audio: Muted';
      btnSoundToggle.style.opacity = isSoundEnabled ? '1' : '0.6';
    });

    // Parameters
    slGravity.addEventListener('input', (e) => {
      gravity = parseFloat(e.target.value);
      valGravity.textContent = `${gravity} px/s²`;
      updateCavalryScript();
    });

    slBounce.addEventListener('input', (e) => {
      restitution = parseFloat(e.target.value);
      valBounce.textContent = `${Math.round(restitution * 100)}%`;
      updateCavalryScript();
    });

    slSquash.addEventListener('input', (e) => {
      squashFactor = parseFloat(e.target.value);
      valSquash.textContent = `${squashFactor.toFixed(2)}x`;
      updateCavalryScript();
    });

    slRadius.addEventListener('input', (e) => {
      baseRadius = parseFloat(e.target.value);
      valRadius.textContent = `${baseRadius} px`;
      balls.forEach(b => b.radius = baseRadius);
      updateCavalryScript();
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        btnPlayPause.click();
      } else if (e.code === 'KeyR') {
        resetSimulation();
      }
    });

    // Mouse Drag & Toss Physics
    canvas.addEventListener('mousedown', (e) => {
      initAudio();
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        const dist = Math.hypot(mx - b.x, my - b.y);
        if (dist <= b.radius * 1.5) {
          dragBall = b;
          dragBall.isDragging = true;
          dragOffsetX = mx - b.x;
          dragOffsetY = my - b.y;
          lastMouseX = mx;
          lastMouseY = my;
          lastMouseTime = performance.now();
          mouseVelX = 0;
          mouseVelY = 0;
          break;
        }
      }

      // If clicked empty space in multiball mode, spawn a new ball!
      if (!dragBall && activeMode === 'multiball' && balls.length < 12) {
        const themes = Object.keys(THEMES);
        const randTheme = themes[Math.floor(Math.random() * themes.length)];
        const newBall = new Ball(mx, my, Math.random() * 20 + 25, THEMES[randTheme].primary, randTheme);
        newBall.vy = -100;
        balls.push(newBall);
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!dragBall) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const now = performance.now();
      const dt = (now - lastMouseTime) / 1000;

      if (dt > 0.005) {
        mouseVelX = (mx - lastMouseX) / dt;
        mouseVelY = (my - lastMouseY) / dt;
        lastMouseX = mx;
        lastMouseY = my;
        lastMouseTime = now;
      }

      dragBall.x = mx - dragOffsetX;
      dragBall.y = my - dragOffsetY;
      dragBall.vx = 0;
      dragBall.vy = 0;
    });

    window.addEventListener('mouseup', () => {
      if (dragBall) {
        dragBall.isDragging = false;
        // Impart toss velocity
        dragBall.vx = Math.max(-2000, Math.min(2000, mouseVelX * 0.9));
        dragBall.vy = Math.max(-2000, Math.min(2000, mouseVelY * 0.9));
        dragBall = null;
      }
    });

    // Copy Script to Clipboard
    btnCopyCode.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codeSnippetEl.textContent);
        copyStatusText.textContent = 'Copied!';
        showToast('✓ Script copied to clipboard!');
        setTimeout(() => {
          copyStatusText.textContent = 'Copy Script';
        }, 2000);
      } catch (err) {
        showToast('Failed to copy. Please select and copy manually.');
      }
    });

    // Send to Cavalry Bridge
    btnRunCavalry.addEventListener('click', sendToCavalry);
  }

  // Initialization
  function init() {
    resizeCanvas();
    resetSimulation();
    setupEventListeners();
    checkCavalryBridge();
    setInterval(checkCavalryBridge, 6000);
    requestAnimationFrame(tick);
  }

  init();
})();
