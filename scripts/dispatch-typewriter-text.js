import axios from "axios";

const typewriterScript = `
(function createTypewriterMATTHEW() {
  if (typeof api === "undefined") {
    console.error("This script must be executed inside Cavalry.");
    return;
  }

  console.log("[MCP] Creating Typewriter Animation for 'MATTHEW' in Cavalry...");

  var textString = "MATTHEW";
  var fontSize = 120;
  var framesPerChar = 7; // Cadence: 7 frames (~0.12s) per letter
  var totalTypingFrames = textString.length * framesPerChar; // 49 frames
  var holdFrames = 42; // Cursor blinks after typing completes
  var totalFrames = totalTypingFrames + holdFrames; // 91 frames

  // Character width tracking for cursor offset
  var avgCharWidth = fontSize * 0.65;
  var totalWidth = textString.length * avgCharWidth;
  var startX = -(totalWidth / 2);

  // 1. Create Dark Sleek Terminal Card Backdrop
  var bg = api.primitive("rectangle", "Typewriter_Backdrop");
  if (bg) {
    api.set(bg, {
      "position.x": 0,
      "position.y": 0,
      "scale.x": 4.5,     // 900px wide
      "scale.y": 1.2,     // 240px tall
      "material.materialColor": "#0F141C" // Deep Dark Slate
    });
  }

  // 2. Create Text Shape Node
  var textNode = api.create("textShape", "Typewriter_MATTHEW");
  if (!textNode) {
    console.error("[MCP] Failed to create textShape layer.");
    return;
  }

  api.set(textNode, {
    "text": "",
    "fontSize": fontSize,
    "position.x": startX,
    "position.y": 0,
    "horizontalAlignment": 0, // Left-aligned at startX
    "autoWidth": true,
    "material.materialColor": "#00F2FE" // Electric Cyan
  });

  // 3. Create Blinking Typewriter Cursor
  var cursor = api.primitive("rectangle", "Typewriter_Cursor");
  if (cursor) {
    api.set(cursor, {
      "position.x": startX + 4,
      "position.y": 0,
      "scale.x": 0.04,   // 8px wide
      "scale.y": 0.55,   // 110px tall
      "material.materialColor": "#FFFFFF" // Crisp White
    });
  }

  // 4. Animate Progressive Typing & Keystroke Punch
  if (typeof api.keyframe === "function") {
    // Frame 0: Initial empty state
    api.keyframe(textNode, 0, {
      "text": "",
      "scale.x": 1.0,
      "scale.y": 1.0
    });

    for (var i = 1; i <= textString.length; i++) {
      var sub = textString.substring(0, i);
      var f = (i - 1) * framesPerChar;

      // Keystroke letter appear + tactile micro-punch
      api.keyframe(textNode, f, {
        "text": sub,
        "scale.x": 1.06,
        "scale.y": 1.06
      });

      // Settle back to normal size
      var fSettle = f + 3;
      api.keyframe(textNode, fSettle, {
        "scale.x": 1.0,
        "scale.y": 1.0
      });

      // Advance cursor to the right of the latest character
      if (cursor) {
        var cursorX = startX + (i * avgCharWidth) + 8;
        api.keyframe(cursor, f, {
          "position.x": Math.round(cursorX)
        });
      }
    }

    // Hold final string through end of composition
    api.keyframe(textNode, totalTypingFrames, { "text": textString, "scale.x": 1.0, "scale.y": 1.0 });
    api.keyframe(textNode, totalFrames, { "text": textString, "scale.x": 1.0, "scale.y": 1.0 });

    // 5. Cursor Blinking Keyframes (6-frame toggle cadence)
    if (cursor) {
      var blinkCadence = 6;
      for (var b = 0; b <= totalFrames; b += blinkCadence) {
        var on = (Math.floor(b / blinkCadence) % 2 === 0);
        var op = on ? 100 : 0;
        api.keyframe(cursor, b, { "opacity": op });
        api.keyframe(cursor, Math.min(totalFrames, b + blinkCadence - 1), { "opacity": op });
      }

      // Final hold position for cursor
      var finalCursorX = startX + (textString.length * avgCharWidth) + 8;
      api.keyframe(cursor, totalTypingFrames, { "position.x": Math.round(finalCursorX) });
      api.keyframe(cursor, totalFrames, { "position.x": Math.round(finalCursorX) });
    }
  }

  // Rewind playhead to frame 0 and trigger playback
  api.setFrame(0);
  api.play();

  console.log("[MCP] ✓ Typewriter animation for 'MATTHEW' generated and playing!");
  return "Typewriter MATTHEW created successfully!";
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
