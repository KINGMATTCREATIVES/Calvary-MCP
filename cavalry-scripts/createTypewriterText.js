/**
 * Cavalry 2D Motion Graphics - Typewriter Text Generator
 * 
 * Creates a typewriter animation for "MATTHEW" with:
 * - Progressive character typing cadence (M -> MA -> MAT -> MATT -> MATTH -> MATTHE -> MATTHEW)
 * - Tactile keystroke micro-bounce (scale punch per character)
 * - Animated blinking typewriter cursor ('|' or cursor rectangle)
 * - Modern monospace / clean typography styling
 */

(function createTypewriterAnimation() {
  if (typeof api === "undefined") {
    console.error("This script must be executed inside Cavalry.");
    return;
  }

  console.log("[MCP] Creating Typewriter Animation for 'MATTHEW' on active composition...");

  var fullText = "MATTHEW";
  var fontSize = 110;
  var textColor = "#00F2FE";       // Electric Cyan / Terminal Teal
  var cursorColor = "#FFFFFF";     // Crisp White Cursor
  var framesPerChar = 6;           // Cadence: 6 frames per letter (~0.1s at 60fps)
  var totalTypingFrames = fullText.length * framesPerChar; // 42 frames
  var holdFrames = 36;             // Cursor blink duration after typing
  var totalFrames = totalTypingFrames + holdFrames;        // 78 frames

  // 1. Create Text Shape Node
  var textNode = api.create("textShape", "Typewriter_MATTHEW");
  if (!textNode) {
    console.error("[MCP] Failed to create textShape layer.");
    return;
  }

  // Set initial text properties
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

  // 2. Create Blinking Cursor Node
  var cursorNode = api.create("basicShape", "Typewriter_Cursor");
  if (cursorNode) {
    api.set(cursorNode, {
      "shapeType": 0, // Rectangle
      "size.x": 6,
      "size.y": fontSize * 0.9,
      "position.x": 0,
      "position.y": 0,
      "color": cursorColor,
      "fillColor": cursorColor
    });
  }

  // 3. Approximate text width tracking for cursor offset
  // Character width estimate for centered monospace/sans font
  var avgCharWidth = fontSize * 0.62;
  var totalWidth = fullText.length * avgCharWidth;
  var textStartX = -(totalWidth / 2);

  // 4. Animate Keyframes
  if (typeof api.setKeyframe === "function") {
    // Initial State at Frame 0
    api.setKeyframe(textNode, "text", 0, "");
    api.setKeyframe(textNode, "scale.x", 0, 100);
    api.setKeyframe(textNode, "scale.y", 0, 100);

    for (var i = 1; i <= fullText.length; i++) {
      var currentSubstr = fullText.substring(0, i);
      var keyFrame = (i - 1) * framesPerChar;

      // Keyframe progressive text string
      api.setKeyframe(textNode, "text", keyFrame, currentSubstr);

      // Keystroke micro-punch (tactile hammer pop)
      api.setKeyframe(textNode, "scale.x", keyFrame, 107);
      api.setKeyframe(textNode, "scale.y", keyFrame, 107);

      var settleFrame = keyFrame + Math.min(3, framesPerChar - 1);
      api.setKeyframe(textNode, "scale.x", settleFrame, 100);
      api.setKeyframe(textNode, "scale.y", settleFrame, 100);

      // Cursor position tracking along typed characters
      if (cursorNode) {
        var cursorX = textStartX + (i * avgCharWidth) + 8;
        api.setKeyframe(cursorNode, "position.x", keyFrame, Math.round(cursorX));
        api.setKeyframe(cursorNode, "position.y", keyFrame, 0);
      }
    }

    // Ensure final text string stays through end frame
    api.setKeyframe(textNode, "text", totalTypingFrames, fullText);
    api.setKeyframe(textNode, "text", totalFrames, fullText);
    api.setKeyframe(textNode, "scale.x", totalFrames, 100);
    api.setKeyframe(textNode, "scale.y", totalFrames, 100);

    // 5. Cursor Blinking Animation (On/Off every 6 frames)
    if (cursorNode) {
      var blinkInterval = 6;
      for (var f = 0; f <= totalFrames; f += blinkInterval) {
        var isVisible = (Math.floor(f / blinkInterval) % 2 === 0);
        var opacityVal = isVisible ? 100 : 0;
        api.setKeyframe(cursorNode, "opacity", f, opacityVal);
        api.setKeyframe(cursorNode, "opacity", Math.min(totalFrames, f + blinkInterval - 1), opacityVal);
      }
      // Hold cursor at final position
      var finalCursorX = textStartX + (fullText.length * avgCharWidth) + 8;
      api.setKeyframe(cursorNode, "position.x", totalTypingFrames, Math.round(finalCursorX));
      api.setKeyframe(cursorNode, "position.x", totalFrames, Math.round(finalCursorX));
    }
  }

  // Rewind playhead to frame 0
  if (typeof api.setFrame === "function") {
    api.setFrame(0);
  }

  console.log("[MCP] ✓ Typewriter animation for 'MATTHEW' created successfully (Frames 0 to " + totalFrames + ")!");
})();
