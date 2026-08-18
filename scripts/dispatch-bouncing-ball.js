import axios from "axios";

const bouncingBallScript = `
(function createRichColoredBouncingBall() {
  if (typeof api === "undefined") {
    console.error("This script must be executed inside Cavalry.");
    return;
  }

  console.log("[MCP] Creating Fully Colored 12-Principles Bouncing Ball Animation...");

  // Helper keyframing function
  function addKeyframes(layerId, frame, attrs) {
    if (typeof api.keyframe === "function") {
      api.keyframe(layerId, frame, attrs);
    } else if (typeof api.setKeyframe === "function") {
      for (var k in attrs) {
        if (attrs.hasOwnProperty(k)) {
          api.setKeyframe(layerId, k, frame, attrs[k]);
        }
      }
    }
  }

  // Helper to create and connect a Color Material to a shape
  function createColorMaterial(name, hex, r, g, b, a) {
    var cNode = api.create("color", name);
    if (cNode) {
      api.set(cNode, {
        "color": hex,
        "color.hex": hex,
        "color.r": r !== undefined ? r : 255,
        "color.g": g !== undefined ? g : 255,
        "color.b": b !== undefined ? b : 255,
        "color.a": a !== undefined ? a : 255
      });
    }
    return cNode;
  }

  function applyColorToShape(shapeId, colorNodeId) {
    if (!shapeId || !colorNodeId) return;
    try {
      api.connect(colorNodeId, "id", shapeId, "material");
    } catch (e) {
      console.warn("Could not connect material via id:", e);
    }
  }

  // Configuration
  var totalFrames = 60; // 60fps 1-second seamless loop
  var groundY = 220;
  var apexY = -260;
  var dropHeight = groundY - apexY;
  var radius = 48;

  // --- 1. Materials & Color Nodes (Differentiating each element) ---
  var floorColor = createColorMaterial("Floor_Mat", "#4C566A", 76, 86, 106, 255);            // Sleek Slate Floor Line
  var shadowColor = createColorMaterial("Shadow_Mat", "#111625", 17, 22, 37, 180);          // Dark Navy Shadow
  var ballColor = createColorMaterial("Ball_Mat", "#FF3366", 255, 51, 102, 255);             // Electric Crimson Coral
  var specularColor = createColorMaterial("Specular_Mat", "#FFFFFF", 255, 255, 255, 220);   // Crisp White Specular
  var shockwaveColor = createColorMaterial("Shockwave_Mat", "#FF8A80", 255, 138, 128, 240); // Radiant Peach Shockwave

  // --- 2. Create Layers & Connect Colors ---

  // 2.1 Ground Plane Line
  var ground = api.create("basicShape", "Floor_Line");
  if (ground) {
    api.set(ground, {
      "shapeType": 0, // Rectangle
      "size.x": 1000,
      "size.y": 4,
      "position.x": 0,
      "position.y": groundY + radius
    });
    applyColorToShape(ground, floorColor);
  }

  // 2.2 Dynamic Impact Shockwave Ring
  var shockwave = api.create("basicShape", "Impact_Shockwave");
  if (shockwave) {
    api.set(shockwave, {
      "shapeType": 1, // Circle
      "radius": radius * 0.5,
      "position.x": 0,
      "position.y": groundY + radius - 2,
      "opacity": 0
    });
    applyColorToShape(shockwave, shockwaveColor);
  }

  // 2.3 Ground Contact Shadow
  var shadow = api.create("basicShape", "Ball_Shadow");
  if (shadow) {
    api.set(shadow, {
      "shapeType": 1, // Ellipse
      "size.x": radius * 2.2,
      "size.y": radius * 0.35,
      "position.x": 0,
      "position.y": groundY + radius - 2
    });
    applyColorToShape(shadow, shadowColor);
  }

  // 2.4 Main Bouncing Ball
  var ball = api.create("basicShape", "Bouncing_Ball_Core");
  if (!ball) {
    console.error("[MCP] Error: Failed to create ball layer.");
    return;
  }

  api.set(ball, {
    "shapeType": 1, // Circle
    "radius": radius,
    "position.x": 0,
    "position.y": apexY
  });
  applyColorToShape(ball, ballColor);

  // 2.5 Center Highlight Specular
  var specular = api.create("basicShape", "Ball_Specular");
  if (specular) {
    api.set(specular, {
      "shapeType": 1,
      "radius": radius * 0.28,
      "position.x": -radius * 0.25,
      "position.y": apexY - radius * 0.25,
      "opacity": 75
    });
    applyColorToShape(specular, specularColor);
  }

  // --- 3. Animation Keyframes (Squash & Stretch, Physics Acceleration) ---
  var fImpact = 26;
  var fReboundEnd = 54;

  for (var f = 0; f <= totalFrames; f++) {
    var posY, scaleX, scaleY, shadowScale, shadowOpacity, shockScale = 1, shockOpacity = 0;

    if (f <= fImpact) {
      // Falling phase: Gravity acceleration
      var t = f / fImpact;
      var fallCurve = Math.pow(t, 2.2);
      posY = apexY + (dropHeight * fallCurve);

      if (t < 0.7) {
        var st = t / 0.7;
        scaleX = 100 - (st * 8);
        scaleY = 100 + (st * 8);
      } else if (t < 0.95) {
        var st2 = (t - 0.7) / 0.25;
        scaleX = 92 - (st2 * 14);
        scaleY = 108 + (st2 * 18);
      } else {
        var st3 = (t - 0.95) / 0.05;
        scaleX = 78 + (st3 * 67);
        scaleY = 126 - (st3 * 64);
      }

      shadowScale = 35 + (fallCurve * 75);
      shadowOpacity = 15 + (fallCurve * 65);

    } else if (f <= fImpact + 3) {
      // Immediate rebound recovery
      var rebT = (f - fImpact) / 3;
      posY = groundY - (rebT * 25);
      scaleX = 145 - (rebT * 63);
      scaleY = 62 + (rebT * 58);

      shadowScale = 110 - (rebT * 30);
      shadowOpacity = 80 - (rebT * 25);

      shockScale = 1.0 + (rebT * 2.5);
      shockOpacity = Math.round((1 - rebT) * 90);

    } else if (f <= fReboundEnd) {
      // Ascent phase: Deceleration to apex
      var upT = (f - (fImpact + 3)) / (fReboundEnd - (fImpact + 3));
      var riseCurve = 1 - Math.pow(1 - upT, 1.9);
      posY = (groundY - 25) - ((groundY - 25 - apexY) * riseCurve);

      var stretchRelax = 1 - upT;
      scaleX = 100 - (stretchRelax * 16);
      scaleY = 100 + (stretchRelax * 18);

      shadowScale = 80 - (riseCurve * 45);
      shadowOpacity = 55 - (riseCurve * 40);

    } else {
      // Apex float
      var apexT = (f - fReboundEnd) / (totalFrames - fReboundEnd);
      posY = apexY - (Math.sin(apexT * Math.PI) * 4);
      scaleX = 100;
      scaleY = 100;
      shadowScale = 35;
      shadowOpacity = 15;
    }

    // Apply keyframes
    addKeyframes(ball, f, {
      "position.y": Math.round(posY * 10) / 10,
      "scale.x": Math.round(scaleX * 10) / 10,
      "scale.y": Math.round(scaleY * 10) / 10
    });

    if (specular) {
      addKeyframes(specular, f, {
        "position.y": Math.round((posY - (radius * 0.25 * (scaleY / 100))) * 10) / 10,
        "scale.x": Math.round(scaleX * 0.9 * 10) / 10,
        "scale.y": Math.round(scaleY * 0.9 * 10) / 10
      });
    }

    if (shadow) {
      addKeyframes(shadow, f, {
        "scale.x": Math.round(shadowScale * 10) / 10,
        "scale.y": Math.round(shadowScale * 0.9 * 10) / 10,
        "opacity": Math.round(shadowOpacity)
      });
    }

    if (shockwave) {
      addKeyframes(shockwave, f, {
        "scale.x": Math.round(shockScale * 100) / 100,
        "scale.y": Math.round((shockScale * 0.35) * 100) / 100,
        "opacity": shockOpacity
      });
    }
  }

  // Rewind & Play
  if (typeof api.setFrame === "function") {
    api.setFrame(0);
  }
  if (typeof api.play === "function") {
    api.play();
  }

  console.log("[MCP] ✓ Fully Colored Bouncing Ball generated and playing!");
})();
`;

async function main() {
  console.log("Connecting to Cavalry at http://localhost:8080/post...");
  try {
    const res = await axios.post("http://localhost:8080/post", {
      type: "script",
      code: bouncingBallScript
    }, {
      timeout: 10000,
      headers: { "Content-Type": "application/json" }
    });

    console.log("[✓] Success! Cavalry response:", res.data);
    console.log("✓ Fully Colored Bouncing Ball created and playing in Cavalry.");
  } catch (err) {
    console.error("[✗] Error communicating with Cavalry:", err.message);
  }
}

main();
