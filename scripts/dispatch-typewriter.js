import axios from "axios";

const typewriterScript = `
(function createTypewriterInCavalry() {
  api.log("[MCP] Generating typewriter animation for 'MATTHEW' on active composition...");

  var fullText = "MATTHEW";
  var fontSize = 110;
  var textColor = "#00F2FE";       // Vibrant Electric Cyan
  var cursorColor = "#FFFFFF";     // Crisp White Cursor
  var framesPerChar = 6;           // 6 frames per character (~0.1s at 60fps)
  var totalTypingFrames = fullText.length * framesPerChar; // 42 frames
  var holdFrames = 36;             // Blink hold after typing finishes
  var totalFrames = totalTypingFrames + holdFrames;        // 78 frames

  // 1. Create Text Shape Layer
  var textNode = api.create("textShape", "Typewriter_MATTHEW");
  if (!textNode) {
    api.log("[MCP] Error: Failed to create textShape layer.");
    return;
  }

  api.set(textNode, {
    "text": "",
    "textString": "",
    "fontSize": fontSize,
    "position.x": 0,
    "position.y": 0,
    "alignment.x": 0.5,
    "alignment.y": 0.5,
    "align.x": 0.5,
    "align.y": 0.5,
    "color": textColor,
    "fillColor": textColor
  });

  // 2. Create Blinking Cursor Rectangle
  var cursorNode = api.create("basicShape", "Typewriter_Cursor");
  if (cursorNode) {
    api.set(cursorNode, {
      "shapeType": 0, // Rectangle
      "size.x": 6,
      "size.y": fontSize * 0.88,
      "position.x": 0,
      "position.y": 0,
      "color": cursorColor,
      "fillColor": cursorColor
    });
  }

  // 3. Approximate Tracking Offset for Centered Text
  var avgCharWidth = fontSize * 0.62;
  var totalWidth = fullText.length * avgCharWidth;
  var textStartX = -(totalWidth / 2);

  // 4. Animate Progressive Keystrokes & Tactile Hammer Pops
  if (typeof api.setKeyframe === "function") {
    // Initial State at Frame 0
    api.setKeyframe(textNode, "text", 0, "");
    api.setKeyframe(textNode, "scale.x", 0, 100);
    api.setKeyframe(textNode, "scale.y", 0, 100);

    for (var i = 1; i <= fullText.length; i++) {
      var currentSubstr = fullText.substring(0, i);
      var keyFrame = (i - 1) * framesPerChar;

      // Update text string
      api.setKeyframe(textNode, "text", keyFrame, currentSubstr);

      // Keystroke micro-punch
      api.setKeyframe(textNode, "scale.x", keyFrame, 107);
      api.setKeyframe(textNode, "scale.y", keyFrame, 107);

      var settleFrame = keyFrame + 3;
      api.setKeyframe(textNode, "scale.x", settleFrame, 100);
      api.setKeyframe(textNode, "scale.y", settleFrame, 100);

      // Cursor position tracking along typed characters
      if (cursorNode) {
        var cursorX = textStartX + (i * avgCharWidth) + 8;
        api.setKeyframe(cursorNode, "position.x", keyFrame, Math.round(cursorX));
        api.setKeyframe(cursorNode, "position.y", keyFrame, 0);
      }
    }

    // Keep final string steady through end of composition
    api.setKeyframe(textNode, "text", totalTypingFrames, fullText);
    api.setKeyframe(textNode, "text", totalFrames, fullText);
    api.setKeyframe(textNode, "scale.x", totalFrames, 100);
    api.setKeyframe(textNode, "scale.y", totalFrames, 100);

    // 5. Cursor Blinking Cycle (Every 6 frames)
    if (cursorNode) {
      var blinkInterval = 6;
      for (var f = 0; f <= totalFrames; f += blinkInterval) {
        var isVisible = (Math.floor(f / blinkInterval) % 2 === 0);
        var opacityVal = isVisible ? 100 : 0;
        api.setKeyframe(cursorNode, "opacity", f, opacityVal);
        api.setKeyframe(cursorNode, "opacity", Math.min(totalFrames, f + blinkInterval - 1), opacityVal);
      }
      var finalCursorX = textStartX + (fullText.length * avgCharWidth) + 8;
      api.setKeyframe(cursorNode, "position.x", totalTypingFrames, Math.round(finalCursorX));
      api.setKeyframe(cursorNode, "position.x", totalFrames, Math.round(finalCursorX));
    }
  }

  // Rewind playhead to frame 0
  if (typeof api.setFrame === "function") {
    api.setFrame(0);
  }

  api.log("[MCP] ✓ Typewriter animation for 'MATTHEW' successfully created on active composition!");
})();
`;

async function run() {
  try {
    const res = await axios.post("http://localhost:8080/post", { code: typewriterScript }, { timeout: 5000 });
    console.log("Cavalry Response:", res.data);
    console.log("✓ Typewriter animation for 'MATTHEW' successfully created in Cavalry.");
  } catch (err) {
    try {
      const res2 = await axios.post("http://127.0.0.1:8080/post", { code: typewriterScript }, { timeout: 5000 });
      console.log("Cavalry Response (127.0.0.1):", res2.data);
    } catch (err2) {
      console.error("Error communicating with Cavalry bridge:", err.message);
    }
  }
}

run();
