import axios from "axios";

const flyingBallScript = `
(function createFlyingCometBall() {
  if (typeof api === "undefined") {
    console.error("This script must be executed inside Cavalry.");
    return;
  }

  console.log("[MCP] Creating Flying Comet Ball Animation in Cavalry...");

  var totalFrames = 90;
  var ballRadius = 45;
  var coreColor = "#FFE600";
  var trailColors = ["#FF5E00", "#FF0055", "#B800FF", "#00F2FE"];

  // 1. Create Trail Particles
  var trailCount = 6;
  var trailNodes = [];

  for (var t = trailCount; t >= 1; t--) {
    var trailId = api.primitive("ellipse", "TrailBall_" + t);
    if (trailId) {
      var trailRatio = t / trailCount;
      var trailScale = ((ballRadius * (1 - trailRatio * 0.55)) * 2) / 200;
      api.set(trailId, {
        "scale.x": trailScale,
        "scale.y": trailScale,
        "material.materialColor": trailColors[t % trailColors.length],
        "opacity": Math.round((1 - trailRatio * 0.7) * 60),
        "position.x": -800,
        "position.y": 0
      });
      trailNodes.push({ id: trailId, delay: t * 2 });
    }
  }

  // 2. Create Outer Glow Primitive
  var glowRing = api.primitive("ellipse", "FlyingBall_Glow");
  if (glowRing) {
    var glowScale = (ballRadius * 1.35 * 2) / 200;
    api.set(glowRing, {
      "scale.x": glowScale,
      "scale.y": glowScale,
      "material.materialColor": "#FFAA00",
      "opacity": 40
    });
  }

  // 3. Create Main Flying Ball Primitive
  var mainBall = api.primitive("ellipse", "FlyingBall_Core");
  if (!mainBall) {
    console.error("[MCP] Failed to create main ball layer.");
    return;
  }

  var mainScale = (ballRadius * 2) / 200;
  api.set(mainBall, {
    "scale.x": mainScale,
    "scale.y": mainScale,
    "material.materialColor": coreColor,
    "position.x": -700,
    "position.y": 100
  });

  // 4. Trajectory Function
  function getPathPoint(frame) {
    var progress = frame / totalFrames;
    var x = -700 + (1400 * progress);
    var y = Math.sin(progress * Math.PI * 2.5) * 220 + Math.cos(progress * Math.PI * 1.5) * 80;
    return { x: Math.round(x), y: Math.round(y) };
  }

  // 5. Generate Keyframes
  if (typeof api.keyframe === "function") {
    for (var f = 0; f <= totalFrames; f++) {
      var pt = getPathPoint(f);
      var squishX = 1.0 + Math.abs(Math.sin(f * 0.1)) * 0.25;
      var squishY = 1.0 / squishX;

      api.keyframe(mainBall, f, {
        "position.x": pt.x,
        "position.y": pt.y,
        "scale.x": Math.round(mainScale * squishX * 1000) / 1000,
        "scale.y": Math.round(mainScale * squishY * 1000) / 1000
      });

      if (glowRing) {
        api.keyframe(glowRing, f, {
          "position.x": pt.x,
          "position.y": pt.y
        });
      }

      for (var k = 0; k < trailNodes.length; k++) {
        var delayedFrame = Math.max(0, f - trailNodes[k].delay);
        var trailPt = getPathPoint(delayedFrame);
        api.keyframe(trailNodes[k].id, f, {
          "position.x": trailPt.x,
          "position.y": trailPt.y
        });
      }
    }
  }

  // Rewind and play
  api.setFrame(0);
  api.play();

  console.log("[MCP] ✓ Flying Comet Ball created successfully!");
  return "Flying Comet Ball created successfully!";
})();
`;

async function main() {
  console.log("Dispatching Flying Comet Ball to Cavalry at http://localhost:8080/post...");
  try {
    const res = await axios.post("http://localhost:8080/post", {
      type: "script",
      code: flyingBallScript
    }, {
      timeout: 10000,
      headers: { "Content-Type": "application/json" }
    });

    console.log("[✓] Success! Cavalry response:", res.data);
  } catch (err) {
    console.error("[✗] Error communicating with Cavalry:", err.message);
  }
}

main();
