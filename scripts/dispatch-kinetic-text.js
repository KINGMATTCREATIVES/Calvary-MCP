import axios from "axios";

const kineticTextScript = `
(function() {
  console.log("[MCP] Creating Kinetic Text 'CALVARY MCP' on active composition...");

  // 1. Create textShape layer
  var layerId = api.create("textShape", "CALVARY_MCP_Text");
  if (!layerId) {
    console.error("[MCP] Error: Failed to create textShape node.");
    return;
  }

  // 2. Set attributes: text, font size 96, centered alignment, electric cyan styling
  api.set(layerId, {
    "text": "CALVARY MCP",
    "textString": "CALVARY MCP",
    "fontSize": 96,
    "position.x": 0,
    "position.y": 450,
    "alignment.x": 0.5,
    "alignment.y": 0.5,
    "align.x": 0.5,
    "align.y": 0.5,
    "color": "#00F2FE",
    "fillColor": "#00F2FE"
  });

  // 3. Damped Harmonic Spring Curve (Frames 0 to 30)
  var startFrame = 0;
  var endFrame = 30;
  var startY = 450;  // Starts below viewport
  var targetY = 0;   // Rest position at center
  var decay = 0.16;
  var frequency = 0.38;

  if (typeof api.setKeyframe === "function") {
    for (var f = startFrame; f <= endFrame; f++) {
      var t = f - startFrame;
      var env = Math.exp(-decay * t);
      var osc = Math.cos(frequency * t);
      var currentY = targetY + (startY - targetY) * env * osc;
      var vel = env * Math.sin(frequency * t);

      // Keyframe Y Position
      api.setKeyframe(layerId, "position.y", f, Math.round(currentY * 100) / 100);
      api.setKeyframe(layerId, "position.x", f, 0);

      // Keyframe Secondary Squash & Stretch (Scale X/Y)
      var scaleX = 100 - (vel * 24);
      var scaleY = 100 + (vel * 28);
      api.setKeyframe(layerId, "scale.x", f, Math.round(scaleX * 10) / 10);
      api.setKeyframe(layerId, "scale.y", f, Math.round(scaleY * 10) / 10);
    }

    // Exact rest state at frame 30
    api.setKeyframe(layerId, "position.y", endFrame, targetY);
    api.setKeyframe(layerId, "scale.x", endFrame, 100);
    api.setKeyframe(layerId, "scale.y", endFrame, 100);

    // Fade-in opacity
    api.setKeyframe(layerId, "opacity", startFrame, 0);
    api.setKeyframe(layerId, "opacity", startFrame + 6, 100);
  }

  // Scrub playhead to frame 0
  if (typeof api.setFrame === "function") {
    api.setFrame(0);
  }

  console.log("[MCP] ✓ Successfully created kinetic text 'CALVARY MCP' (fontSize: 96, spring curve 0-30)!");
})();
`;

async function main() {
  try {
    const res = await axios.post("http://localhost:8080/post", { code: kineticTextScript }, { timeout: 5000 });
    console.log("Cavalry Response:", res.data);
    console.log("✓ Animation successfully created in Cavalry active composition.");
  } catch (err) {
    console.error("Error communicating with Cavalry:", err.message);
  }
}

main();
