import axios from "axios";

const typewriterScript = `
(function createTypewriterAnimation() {
  if (typeof api === "undefined") {
    console.error("This script must be executed inside Cavalry.");
    return;
  }

  console.log("[MCP] Creating Typewriter Animation for 'MATTHEW' on active composition...");

  var fullText = "MATTHEW";
  var fontSize = 110;
  var textColor = "#00F2FE";       // Electric Cyan
  var cursorColor = "#FFFFFF";     // Crisp White Cursor
  var framesPerChar = 6;           // Cadence: 6 frames per letter (~0.1s at 60fps)
  var totalTypingFrames = fullText.length * framesPerChar; // 42 frames
  var holdFrames = 36;             // Cursor blink duration after typing
  var totalFrames = totalTypingFrames + holdFrames;        // 78 frames

  var avgCharWidth = fontSize * 0.62;
  var totalWidth = fullText.length * avgCharWidth;
  var textStartX = -(totalWidth / 2);

  // 1. Create Text Shape Node
  var textNode = api.create("textShape", "Typewriter_MATTHEW");
  if (!textNode) {
    console.error("[MCP] Failed to create textShape layer.");
    return;
  }

  api.set(textNode, {
    "text": "",
    "fontSize": fontSize,
    "position.x": textStartX,
    "position.y": 0,
    "horizontalAlignment": 0,
    "autoWidth": true,
    "material.materialColor": textColor
  });

  // 2. Create Blinking Cursor Primitive (Rectangle)
  var cursorNode = api.primitive("rectangle", "Typewriter_Cursor");
  if (cursorNode) {
    api.set(cursorNode, {
      "scale.x": 0.03, // ~6px wide
      "scale.y": 0.50, // ~100px tall
      "position.x": textStartX + 4,
      "position.y": 0,
      "material.materialColor": cursorColor
    });
  }

  // 3. Animate Keyframes
  if (typeof api.keyframe === "function") {
    // Initial State at Frame 0
    api.keyframe(textNode, 0, { "text": "", "scale.x": 1.0, "scale.y": 1.0 });

    for (var i = 1; i <= fullText.length; i++) {
      var currentSubstr = fullText.substring(0, i);
      var keyFrame = (i - 1) * framesPerChar;

      // Keyframe progressive text string & keystroke punch
      api.keyframe(textNode, keyFrame, {
        "text": currentSubstr,
        "scale.x": 1.07,
        "scale.y": 1.07
      });

      var settleFrame = keyFrame + Math.min(3, framesPerChar - 1);
      api.keyframe(textNode, settleFrame, {
        "scale.x": 1.0,
        "scale.y": 1.0
      });

      // Cursor position tracking along typed characters
      if (cursorNode) {
        var cursorX = textStartX + (i * avgCharWidth) + 8;
        api.keyframe(cursorNode, keyFrame, {
          "position.x": Math.round(cursorX),
          "position.y": 0
        });
      }
    }

    // Ensure final text string stays through end frame
    api.keyframe(textNode, totalTypingFrames, { "text": fullText, "scale.x": 1.0, "scale.y": 1.0 });
    api.keyframe(textNode, totalFrames, { "text": fullText, "scale.x": 1.0, "scale.y": 1.0 });

    // 4. Cursor Blinking Animation (On/Off every 6 frames)
    if (cursorNode) {
      var blinkInterval = 6;
      for (var f = 0; f <= totalFrames; f += blinkInterval) {
        var isVisible = (Math.floor(f / blinkInterval) % 2 === 0);
        var opacityVal = isVisible ? 100 : 0;
        api.keyframe(cursorNode, f, { "opacity": opacityVal });
        api.keyframe(cursorNode, Math.min(totalFrames, f + blinkInterval - 1), { "opacity": opacityVal });
      }
      var finalCursorX = textStartX + (fullText.length * avgCharWidth) + 8;
      api.keyframe(cursorNode, totalTypingFrames, { "position.x": Math.round(finalCursorX) });
      api.keyframe(cursorNode, totalFrames, { "position.x": Math.round(finalCursorX) });
    }
  }

  // Rewind playhead to frame 0
  api.setFrame(0);
  api.play();

  console.log("[MCP] ✓ Typewriter animation for 'MATTHEW' created successfully (Frames 0 to " + totalFrames + ")!");
  return "Typewriter created successfully!";
})();
`;

async function main() {
  console.log("Dispatching typewriter animation for 'MATTHEW' to Cavalry at http://localhost:8080/post...");
  try {
    const res = await axios.post("http://localhost:8080/post", {
      type: "script",
      code: typewriterScript
    }, {
      timeout: 10000,
      headers: { "Content-Type": "application/json" }
    });

    console.log("[✓] Success! Cavalry response:", res.data);
    console.log("✓ 'MATTHEW' typewriter animation created and playing in Cavalry.");
  } catch (err) {
    console.error("[✗] Error communicating with Cavalry:", err.message);
  }
}

main();
