/**
 * Cavalry 2D Motion Graphics - 30-Second Commercial Agency Reel & Case Study
 * 
 * Recreates the complete 9:16 vertical motion graphics case study:
 * 1. Scene 1 (0-3s / F0-90): Cobalt Blue Hook + Sunbursts + Stars + "ARE YOU READY TO GROW"
 * 2. Scene 2 (3-6s / F90-180): Circular Iris Transition + Obsidian Black + "YOUR PRESENCE IN SOCIAL MEDIA?"
 * 3. Scene 3 (6-9s / F180-270): Cobalt Blue + "WE ARE THE" + Boxed Pill "EXPERTS!"
 * 4. Scene 4 (9-12s / F270-360): Obsidian Black + Two-Tone "Social Media Marketing" + Outline Watermark
 * 5. Scene 5 (12-14s / F360-450): Cobalt Blue + Rapid Impact "CASE STUDY" -> "3 MONTHS"
 * 6. Scene 6 (14-17s / F450-540): Pure White Backdrop + "SABI - JUICE YOUR MIND" Client Reveal
 * 7. Scene 7 (17-21s / F540-660): Smartphone Device Mockup ("BEFORE" -> "WITH Mktideas agency")
 * 8. Scene 8 (21-26s / F660-810): Data Growth Bar Chart + Dynamic Trend Arrow + 852 -> 50,967 View Ticker
 * 9. Scene 9 (26-28s / F780-870): Obsidian Black Luxury Card + "LET'S CREATE SOMETHING AMAZING TOGETHER"
 * 10. Scene 10 (28-30s / F870-900): Cobalt Blue Outro + "Mktideas agency" Branding + Platform Suite
 * 
 * Execution:
 * Execute via Cavalry MCP (`cavalry_run_script`) or paste in Cavalry Scripts -> Script Editor.
 */

