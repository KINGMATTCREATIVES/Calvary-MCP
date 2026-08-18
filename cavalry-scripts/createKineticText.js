/**
 * Cavalry 2D Motion Graphics - Kinetic Text Generator
 * 
 * Creates kinetic text 'CALVARY MCP' centered on screen with font size 96,
 * animated with a bouncy spring curve from frame 0 to frame 30.
 * 
 * Usage:
 * 1. In Cavalry: Open Scripts -> Script Editor
 * 2. Paste and run this script (or execute via MCP Bridge `cavalry_run_script`)
 */

(function createKineticTextScene() {
    if (typeof api === "undefined") {
        console.error("This script must be executed inside Cavalry.");
        return;
    }

    try {
        var textString = "CALVARY MCP";
        var fontSize = 96;
        var startFrame = 0;
        var endFrame = 30;
        var startY = 450;  // Starts below the screen
        var targetY = 0;   // Settles at center
        var textColor = "#00F2FE"; // Electric Cyan / Radiant Turquoise

        // 1. Create Text Shape Node
        var textNode = api.create("textShape", "KineticText_CALVARY_MCP");
        if (!textNode) {
            console.error("Failed to create textShape node.");
            return;
        }

        // 2. Set Text Attributes & Center Alignment
        api.set(textNode, {
            "text": textString,
            "textString": textString,
            "fontSize": fontSize,
            "position.x": 0,
            "position.y": startY,
            "alignment.x": 0.5,
            "alignment.y": 0.5,
            "align.x": 0.5,
            "align.y": 0.5,
            "color": textColor,
            "fillColor": textColor
        });

        // 3. Generate Damped Harmonic Spring Keyframes (Bouncy Spring Dynamics)
        // Formula: y(t) = targetY + (startY - targetY) * exp(-decay * t) * cos(frequency * t)
        if (typeof api.setKeyframe === "function") {
            var totalDuration = endFrame - startFrame;
            var decay = 0.16;       // Damping coefficient
            var frequency = 0.38;   // Oscillation frequency

            for (var f = startFrame; f <= endFrame; f++) {
                var t = f - startFrame;
                
                // Spring calculation for Y Position
                var springEnvelope = Math.exp(-decay * t);
                var oscillation = Math.cos(frequency * t);
                var currentY = targetY + (startY - targetY) * springEnvelope * oscillation;

                // Squash & Stretch secondary anticipation / overshoot reaction
                var velFactor = springEnvelope * Math.sin(frequency * t);
                var scaleX = 100 - (velFactor * 24);
                var scaleY = 100 + (velFactor * 28);

                // Set keyframes on position and scale
                api.setKeyframe(textNode, "position.y", f, Math.round(currentY * 100) / 100);
                api.setKeyframe(textNode, "position.x", f, 0);
                api.setKeyframe(textNode, "scale.x", f, Math.round(scaleX * 10) / 10);
                api.setKeyframe(textNode, "scale.y", f, Math.round(scaleY * 10) / 10);
            }

            // Ensure exact rest state at frame 30
            api.setKeyframe(textNode, "position.y", endFrame, targetY);
            api.setKeyframe(textNode, "scale.x", endFrame, 100);
            api.setKeyframe(textNode, "scale.y", endFrame, 100);

            // Opacity fade in across first 6 frames
            api.setKeyframe(textNode, "opacity", startFrame, 0);
            api.setKeyframe(textNode, "opacity", startFrame + 6, 100);
        } else {
            console.log("api.setKeyframe not available; properties initialized at resting state.");
            api.set(textNode, { "position.y": targetY });
        }

        // Scrub playhead to frame 0
        if (typeof api.setFrame === "function") {
            api.setFrame(0);
        }

        console.log("✓ Kinetic text 'CALVARY MCP' (fontSize: 96) with bouncy spring curve (frames 0-30) created successfully!");
        return {
            id: textNode,
            text: textString,
            fontSize: fontSize,
            startFrame: startFrame,
            endFrame: endFrame
        };
    } catch (err) {
        console.error("Error creating kinetic text: " + err.toString());
        throw err;
    }
})();
