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
  let activeMode = 'kinetic'; // 'kinetic', 'classic', 'physics', 'trajectory', 'multiball'
  let activeTheme = 'coral';
  let isPlaying = true;
  let isSoundEnabled = true;
  let playbackSpeed = 1.0;
  let currentFrame = 0;
  const TOTAL_LOOP_FRAMES = 60;
  
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

    if (activeMode === 'kinetic') {
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

    // 5. Draw Shadows & Balls or Kinetic Text
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

  var ball = api.create('basicShape', 'BouncingBall');
  var shadow = api.create('basicShape', 'BallShadow');
  var ground = api.create('basicShape', 'Ground');

  // Ground Surface
  api.set(ground, {
    shapeType: 0,
    'size.x': 1000,
    'size.y': 4,
    'position.y': 250,
    color: '#334155'
  });

  // Ball Material & Size
  api.set(ball, {
    shapeType: 1,
    radius: ${baseRadius},
    color: '${theme.primary}',
    'position.y': -250
  });

  // Animated Keyframes (Squash & Stretch)
  if (typeof api.setKeyframe === 'function') {
    // Apex -> Ground Impact -> Rebound
    api.setKeyframe(ball, 'position.y', 0, -250);
    api.setKeyframe(ball, 'position.y', 30, 250);
    api.setKeyframe(ball, 'position.y', 60, -250);

    // Scale X/Y Squash & Stretch
    api.setKeyframe(ball, 'scale.x', 0, 100);
    api.setKeyframe(ball, 'scale.y', 0, 100);

    api.setKeyframe(ball, 'scale.x', 24, 85);
    api.setKeyframe(ball, 'scale.y', 24, 118);

    api.setKeyframe(ball, 'scale.x', 30, ${Math.round(squashFactor * 100)});
    api.setKeyframe(ball, 'scale.y', 30, ${Math.round((1 / squashFactor) * 100)});

    api.setKeyframe(ball, 'scale.x', 36, 85);
    api.setKeyframe(ball, 'scale.y', 36, 118);

    api.setKeyframe(ball, 'scale.x', 60, 100);
    api.setKeyframe(ball, 'scale.y', 60, 100);
  }
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
