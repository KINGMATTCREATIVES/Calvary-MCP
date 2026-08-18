import axios from "axios";

const startPosterScript = `
(function createStartKineticPoster() {
  if (typeof api === "undefined") {
    console.error("This script must be executed inside Cavalry.");
    return;
  }

  console.log("[MCP] Creating Editorial Kinetic Typography 'START' Motion Graphic...");

  var totalFrames = 420; // 7.0 seconds at 60 FPS
  var primaryColor = "#0A0A0A";    // Deep Graphic Black
  var secondaryColor = "#1A1A1A";  // Charcoal Black
  var bgColor = "#FFE600";         // Electric Studio Yellow
  var accentColor = "#0A0A0A";     // Sharp Black Accent

  // Easing helper: Professional cubic ease-out with subtle overshoot
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  function easeOutBack(t, s) {
    if (s === undefined) s = 1.15;
    t = t - 1;
    return (t * t * ((s + 1) * t + s) + 1);
  }
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Helper keyframing
  function addKeyframe(layerId, frame, attrs) {
    if (typeof api.keyframe === "function") {
      api.keyframe(layerId, frame, attrs);
    }
  }

  // --- 1. Background & Studio Frame Guides ---
  var bg = api.primitive("rectangle", "Studio_Yellow_Backdrop");
  if (bg) {
    api.set(bg, {
      "position.x": 0,
      "position.y": 0,
      "scale.x": 12.0,   // 2400px wide
      "scale.y": 8.0,    // 1600px tall
      "material.materialColor": bgColor
    });
  }

  // Framing Rules (Top and Bottom Editorial Lines)
  var topRule = api.primitive("rectangle", "Frame_Rule_Top");
  if (topRule) {
    api.set(topRule, {
      "position.x": 0,
      "position.y": -340,
      "scale.x": 0.01,
      "scale.y": 0.01,
      "material.materialColor": primaryColor
    });
  }

  var bottomRule = api.primitive("rectangle", "Frame_Rule_Bottom");
  if (bottomRule) {
    api.set(bottomRule, {
      "position.x": 0,
      "position.y": 340,
      "scale.x": 0.01,
      "scale.y": 0.01,
      "material.materialColor": primaryColor
    });
  }

  // --- 2. Editorial Metadata Labels ---
  var labelTopLeft = api.create("textShape", "Label_Header_Left");
  if (labelTopLeft) {
    api.set(labelTopLeft, {
      "text": "[ DESIGN STUDIO // KINETIC POSTER ]",
      "fontSize": 20,
      "horizontalAlignment": 0, // Left
      "position.x": -520,
      "position.y": -365,
      "opacity": 0,
      "material.materialColor": primaryColor
    });
  }

  var labelTopRight = api.create("textShape", "Label_Header_Right");
  if (labelTopRight) {
    api.set(labelTopRight, {
      "text": "VOL. 01 — 2026",
      "fontSize": 20,
      "horizontalAlignment": 2, // Right
      "position.x": 520,
      "position.y": -365,
      "opacity": 0,
      "material.materialColor": primaryColor
    });
  }

  var labelBottom = api.create("textShape", "Label_Footer");
  if (labelBottom) {
    api.set(labelBottom, {
      "text": "SCENE GROUP / PROCEDURAL 2D MOTION GRAPHICS / VECTOR SYSTEM",
      "fontSize": 18,
      "horizontalAlignment": 1, // Center
      "position.x": 0,
      "position.y": 370,
      "opacity": 0,
      "material.materialColor": primaryColor
    });
  }

  // --- 3. Typographic Multi-Tier Stack ("START") ---
  // Tier 1: Far Upper Echo (Y: -230, Opacity: 18%)
  var textTier1 = api.create("textShape", "Typography_START_FarUpper");
  if (textTier1) {
    api.set(textTier1, {
      "text": "START",
      "fontSize": 125,
      "horizontalAlignment": 1,
      "position.x": 0,
      "position.y": -230,
      "opacity": 0,
      "material.materialColor": secondaryColor
    });
  }

  // Tier 2: Upper Echo (Y: -115, Opacity: 38%)
  var textTier2 = api.create("textShape", "Typography_START_Upper");
  if (textTier2) {
    api.set(textTier2, {
      "text": "START",
      "fontSize": 140,
      "horizontalAlignment": 1,
      "position.x": 0,
      "position.y": -115,
      "opacity": 0,
      "material.materialColor": secondaryColor
    });
  }

  // Tier 3: HERO CENTER (Y: 0, Opacity: 100%, Bold Anchor)
  var textHero = api.create("textShape", "Typography_START_Hero");
  if (textHero) {
    api.set(textHero, {
      "text": "START",
      "fontSize": 165,
      "horizontalAlignment": 1,
      "position.x": 0,
      "position.y": 0,
      "opacity": 0,
      "material.materialColor": primaryColor
    });
  }

  // Tier 4: Lower Echo (Y: 115, Opacity: 38%)
  var textTier4 = api.create("textShape", "Typography_START_Lower");
  if (textTier4) {
    api.set(textTier4, {
      "text": "START",
      "fontSize": 140,
      "horizontalAlignment": 1,
      "position.x": 0,
      "position.y": 115,
      "opacity": 0,
      "material.materialColor": secondaryColor
    });
  }

  // Tier 5: Far Lower Echo (Y: 230, Opacity: 18%)
  var textTier5 = api.create("textShape", "Typography_START_FarLower");
  if (textTier5) {
    api.set(textTier5, {
      "text": "START",
      "fontSize": 125,
      "horizontalAlignment": 1,
      "position.x": 0,
      "position.y": 230,
      "opacity": 0,
      "material.materialColor": secondaryColor
    });
  }

  // Geometric Tag Badge next to Hero Text
  var heroBadge = api.primitive("rectangle", "Hero_Tag_Badge");
  if (heroBadge) {
    api.set(heroBadge, {
      "position.x": 340,
      "position.y": -5,
      "scale.x": 0.55,
      "scale.y": 0.16,
      "opacity": 0,
      "material.materialColor": primaryColor
    });
  }

  var heroBadgeText = api.create("textShape", "Hero_Tag_Text");
  if (heroBadgeText) {
    api.set(heroBadgeText, {
      "text": "NOW",
      "fontSize": 20,
      "horizontalAlignment": 1,
      "position.x": 340,
      "position.y": 2,
      "opacity": 0,
      "material.materialColor": bgColor
    });
  }

  // --- 4. Animation Keyframe Generation (0.0s to 7.0s / 420 frames) ---

  // Phase Timing Definitions (in Frames):
  // 0 - 50: Frame Rules reveal
  // 25 - 90: Hero "START" entry (smooth glide up & overshoot settle)
  // 50 - 110: Tier 2 (Upper) and Tier 4 (Lower) expand outwards
  // 70 - 130: Tier 1 (Far Upper) and Tier 5 (Far Lower) expand outwards
  // 100 - 160: Editorial Labels & Tag Badge reveal
  // 160 - 360: Ambient floating breathing motion & subtle scale parallax
  // 360 - 420: Elegant transition loop

  for (var f = 0; f <= totalFrames; f++) {
    // 1. Frame Rules (Width expansion on top & bottom lines)
    if (f <= 60) {
      var rProg = Math.min(1, Math.max(0, f / 45));
      var rScaleX = easeOutCubic(rProg) * 5.4; // 1080px wide line
      addKeyframe(topRule, f, { "scale.x": Math.round(rScaleX * 1000) / 1000, "scale.y": 0.01 });
      addKeyframe(bottomRule, f, { "scale.x": Math.round(rScaleX * 1000) / 1000, "scale.y": 0.01 });
    } else {
      addKeyframe(topRule, f, { "scale.x": 5.4, "scale.y": 0.01 });
      addKeyframe(bottomRule, f, { "scale.x": 5.4, "scale.y": 0.01 });
    }

    // 2. Hero Center "START" Entry (Frames 25 - 90) + Ambient Wave (Frames 160 - 360)
    var heroY, heroScale, heroOpacity;
    if (f < 25) {
      heroY = 80;
      heroScale = 0.90;
      heroOpacity = 0;
    } else if (f <= 90) {
      var hProg = (f - 25) / 65;
      var hEased = easeOutBack(hProg, 1.1);
      heroY = 80 * (1 - hEased);
      heroScale = 0.90 + (0.10 * hEased);
      heroOpacity = Math.min(100, Math.round(easeOutCubic(hProg) * 100));
    } else if (f <= 360) {
      // Subtle ambient camera drift
      var ambTime = (f - 90) * 0.035;
      heroY = Math.sin(ambTime) * 3; // Micro floating
      heroScale = 1.0 + Math.sin(ambTime * 0.5) * 0.015;
      heroOpacity = 100;
    } else {
      // Loop transition
      var lProg = (f - 360) / 60;
      var lEased = easeInOutCubic(lProg);
      heroY = Math.sin((360 - 90) * 0.035) * 3 * (1 - lEased);
      heroScale = 1.0;
      heroOpacity = 100;
    }
    addKeyframe(textHero, f, {
      "position.y": Math.round(heroY * 10) / 10,
      "scale.x": Math.round(heroScale * 1000) / 1000,
      "scale.y": Math.round(heroScale * 1000) / 1000,
      "opacity": heroOpacity
    });

    // 3. Tier 2 (Upper, Target Y: -115) - Staggered Entry (Frames 45 - 110)
    var t2Y, t2Opacity;
    if (f < 45) {
      t2Y = 0;
      t2Opacity = 0;
    } else if (f <= 110) {
      var p2 = (f - 45) / 65;
      var e2 = easeOutBack(p2, 1.05);
      t2Y = -115 * e2;
      t2Opacity = Math.round(easeOutCubic(p2) * 38);
    } else if (f <= 360) {
      var amb2 = (f - 110) * 0.035;
      t2Y = -115 + (Math.sin(amb2 + 0.5) * 4);
      t2Opacity = 38;
    } else {
      t2Y = -115;
      t2Opacity = 38;
    }
    addKeyframe(textTier2, f, { "position.y": Math.round(t2Y * 10) / 10, "opacity": t2Opacity });

    // 4. Tier 4 (Lower, Target Y: 115) - Staggered Entry (Frames 55 - 120)
    var t4Y, t4Opacity;
    if (f < 55) {
      t4Y = 0;
      t4Opacity = 0;
    } else if (f <= 120) {
      var p4 = (f - 55) / 65;
      var e4 = easeOutBack(p4, 1.05);
      t4Y = 115 * e4;
      t4Opacity = Math.round(easeOutCubic(p4) * 38);
    } else if (f <= 360) {
      var amb4 = (f - 120) * 0.035;
      t4Y = 115 + (Math.sin(amb4 + 1.0) * 4);
      t4Opacity = 38;
    } else {
      t4Y = 115;
      t4Opacity = 38;
    }
    addKeyframe(textTier4, f, { "position.y": Math.round(t4Y * 10) / 10, "opacity": t4Opacity });

    // 5. Tier 1 (Far Upper, Target Y: -230) - Staggered Entry (Frames 65 - 135)
    var t1Y, t1Opacity;
    if (f < 65) {
      t1Y = -115;
      t1Opacity = 0;
    } else if (f <= 135) {
      var p1 = (f - 65) / 70;
      var e1 = easeOutBack(p1, 1.0);
      t1Y = -115 + (-115 * e1);
      t1Opacity = Math.round(easeOutCubic(p1) * 18);
    } else if (f <= 360) {
      var amb1 = (f - 135) * 0.035;
      t1Y = -230 + (Math.sin(amb1 + 0.8) * 5);
      t1Opacity = 18;
    } else {
      t1Y = -230;
      t1Opacity = 18;
    }
    addKeyframe(textTier1, f, { "position.y": Math.round(t1Y * 10) / 10, "opacity": t1Opacity });

    // 6. Tier 5 (Far Lower, Target Y: 230) - Staggered Entry (Frames 75 - 145)
    var t5Y, t5Opacity;
    if (f < 75) {
      t5Y = 115;
      t5Opacity = 0;
    } else if (f <= 145) {
      var p5 = (f - 75) / 70;
      var e5 = easeOutBack(p5, 1.0);
      t5Y = 115 + (115 * e5);
      t5Opacity = Math.round(easeOutCubic(p5) * 18);
    } else if (f <= 360) {
      var amb5 = (f - 145) * 0.035;
      t5Y = 230 + (Math.sin(amb5 + 1.3) * 5);
      t5Opacity = 18;
    } else {
      t5Y = 230;
      t5Opacity = 18;
    }
    addKeyframe(textTier5, f, { "position.y": Math.round(t5Y * 10) / 10, "opacity": t5Opacity });

    // 7. Editorial Labels (Fade & slide in on frames 95 - 150)
    var labelOp, labelYOffset;
    if (f < 95) {
      labelOp = 0;
      labelYOffset = 10;
    } else if (f <= 150) {
      var lp = (f - 95) / 55;
      labelOp = Math.round(easeOutCubic(lp) * 85);
      labelYOffset = 10 * (1 - easeOutCubic(lp));
    } else {
      labelOp = 85;
      labelYOffset = 0;
    }

    addKeyframe(labelTopLeft, f, { "position.y": Math.round((-365 + labelYOffset) * 10) / 10, "opacity": labelOp });
    addKeyframe(labelTopRight, f, { "position.y": Math.round((-365 + labelYOffset) * 10) / 10, "opacity": labelOp });
    addKeyframe(labelBottom, f, { "position.y": Math.round((370 - labelYOffset) * 10) / 10, "opacity": labelOp });

    // 8. Hero Badge "NOW" (Popping in at frame 110 - 150)
    var badgeScale, badgeOp;
    if (f < 110) {
      badgeScale = 0;
      badgeOp = 0;
    } else if (f <= 150) {
      var bp = (f - 110) / 40;
      var be = easeOutBack(bp, 1.25);
      badgeScale = be;
      badgeOp = Math.round(easeOutCubic(bp) * 100);
    } else {
      badgeScale = 1.0;
      badgeOp = 100;
    }
    if (heroBadge) {
      addKeyframe(heroBadge, f, {
        "scale.x": Math.round(0.55 * badgeScale * 1000) / 1000,
        "scale.y": Math.round(0.16 * badgeScale * 1000) / 1000,
        "opacity": badgeOp
      });
    }
    if (heroBadgeText) {
      addKeyframe(heroBadgeText, f, {
        "scale.x": Math.round(badgeScale * 1000) / 1000,
        "scale.y": Math.round(badgeScale * 1000) / 1000,
        "opacity": badgeOp
      });
    }
  }

  // Rewind playhead to frame 0 and start playback
  api.setFrame(0);
  api.play();

  console.log("[MCP] ✓ Editorial Kinetic Typography 'START' Poster created and playing!");
  return "START Kinetic Poster created successfully (420 frames)!";
})();
`;

async function main() {
  console.log("Dispatching START Kinetic Poster to Cavalry at http://localhost:8080/post...");
  try {
    const res = await axios.post("http://localhost:8080/post", {
      type: "script",
      code: startPosterScript
    }, {
      timeout: 15000,
      headers: { "Content-Type": "application/json" }
    });

    console.log("[✓] Success! Cavalry response:", res.data);
    console.log("✓ 'START' kinetic typography animation is now running live in Cavalry.");
  } catch (err) {
    console.error("[✗] Error communicating with Cavalry:", err.message);
  }
}

main();
