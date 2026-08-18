/**
 * Cavalry 2D Motion Graphics - Flying Comet / Energy Ball Generator
 * 
 * Creates a dynamic flying ball animation with:
 * - Smooth swooping 3D/2D S-curve trajectory & bank turns
 * - Tangent velocity auto-rotation & speed-based stretch
 * - Glowing trailing ghost balls (comet tail / speed streak)
 * - Pulsing core energy glow
 * 
 * Execution: Runs directly on active composition in Cavalry via MCP Bridge.
 */

(function createFlyingBallScene() {
  if (typeof api === "undefined") {
    console.error("This script must be executed inside Cavalry.");
    return;
  }

  console.log("[MCP] Creating Flying Ball Animation on active composition...");

  var totalFrames = 90;
  var ballRadius = 38;
  var coreColor = "#FF6B00";     // Radiant Neon Orange
  var glowColor = "#FFAA00";     // Amber Gold
  var trailColors = ["#FF3366", "#FF0077", "#9900FF", "#6600CC"];

  // 1. Create Trailing Ghost Balls (Comet Trail Effect)
  var trailNodes = [];
  var trailCount = 5;
  for (var t = trailCount; t >= 1; t--) {
    var trailId = api.create("basicShape", "TrailBall_" + t);
    if (trailId) {
      var trailRatio = t / trailCount;
      api.set(trailId, {
        "shapeType": 1, // Circle
        "radius": ballRadius * (1 - trailRatio * 0.55),
        "color": trailColors[t % trailColors.length],
        "opacity": Math.round((1 - trailRatio * 0.7) * 60),
        "position.x": -800,
        "position.y": 0
      });
      trailNodes.push({ id: trailId, delay: t * 2 });
    }
  }

  // 2. Create Outer Energy Glow Ring
  var glowRing = api.create("basicShape", "FlyingBall_Glow");
  if (glowRing) {
    api.set(glowRing, {
      "shapeType": 1,
      "radius": ballRadius * 1.35,
      "color": glowColor,
      "opacity": 40
    });
  }

  // 3. Create Main Flying Ball
  var mainBall = api.create("basicShape", "FlyingBall_Core");
  if (!mainBall) {
    console.error("[MCP] Failed to create main ball layer.");
    return;
  }

  api.set(mainBall, {
    "shapeType": 1,
    "radius": ballRadius,
    "color": coreColor,
    "position.x": -700,
    "position.y": 100
  });

  // 4. Trajectory Function: Smooth swooping wave & loop through space
  // Evaluates position (X, Y) at any frame
  function getPathPoint(frame) {
    var progress = frame / totalFrames; // 0 to 1
    // X travels smoothly from -750 to +750
    var x = -750 + (progress * 1500);
    // Y performs a majestic double-swoop with banking apex
    var y = Math.sin(progress * Math.PI * 2.5) * 220 + Math.cos(progress * Math.PI * 4) * 80;
    return { x: x, y: y };
  }

  // 5. Keyframe Animation across 90 frames
  if (typeof api.setKeyframe === "function") {
    for (var f = 0; f <= totalFrames; f++) {
      var pt = getPathPoint(f);
      var nextPt = getPathPoint(Math.min(totalFrames, f + 1));
      var prevPt = getPathPoint(Math.max(0, f - 1));

      // Calculate instantaneous velocity vector and angle
      var dx = nextPt.x - prevPt.x;
      var dy = nextPt.y - prevPt.y;
      var speed = Math.sqrt(dx * dx + dy * dy);
      var angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

      // Dynamic stretch along velocity vector
      var stretchFactor = 100 + Math.min(speed * 3.2, 75);
      var squishCross = 10000 / stretchFactor; // Preserve volume

      // Animate Main Ball
      api.setKeyframe(mainBall, "position.x", f, Math.round(pt.x * 10) / 10);
      api.setKeyframe(mainBall, "position.y", f, Math.round(pt.y * 10) / 10);
      api.setKeyframe(mainBall, "rotation", f, Math.round(angleDeg * 10) / 10);
      api.setKeyframe(mainBall, "scale.x", f, Math.round(stretchFactor * 10) / 10);
      api.setKeyframe(mainBall, "scale.y", f, Math.round(squishCross * 10) / 10);

      // Animate Glow Ring
      if (glowRing) {
        api.setKeyframe(glowRing, "position.x", f, Math.round(pt.x * 10) / 10);
        api.setKeyframe(glowRing, "position.y", f, Math.round(pt.y * 10) / 10);
        api.setKeyframe(glowRing, "rotation", f, Math.round(angleDeg * 10) / 10);
        api.setKeyframe(glowRing, "scale.x", f, Math.round(stretchFactor * 1.15 * 10) / 10);
        api.setKeyframe(glowRing, "scale.y", f, Math.round(squishCross * 1.15 * 10) / 10);
      }

      // Animate Trailing Ghost Particles (Staggered Delay Path)
      for (var k = 0; k < trailNodes.length; k++) {
        var tItem = trailNodes[k];
        var delayedFrame = Math.max(0, f - tItem.delay);
        var trailPt = getPathPoint(delayedFrame);
        var tNext = getPathPoint(Math.min(totalFrames, delayedFrame + 1));
        var tPrev = getPathPoint(Math.max(0, delayedFrame - 1));
        var tAngle = (Math.atan2(tNext.y - tPrev.y, tNext.x - tPrev.x) * 180) / Math.PI;

        api.setKeyframe(tItem.id, "position.x", f, Math.round(trailPt.x * 10) / 10);
        api.setKeyframe(tItem.id, "position.y", f, Math.round(trailPt.y * 10) / 10);
        api.setKeyframe(tItem.id, "rotation", f, Math.round(tAngle * 10) / 10);
      }
    }
  }

  // Rewind playhead to frame 0
  if (typeof api.setFrame === "function") {
    api.setFrame(0);
  }

  console.log("[MCP] ✓ Flying ball animation created on active composition (90 frames)!");
})();