(function createAgencyReel30s() {
  if (typeof api === "undefined") {
    console.error("This script must be executed inside Cavalry.");
    return;
  }

  api.log("[MCP] Building 30s Commercial Agency Reel Animation in Cavalry...");

  try {
    // --- Global Configuration ---
    var TOTAL_FRAMES = 900; // 30 seconds @ 30fps
    var COMP_WIDTH = 1080;
    var COMP_HEIGHT = 1920;

    // Color Palette Tokens
    var COLOR_BLUE = "#1060FF";     // Cobalt Blue
    var COLOR_DARK_BLUE = "#003EB3";
    var COLOR_WHITE = "#FFFFFF";    // Pure Crisp White
    var COLOR_BLACK = "#0A0A0A";    // Deep Obsidian Black
    var COLOR_GRAY_BG = "#F3F4F6";  // Platinum Light Gray
    var COLOR_GRAY_TEXT = "#71717A";
    var COLOR_GOLD = "#FFB300";

    // --- Helper Functions ---
    function setKf(layerId, attr, frame, val) {
      if (typeof api.setKeyframe === "function") {
        api.setKeyframe(layerId, attr, frame, val);
      }
    }

    function createColorMat(name, hex) {
      var node = api.create("color", name);
      if (node) {
        api.set(node, {
          "color": hex,
          "color.hex": hex
        });
      }
      return node;
    }

    function createTextLayer(name, text, fontSize, x, y, colorHex, alignX, alignY) {
      var node = api.create("textShape", name);
      if (node) {
        api.set(node, {
          "text": text,
          "textString": text,
          "fontSize": fontSize,
          "position.x": x !== undefined ? x : 0,
          "position.y": y !== undefined ? y : 0,
          "alignment.x": alignX !== undefined ? alignX : 0.5,
          "alignment.y": alignY !== undefined ? alignY : 0.5,
          "material.materialColor": colorHex || COLOR_WHITE
        });
      }
      return node;
    }

    function createRectLayer(name, w, h, x, y, colorHex, cornerRadius) {
      var node = api.primitive ? api.primitive("rectangle", name) : api.create("basicShape", name);
      if (node) {
        var scaleX = w / 200;
        var scaleY = h / 200;
        api.set(node, {
          "position.x": x !== undefined ? x : 0,
          "position.y": y !== undefined ? y : 0,
          "scale.x": scaleX,
          "scale.y": scaleY,
          "material.materialColor": colorHex || COLOR_WHITE,
          "cornerRadius": cornerRadius || 0
        });
      }
      return node;
    }

    function createCircleLayer(name, diameter, x, y, colorHex) {
      var node = api.primitive ? api.primitive("ellipse", name) : api.create("basicShape", name);
      if (node) {
        var s = diameter / 200;
        api.set(node, {
          "position.x": x !== undefined ? x : 0,
          "position.y": y !== undefined ? y : 0,
          "scale.x": s,
          "scale.y": s,
          "material.materialColor": colorHex || COLOR_WHITE
        });
      }
      return node;
    }

    function createStarLayer(name, size, x, y, colorHex) {
      var node = api.primitive ? api.primitive("star", name) : api.create("basicShape", name);
      if (node) {
        var s = size / 200;
        api.set(node, {
          "position.x": x !== undefined ? x : 0,
          "position.y": y !== undefined ? y : 0,
          "scale.x": s,
          "scale.y": s,
          "points": 4,
          "innerRadiusRatio": 0.28,
          "material.materialColor": colorHex || COLOR_WHITE
        });
      }
      return node;
    }

    function animateVisibility(layerId, inFrame, outFrame, fadeDuration) {
      if (!layerId) return;
      fadeDuration = fadeDuration || 5;
      // Start hidden
      setKf(layerId, "opacity", Math.max(0, inFrame - 1), 0);
      setKf(layerId, "opacity", inFrame, 0);
      setKf(layerId, "opacity", inFrame + fadeDuration, 100);
      // Hold until outFrame
      setKf(layerId, "opacity", Math.max(inFrame + fadeDuration, outFrame - fadeDuration), 100);
      setKf(layerId, "opacity", outFrame, 0);
      setKf(layerId, "opacity", outFrame + 1, 0);
    }

    function animateSpringPopIn(layerId, startFrame, duration, baseScaleX, baseScaleY) {
      if (!layerId) return;
      var decay = 0.22;
      var freq = 0.55;
      for (var f = 0; f <= duration; f++) {
        var t = f;
        var env = Math.exp(-decay * t);
        var osc = Math.cos(freq * t);
        var sFactor = 1 - env * osc;
        setKf(layerId, "scale.x", startFrame + f, Math.round(baseScaleX * sFactor * 1000) / 1000);
        setKf(layerId, "scale.y", startFrame + f, Math.round(baseScaleY * sFactor * 1000) / 1000);
      }
      setKf(layerId, "scale.x", startFrame + duration, baseScaleX);
      setKf(layerId, "scale.y", startFrame + duration, baseScaleY);
    }

    // Helper to create a Corner Sunburst Ray Fan
    function createSunburstFan(prefix, cornerX, cornerY, rayCount, fanAngle, startFrame, endFrame, colorHex) {
      var fanGroup = [];
      var rayLength = 360;
      var rayThickness = 5;
      var angleStep = fanAngle / (rayCount - 1);
      var startAngle = -fanAngle / 2;

      for (var i = 0; i < rayCount; i++) {
        var angleDeg = startAngle + i * angleStep;
        var ray = createRectLayer(prefix + "_Ray_" + i, rayThickness, rayLength, cornerX, cornerY, colorHex || COLOR_WHITE, 2);
        if (ray) {
          // Set initial rotation and keyframe subtle oscillating or rotating motion
          var rotZ = angleDeg;
          api.set(ray, {
            "rotation.z": rotZ,
            "anchor.y": 0 // rotate from corner base
          });
          // Subtle rotation drift over the scene duration
          setKf(ray, "rotation.z", startFrame, rotZ);
          setKf(ray, "rotation.z", endFrame, rotZ + 18);
          animateVisibility(ray, startFrame, endFrame, 6);
          fanGroup.push(ray);
        }
      }
      return fanGroup;
    }

    // =========================================================================
    // SCENE 1: THE HOOK (Frames 0 - 90 / 0s - 3s)
    // Blue Background + Sunburst Fans + Stars + "ARE YOU READY TO GROW"
    // =========================================================================
    api.log("[Scene 1] Building Hook...");
    var s1_bg = createRectLayer("S1_BG", COMP_WIDTH + 100, COMP_HEIGHT + 100, 0, 0, COLOR_BLUE);
    animateVisibility(s1_bg, 0, 90, 1);

    // Outline watermark text in background
    var s1_watermark = createTextLayer("S1_Watermark", "STRATEGY", 260, 0, -80, COLOR_DARK_BLUE);
    if (s1_watermark) {
      api.set(s1_watermark, { "opacity": 35 });
      setKf(s1_watermark, "position.y", 0, -40);
      setKf(s1_watermark, "position.y", 90, -120);
      animateVisibility(s1_watermark, 0, 90, 8);
    }

    // Top-Right & Bottom-Left Sunburst Fans
    createSunburstFan("S1_TR", 480, -820, 11, 85, 0, 90, COLOR_WHITE);
    createSunburstFan("S1_BL", -480, 820, 9, 70, 0, 90, COLOR_WHITE);

    // Sparkle Star 1
    var s1_star = createStarLayer("S1_Star", 120, 360, -320, COLOR_WHITE);
    if (s1_star) {
      animateVisibility(s1_star, 10, 90, 6);
      animateSpringPopIn(s1_star, 10, 20, 0.6, 0.6);
      setKf(s1_star, "rotation.z", 10, 0);
      setKf(s1_star, "rotation.z", 90, 90);
    }

    // Kinetic Typography: "ARE" -> "YOU" -> "READY" -> "TO GROW"
    var s1_t1 = createTextLayer("S1_T1", "ARE", 130, 0, -280, COLOR_WHITE);
    var s1_t2 = createTextLayer("S1_T2", "YOU", 140, 0, -130, COLOR_WHITE);
    var s1_t3 = createTextLayer("S1_T3", "READY", 130, 0, 20, COLOR_WHITE);
    var s1_t4 = createTextLayer("S1_T4", "TO GROW", 140, 0, 180, COLOR_WHITE);

    [s1_t1, s1_t2, s1_t3, s1_t4].forEach(function(tNode, idx) {
      if (!tNode) return;
      var fStart = idx * 12;
      setKf(tNode, "position.y", fStart, -280 + idx * 150 + 60);
      setKf(tNode, "position.y", fStart + 16, -280 + idx * 150);
      animateVisibility(tNode, fStart, 90, 4);
      animateSpringPopIn(tNode, fStart, 18, 1, 1);
    });

    // =========================================================================
    // SCENE 2: THE CHALLENGE (Frames 90 - 180 / 3s - 6s)
    // Circular Iris Transition -> Obsidian Black + "YOUR PRESENCE IN SOCIAL MEDIA?"
    // =========================================================================
    api.log("[Scene 2] Building The Challenge...");
    var s2_iris = createCircleLayer("S2_Iris_BG", 2800, 0, 0, COLOR_BLACK);
    if (s2_iris) {
      var maxScale = 2800 / 200;
      setKf(s2_iris, "scale.x", 90, 0);
      setKf(s2_iris, "scale.y", 90, 0);
      setKf(s2_iris, "scale.x", 110, maxScale);
      setKf(s2_iris, "scale.y", 110, maxScale);
      animateVisibility(s2_iris, 90, 180, 1);
    }

    var s2_watermark = createTextLayer("S2_Watermark", "TODAY", 280, 0, 0, "#1F1F23");
    if (s2_watermark) {
      api.set(s2_watermark, { "opacity": 40 });
      setKf(s2_watermark, "position.y", 90, 40);
      setKf(s2_watermark, "position.y", 180, -40);
      animateVisibility(s2_watermark, 95, 180, 8);
    }

    createSunburstFan("S2_TR", 480, -820, 10, 80, 95, 180, COLOR_WHITE);
    createSunburstFan("S2_BL", -480, 820, 10, 80, 95, 180, COLOR_WHITE);

    var s2_star = createStarLayer("S2_Star", 110, -380, 100, COLOR_WHITE);
    if (s2_star) {
      animateVisibility(s2_star, 105, 180, 6);
      animateSpringPopIn(s2_star, 105, 18, 0.55, 0.55);
      setKf(s2_star, "rotation.z", 105, 0);
      setKf(s2_star, "rotation.z", 180, 80);
    }

    var s2_t1 = createTextLayer("S2_T1", "YOUR", 125, 0, -180, COLOR_WHITE);
    var s2_t2 = createTextLayer("S2_T2", "PRESENCE", 130, 0, -30, COLOR_WHITE);
    var s2_t3 = createTextLayer("S2_T3", "IN SOCIAL", 115, 0, 110, COLOR_WHITE);
    var s2_t4 = createTextLayer("S2_T4", "MEDIA?", 125, 0, 240, COLOR_WHITE);

    [s2_t1, s2_t2, s2_t3, s2_t4].forEach(function(tNode, idx) {
      if (!tNode) return;
      var fStart = 98 + idx * 10;
      setKf(tNode, "position.y", fStart, -180 + idx * 140 + 50);
      setKf(tNode, "position.y", fStart + 14, -180 + idx * 140);
      animateVisibility(tNode, fStart, 180, 4);
      animateSpringPopIn(tNode, fStart, 16, 1, 1);
    });

    // =========================================================================
    // SCENE 3: THE SOLUTION / BOXED PILL (Frames 180 - 270 / 6s - 9s)
    // Blue Background + "WE ARE THE" + Solid Boxed Pill "EXPERTS!"
    // =========================================================================
    api.log("[Scene 3] Building Solution & Boxed Pill...");
    var s3_iris = createCircleLayer("S3_Iris_BG", 2800, 0, 0, COLOR_BLUE);
    if (s3_iris) {
      var maxScale = 2800 / 200;
      setKf(s3_iris, "scale.x", 180, 0);
      setKf(s3_iris, "scale.y", 180, 0);
      setKf(s3_iris, "scale.x", 198, maxScale);
      setKf(s3_iris, "scale.y", 198, maxScale);
      animateVisibility(s3_iris, 180, 270, 1);
    }

    createSunburstFan("S3_Top", 0, -960, 13, 110, 185, 270, COLOR_WHITE);
    createSunburstFan("S3_Btm", 0, 960, 13, 110, 185, 270, COLOR_WHITE);

    var s3_star = createStarLayer("S3_Star", 120, 400, -380, COLOR_WHITE);
    if (s3_star) {
      animateVisibility(s3_star, 195, 270, 6);
      animateSpringPopIn(s3_star, 195, 18, 0.6, 0.6);
      setKf(s3_star, "rotation.z", 195, 0);
      setKf(s3_star, "rotation.z", 270, 90);
    }

    var s3_t1 = createTextLayer("S3_T1", "WE", 140, 0, -260, COLOR_WHITE);
    var s3_t2 = createTextLayer("S3_T2", "ARE", 140, 0, -110, COLOR_WHITE);
    var s3_t3 = createTextLayer("S3_T3", "THE", 130, 0, 40, COLOR_WHITE);

    [s3_t1, s3_t2, s3_t3].forEach(function(tNode, idx) {
      if (!tNode) return;
      var fStart = 188 + idx * 10;
      animateVisibility(tNode, fStart, 270, 4);
      animateSpringPopIn(tNode, fStart, 16, 1, 1);
    });

    // Boxed Pill with Inverted Text
    var s3_box = createRectLayer("S3_Box", 820, 170, 0, 240, COLOR_WHITE, 12);
    var s3_box_text = createTextLayer("S3_Box_Text", "EXPERTS!", 120, 0, 240, COLOR_BLUE);
    if (s3_box && s3_box_text) {
      animateVisibility(s3_box, 220, 270, 4);
      animateVisibility(s3_box_text, 220, 270, 4);
      animateSpringPopIn(s3_box, 220, 18, 820 / 200, 170 / 200);
      animateSpringPopIn(s3_box_text, 220, 18, 1, 1);
    }

    // =========================================================================
    // SCENE 4: CORE OFFERING (Frames 270 - 360 / 9s - 12s)
    // Obsidian Black + Two-Tone "Social Media Marketing" + Giant Watermark
    // =========================================================================
    api.log("[Scene 4] Building Core Offering...");
    var s4_bg = createRectLayer("S4_BG", COMP_WIDTH + 100, COMP_HEIGHT + 100, 0, 0, COLOR_BLACK);
    animateVisibility(s4_bg, 270, 360, 1);

    var s4_watermark = createTextLayer("S4_Watermark", "MARKETING", 240, 0, 0, "#19191F");
    if (s4_watermark) {
      api.set(s4_watermark, { "opacity": 45 });
      setKf(s4_watermark, "position.y", 270, -30);
      setKf(s4_watermark, "position.y", 360, 30);
      animateVisibility(s4_watermark, 272, 360, 6);
    }

    createSunburstFan("S4_BL", -480, 820, 10, 80, 275, 360, COLOR_WHITE);
    var s4_star = createStarLayer("S4_Star", 120, 340, -180, COLOR_WHITE);
    if (s4_star) {
      animateVisibility(s4_star, 280, 360, 6);
      animateSpringPopIn(s4_star, 280, 18, 0.6, 0.6);
      setKf(s4_star, "rotation.z", 280, 0);
      setKf(s4_star, "rotation.z", 360, 90);
    }

    var s4_t1 = createTextLayer("S4_T1", "Social Media", 110, 0, -40, COLOR_WHITE);
    var s4_t2 = createTextLayer("S4_T2", "Marketing", 130, 0, 100, COLOR_BLUE);
    if (s4_t1 && s4_t2) {
      animateVisibility(s4_t1, 278, 360, 5);
      animateVisibility(s4_t2, 290, 360, 5);
      animateSpringPopIn(s4_t1, 278, 18, 1, 1);
      animateSpringPopIn(s4_t2, 290, 18, 1, 1);
    }

    // =========================================================================
    // SCENE 5: CASE STUDY INTRO (Frames 360 - 450 / 12s - 14s)
    // Cobalt Blue + Fast Impact "CASE STUDY" -> "3 MONTHS"
    // =========================================================================
    api.log("[Scene 5] Building Case Study Intro...");
    var s5_bg = createRectLayer("S5_BG", COMP_WIDTH + 100, COMP_HEIGHT + 100, 0, 0, COLOR_BLUE);
    animateVisibility(s5_bg, 360, 450, 1);

    var s5_watermark = createTextLayer("S5_Watermark", "GROWTH", 260, 0, -40, COLOR_DARK_BLUE);
    if (s5_watermark) {
      api.set(s5_watermark, { "opacity": 40 });
      animateVisibility(s5_watermark, 362, 450, 6);
    }

    createSunburstFan("S5_TR", 480, -820, 10, 80, 365, 450, COLOR_WHITE);
    var s5_star = createStarLayer("S5_Star", 120, -360, 380, COLOR_WHITE);
    if (s5_star) {
      animateVisibility(s5_star, 370, 450, 6);
      animateSpringPopIn(s5_star, 370, 18, 0.6, 0.6);
      setKf(s5_star, "rotation.z", 370, 0);
      setKf(s5_star, "rotation.z", 450, 90);
    }

    var s5_t1 = createTextLayer("S5_T1", "CASE STUDY", 115, 0, -70, COLOR_BLACK);
    var s5_t2 = createTextLayer("S5_T2", "3 MONTHS", 135, 0, 70, COLOR_WHITE);
    if (s5_t1 && s5_t2) {
      animateVisibility(s5_t1, 368, 450, 4);
      animateVisibility(s5_t2, 380, 450, 4);
      animateSpringPopIn(s5_t1, 368, 16, 1, 1);
      animateSpringPopIn(s5_t2, 380, 16, 1, 1);
    }

    // =========================================================================
    // SCENE 6: CLIENT BRAND REVEAL (Frames 450 - 540 / 14s - 17s)
    // Pure White Backdrop + "SABI - JUICE YOUR MIND"
    // =========================================================================
    api.log("[Scene 6] Building Client Identity Reveal...");
    var s6_bg = createRectLayer("S6_BG", COMP_WIDTH + 100, COMP_HEIGHT + 100, 0, 0, COLOR_WHITE);
    animateVisibility(s6_bg, 450, 540, 1);

    // Organic Emblem Seal
    var s6_emblem_outer = createCircleLayer("S6_Emblem_Outer", 220, -220, 0, "#27272A");
    var s6_emblem_inner = createCircleLayer("S6_Emblem_Inner", 180, -220, 0, COLOR_WHITE);
    var s6_emblem_leaf = createCircleLayer("S6_Emblem_Leaf", 100, -220, 0, "#27272A");

    var s6_title = createTextLayer("S6_Title", "SABI", 150, 100, -25, "#27272A", 0, 0.5);
    var s6_subtitle = createTextLayer("S6_Subtitle", "JUICE YOUR MIND", 42, 105, 55, "#52525B", 0, 0.5);

    [s6_emblem_outer, s6_emblem_inner, s6_emblem_leaf, s6_title, s6_subtitle].forEach(function(node) {
      if (!node) return;
      animateVisibility(node, 458, 540, 6);
      animateSpringPopIn(node, 458, 18, 1, 1);
    });

    // =========================================================================
    // SCENE 7: SMARTPHONE FEED TRANSFORMATION (Frames 540 - 660 / 17s - 21s)
    // Device Mockup ("BEFORE" -> "WITH Mktideas agency")
    // =========================================================================
    api.log("[Scene 7] Building Smartphone Feed Transformation...");
    // Background transitions from light gray to blue
    var s7_bg_gray = createRectLayer("S7_BG_Gray", COMP_WIDTH + 100, COMP_HEIGHT + 100, 0, 0, COLOR_GRAY_BG);
    animateVisibility(s7_bg_gray, 540, 600, 1);

    var s7_bg_blue = createRectLayer("S7_BG_Blue", COMP_WIDTH + 100, COMP_HEIGHT + 100, 0, 0, COLOR_BLUE);
    animateVisibility(s7_bg_blue, 600, 660, 1);

    // Section Titles
    var s7_title_before = createTextLayer("S7_Title_Before", "BEFORE", 100, 0, -680, COLOR_BLACK);
    animateVisibility(s7_title_before, 542, 600, 4);

    var s7_title_after = createTextLayer("S7_Title_After", "WITH Mktideas", 90, -40, -690, COLOR_WHITE);
    var s7_badge_agency = createTextLayer("S7_Badge_Agency", "agency", 48, 260, -660, COLOR_WHITE);
    animateVisibility(s7_title_after, 602, 660, 4);
    animateVisibility(s7_badge_agency, 602, 660, 4);

    createSunburstFan("S7_TR", 480, -820, 8, 70, 540, 660, "#3F3F46");
    createSunburstFan("S7_BL", -480, 820, 8, 70, 540, 660, "#3F3F46");
    createSunburstFan("S7_Btm_Rays", 0, 960, 12, 90, 600, 660, COLOR_WHITE);

    // Phone Hardware Body
    var s7_phone_body = createRectLayer("S7_Phone_Body", 560, 1020, 0, 80, "#18181B", 56);
    var s7_phone_screen = createRectLayer("S7_Phone_Screen", 530, 990, 0, 80, COLOR_WHITE, 44);
    var s7_phone_notch = createRectLayer("S7_Phone_Notch", 140, 28, 0, -390, "#18181B", 14);

    [s7_phone_body, s7_phone_screen, s7_phone_notch].forEach(function(node) {
      if (!node) return;
      animateVisibility(node, 542, 660, 5);
      setKf(node, "position.y", 542, 140);
      setKf(node, "position.y", 560, 80);
    });

    // 3x3 Social Post Feed Grid Inside Phone
    var postColorsBefore = ["#A1A1AA", "#D4D4D8", "#71717A", "#E4E4E7", "#9CA3AF", "#D1D5DB", "#E5E7EB", "#9CA3AF", "#D1D5DB"];
    var postColorsAfter = ["#1060FF", "#00F2FE", "#10B981", "#FFB300", "#FF5252", "#8B5CF6", "#EC4899", "#3B82F6", "#06B6D4"];

    var gridStartX = -150;
    var gridStartY = -170;
    var postSize = 145;
    var postGap = 15;

    for (var r = 0; r < 3; r++) {
      for (var c = 0; c < 3; c++) {
        var pX = gridStartX + c * (postSize + postGap);
        var pY = gridStartY + r * (postSize + postGap);
        var idx = r * 3 + c;
        var postNode = createRectLayer("S7_Post_" + idx, postSize, postSize, pX, pY, postColorsBefore[idx], 10);
        if (postNode) {
          animateVisibility(postNode, 545, 660, 4);
          // Color shift from desaturated to vibrant at frame 600
          setKf(postNode, "material.materialColor", 595, postColorsBefore[idx]);
          setKf(postNode, "material.materialColor", 605, postColorsAfter[idx]);
          // Little pop jump at transition
          setKf(postNode, "scale.x", 600, (postSize / 200) * 0.85);
          setKf(postNode, "scale.x", 608, (postSize / 200) * 1.05);
          setKf(postNode, "scale.x", 615, postSize / 200);
        }
      }
    }

    // =========================================================================
    // SCENE 8: DATA GROWTH BAR CHART & TICKER (Frames 660 - 810 / 21s - 26s)
    // 5-Column Growth Bars + Upward Trend Curve + Live Counter 852 -> 50,967
    // =========================================================================
    api.log("[Scene 8] Building Data Growth Bar Chart & Ticker...");
    var s8_bg = createRectLayer("S8_BG", COMP_WIDTH + 100, COMP_HEIGHT + 100, 0, 0, COLOR_WHITE);
    animateVisibility(s8_bg, 660, 810, 1);

    var s8_title_views = createTextLayer("S8_Title_Views", "VIEWS", 110, -280, -680, COLOR_BLACK, 0, 0.5);
    animateVisibility(s8_title_views, 662, 810, 4);

    // Initial baseline label
    var s8_lbl_julio = createTextLayer("S8_Lbl_Julio", "JULIO", 52, -360, 720, COLOR_BLACK);
    var s8_lbl_sept = createTextLayer("S8_Lbl_Sept", "SEPTIEMBRE", 52, 280, 720, COLOR_BLACK);
    animateVisibility(s8_lbl_julio, 662, 810, 4);
    animateVisibility(s8_lbl_sept, 700, 810, 4);

    // 5 Progressive Growth Bars
    var barHeights = [220, 440, 680, 960, 1260];
    var barStartX = -360;
    var barStepX = 160;
    var barWidth = 115;
    var barBaseY = 660; // Bottom contact baseline

    var barNodes = [];
    for (var b = 0; b < 5; b++) {
      var bX = barStartX + b * barStepX;
      var targetH = barHeights[b];
      var bNode = createRectLayer("S8_Bar_" + b, barWidth, 10, bX, barBaseY, COLOR_BLUE, 8);
      if (bNode) {
        animateVisibility(bNode, 665, 810, 4);
        var fBarStart = 668 + b * 12;
        var fBarEnd = fBarStart + 22;

        // Set anchor to bottom so scaling extends upward
        api.set(bNode, { "anchor.y": 0.5 });
        
        // Scale and position interpolation
        setKf(bNode, "position.y", fBarStart, barBaseY);
        setKf(bNode, "position.y", fBarEnd, barBaseY - (targetH / 2));
        setKf(bNode, "scale.y", fBarStart, 0.05);
        setKf(bNode, "scale.y", fBarEnd, targetH / 200);
        barNodes.push(bNode);
      }
    }

    // Dynamic Upward Growth Arrow
    var s8_arrow = createStarLayer("S8_Growth_Arrow", 140, 240, -180, COLOR_BLUE);
    if (s8_arrow) {
      animateVisibility(s8_arrow, 715, 810, 4);
      setKf(s8_arrow, "position.x", 715, -200);
      setKf(s8_arrow, "position.y", 715, 260);
      setKf(s8_arrow, "position.x", 750, 240);
      setKf(s8_arrow, "position.y", 750, -180);
      setKf(s8_arrow, "rotation.z", 715, -45);
      setKf(s8_arrow, "rotation.z", 750, 25);
    }

    // Animated Ticker Number Counter
    var s8_counter_initial = createTextLayer("S8_Counter_Initial", "852", 120, -360, -420, COLOR_BLACK, 0.5, 0.5);
    animateVisibility(s8_counter_initial, 665, 710, 4);

    var tickerFrames = [
      { f: 710, text: "5,820" },
      { f: 725, text: "18,450" },
      { f: 740, text: "34,910" },
      { f: 755, text: "50,967" }
    ];

    tickerFrames.forEach(function(item, idx) {
      var tNode = createTextLayer("S8_Counter_" + idx, item.text, 130, 180, -520, COLOR_BLACK, 0.5, 0.5);
      if (tNode) {
        var nextF = (idx < tickerFrames.length - 1) ? tickerFrames[idx + 1].f : 810;
        animateVisibility(tNode, item.f, nextF, 2);
        animateSpringPopIn(tNode, item.f, 12, 1, 1);
      }
    });

    // =========================================================================
    // SCENE 9: EMOTIONAL CALL TO VALUE (Frames 810 - 870 / 27s - 29s)
    // Obsidian Black + "LET'S CREATE SOMETHING AMAZING TOGETHER"
    // =========================================================================
    api.log("[Scene 9] Building Emotional Call to Value...");
    var s9_bg = createRectLayer("S9_BG", COMP_WIDTH + 100, COMP_HEIGHT + 100, 0, 0, COLOR_BLACK);
    animateVisibility(s9_bg, 810, 870, 1);

    createSunburstFan("S9_Top", 0, -960, 14, 110, 812, 870, COLOR_WHITE);
    createSunburstFan("S9_Btm", 0, 960, 14, 110, 812, 870, COLOR_WHITE);

    var s9_star1 = createStarLayer("S9_Star_1", 130, 360, -220, COLOR_WHITE);
    var s9_star2 = createStarLayer("S9_Star_2", 130, -360, 320, COLOR_WHITE);
    [s9_star1, s9_star2].forEach(function(star, idx) {
      if (!star) return;
      animateVisibility(star, 815, 870, 5);
      animateSpringPopIn(star, 815, 18, 0.65, 0.65);
      setKf(star, "rotation.z", 815, 0);
      setKf(star, "rotation.z", 870, 75);
    });

    var s9_t1 = createTextLayer("S9_T1", "LET'S", 100, 0, -180, COLOR_WHITE);
    var s9_t2 = createTextLayer("S9_T2", "CREATE", 110, 0, -70, COLOR_WHITE);
    var s9_t3 = createTextLayer("S9_T3", "SOMETHING", 95, 0, 40, COLOR_WHITE);
    var s9_t4 = createTextLayer("S9_T4", "AMAZING", 110, 0, 150, COLOR_WHITE);
    var s9_t5 = createTextLayer("S9_T5", "TOGETHER", 105, 0, 260, COLOR_WHITE);

    [s9_t1, s9_t2, s9_t3, s9_t4, s9_t5].forEach(function(tNode, idx) {
      if (!tNode) return;
      var fStart = 814 + idx * 8;
      animateVisibility(tNode, fStart, 870, 4);
      animateSpringPopIn(tNode, fStart, 15, 1, 1);
    });

    // =========================================================================
    // SCENE 10: AGENCY OUTRO & CTA (Frames 870 - 900 / 29s - 30s)
    // Cobalt Blue + "Mktideas agency" Branding + Platform Suite
    // =========================================================================
    api.log("[Scene 10] Building Agency Outro & CTA...");
    var s10_iris = createCircleLayer("S10_Iris_BG", 2800, 0, 0, COLOR_BLUE);
    if (s10_iris) {
      var maxScale = 2800 / 200;
      setKf(s10_iris, "scale.x", 870, 0);
      setKf(s10_iris, "scale.y", 870, 0);
      setKf(s10_iris, "scale.x", 884, maxScale);
      setKf(s10_iris, "scale.y", 884, maxScale);
      animateVisibility(s10_iris, 870, TOTAL_FRAMES, 1);
    }

    createSunburstFan("S10_TR", 480, -820, 10, 80, 872, TOTAL_FRAMES, COLOR_WHITE);
    createSunburstFan("S10_BL", -480, 820, 10, 80, 872, TOTAL_FRAMES, COLOR_WHITE);

    var s10_logo_main = createTextLayer("S10_Logo_Main", "Mktideas", 140, -50, -120, COLOR_WHITE);
    var s10_logo_badge = createTextLayer("S10_Logo_Badge", "agency", 60, 260, -70, COLOR_WHITE);
    var s10_platform_icons = createTextLayer("S10_Platforms", "[ Instagram • Facebook • TikTok • YouTube • LinkedIn ]", 34, 0, 80, COLOR_WHITE);
    var s10_cta_url = createTextLayer("S10_CTA_Url", "mktideas.agency", 48, 0, 220, COLOR_WHITE);

    [s10_logo_main, s10_logo_badge, s10_platform_icons, s10_cta_url].forEach(function(node, idx) {
      if (!node) return;
      var fStart = 874 + idx * 5;
      animateVisibility(node, fStart, TOTAL_FRAMES, 4);
      animateSpringPopIn(node, fStart, 16, 1, 1);
    });

    // Reset timeline to frame 0
    if (typeof api.setFrame === "function") {
      api.setFrame(0);
    }

    api.log("[✓] Successfully built complete 30s Commercial Agency Reel in Cavalry!");
    console.log("✓ 30-Second Commercial Agency Reel created with 10 scenes & 900 frames.");

    return {
      success: true,
      totalFrames: TOTAL_FRAMES,
      sceneCount: 10,
      format: "9:16 Vertical (1080x1920)"
    };
  } catch (err) {
    console.error("[Cavalry Script Error]:", err);
    throw err;
  }
})();
