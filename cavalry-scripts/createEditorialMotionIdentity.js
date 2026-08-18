/**
 * Cavalry 2D Motion Graphics - Editorial Motion Identity Animation
 * Inspired by Area.Studio "talq" Brand Identity Motion System
 * 
 * Features:
 * - Clean, editorial Swiss-style typography & graphic design
 * - 4 Continuous, seamless geometric movements with chevron arrow wipes
 * - Multi-layer sliding dialogue ribbons with directional pointers
 * - Staggered cubic bezier easing with overlapping visual rhythm
 * - Perfectly seamless 450-frame loop (15s @ 30fps / 1920x1080)
 * 
 * Execution:
 * Runs directly on the current composition in Cavalry via MCP Bridge or Script Editor.
 */

(function createEditorialMotionIdentity() {
  if (typeof api === "undefined") {
    console.error("This script must be executed inside Cavalry.");
    return;
  }

  console.log("[MCP] Building Editorial Procedural Motion Identity in Cavalry...");

  try {
    // --- Composition Setup ---
    var TOTAL_FRAMES = 450; // 15 seconds @ 30fps
    var COMP_WIDTH = 1920;
    var COMP_HEIGHT = 1080;

    if (typeof api.setTimeRange === "function") {
      api.setTimeRange(0, TOTAL_FRAMES);
    }

    // --- Color Palette Tokens ---
    var COLOR_COBALT = "#145AF6";     // Royal Cobalt Blue
    var COLOR_ICE_BLUE = "#7AB8FF";   // Sky Ice Blue
    var COLOR_WHITE = "#FFFFFF";      // Crisp Editorial White
    var COLOR_ROSE = "#F7779A";       // Vibrant Rose Pink
    var COLOR_CRIMSON = "#D4143D";    // Bold Crimson
    var COLOR_PINE = "#164E30";       // Deep Forest Pine
    var COLOR_MINT = "#2EF2B8";       // Electric Mint Aqua
    var COLOR_PLUM = "#3B0D18";       // Dark Chocolate Plum
    var COLOR_LILAC = "#D8B4E2";      // Soft Lavender Lilac

    // --- Helper Functions ---
    function setKf(layerId, attr, frame, val) {
      if (typeof api.setKeyframe === "function") {
        api.setKeyframe(layerId, attr, frame, val);
      }
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

    function createRectLayer(name, w, h, x, y, colorHex) {
      var node = api.primitive ? api.primitive("rectangle", name) : api.create("basicShape", name);
      if (node) {
        var scaleX = w / 200;
        var scaleY = h / 200;
        api.set(node, {
          "position.x": x !== undefined ? x : 0,
          "position.y": y !== undefined ? y : 0,
          "scale.x": scaleX,
          "scale.y": scaleY,
          "material.materialColor": colorHex || COLOR_WHITE
        });
      }
      return node;
    }

    function createTriangleArrow(name, size, x, y, rotDeg, colorHex) {
      var node = api.primitive ? api.primitive("polygon", name) : api.create("basicShape", name);
      if (node) {
        var s = size / 200;
        api.set(node, {
          "sides": 3,
          "position.x": x !== undefined ? x : 0,
          "position.y": y !== undefined ? y : 0,
          "scale.x": s,
          "scale.y": s,
          "rotation.z": rotDeg !== undefined ? rotDeg : 0,
          "material.materialColor": colorHex || COLOR_WHITE
        });
      }
      return node;
    }

    function animateVisibility(layerId, inFrame, outFrame, fadeDuration) {
      if (!layerId) return;
      fadeDuration = fadeDuration || 6;
      setKf(layerId, "opacity", Math.max(0, inFrame - 1), 0);
      setKf(layerId, "opacity", inFrame, 0);
      setKf(layerId, "opacity", inFrame + fadeDuration, 100);
      setKf(layerId, "opacity", Math.max(inFrame + fadeDuration, outFrame - fadeDuration), 100);
      setKf(layerId, "opacity", outFrame, 0);
      setKf(layerId, "opacity", outFrame + 1, 0);
    }

    // Cubic Bezier ease-in-out interpolation
    function cubicEase(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animateSlideX(layerId, startF, endF, startX, endX) {
      if (!layerId) return;
      var duration = endF - startF;
      for (var f = 0; f <= duration; f++) {
        var prog = cubicEase(f / duration);
        var curX = startX + (endX - startX) * prog;
        setKf(layerId, "position.x", startF + f, Math.round(curX * 10) / 10);
      }
    }

    function animateScaleX(layerId, startF, endF, startS, endS) {
      if (!layerId) return;
      var duration = endF - startF;
      for (var f = 0; f <= duration; f++) {
        var prog = cubicEase(f / duration);
        var curS = startS + (endS - startS) * prog;
        setKf(layerId, "scale.x", startF + f, Math.round(curS * 1000) / 1000);
      }
    }

    // =========================================================================
    // MOVEMENT 1: DIALOGUE HERO & CHEVRON RIBBONS (Frames 0 - 115)
    // Palette: Cobalt Blue (#145AF6) + Ice Blue (#7AB8FF) + White (#FFFFFF)
    // =========================================================================
    console.log("[Movement 1] Building Hero Dialogue & Chevron Ribbons...");
    
    // Background Base
    var m1_bg = createRectLayer("M1_BG", COMP_WIDTH + 100, COMP_HEIGHT + 100, 0, 0, COLOR_COBALT);
    animateVisibility(m1_bg, 0, 115, 1);

    // Hero Editorial Typography: "WELCOME TO THE CONVERSATION."
    var m1_t1 = createTextLayer("M1_Title_1", "WELCOME", 145, -340, -180, COLOR_ICE_BLUE, 0, 0.5);
    var m1_t2 = createTextLayer("M1_Title_2", "TO THE", 145, -340, -10, COLOR_ICE_BLUE, 0, 0.5);
    var m1_t3 = createTextLayer("M1_Title_3", "CONVERSATION.", 145, -340, 160, COLOR_ICE_BLUE, 0, 0.5);

    [m1_t1, m1_t2, m1_t3].forEach(function(node, idx) {
      if (!node) return;
      var fStart = idx * 8;
      animateVisibility(node, fStart, 65, 4);
      animateSlideX(node, fStart, fStart + 22, -600, -340);
    });

    // Expanding Horizontal Dialogue Banner Strips (Parallax Sliding Ribbons)
    var m1_strip1 = createRectLayer("M1_Strip_1", 1600, 110, 0, -320, COLOR_WHITE);
    var m1_strip2 = createRectLayer("M1_Strip_2", 1800, 110, 0, 320, COLOR_WHITE);
    var m1_strip_t1 = createTextLayer("M1_Strip_Text_1", "WE ARE A COMMUNITY OF COMMUNITIES • WE ARE A COMMUNITY", 52, 0, -320, COLOR_COBALT);
    var m1_strip_t2 = createTextLayer("M1_Strip_Text_2", "TALKING • ADVOCATING • LIVING IN QUÉBEC • TALKING", 52, 0, 320, COLOR_COBALT);

    [m1_strip1, m1_strip2, m1_strip_t1, m1_strip_t2].forEach(function(node) {
      if (!node) return;
      animateVisibility(node, 24, 75, 5);
    });
    animateSlideX(m1_strip_t1, 24, 75, 300, -300);
    animateSlideX(m1_strip_t2, 24, 75, -300, 300);

    // Giant Dynamic Cutout: "WE" -> "ARE"
    var m1_hero_we = createTextLayer("M1_Hero_WE", "WE", 340, 0, 0, COLOR_ICE_BLUE);
    var m1_hero_are = createTextLayer("M1_Hero_ARE", "ARE", 360, 0, 0, COLOR_WHITE);

    if (m1_hero_we) {
      animateVisibility(m1_hero_we, 60, 88, 4);
      animateSlideX(m1_hero_we, 60, 80, 500, 0);
    }
    if (m1_hero_are) {
      animateVisibility(m1_hero_are, 84, 115, 4);
      animateSlideX(m1_hero_are, 84, 105, 500, 0);
    }

    // Directional Chevron Arrow Reveal into Movement 2
    var m1_chevron = createTriangleArrow("M1_Chevron_Wipe", 900, 1200, 0, 90, COLOR_ROSE);
    if (m1_chevron) {
      animateVisibility(m1_chevron, 95, 120, 2);
      animateSlideX(m1_chevron, 95, 118, 1400, -200);
      animateScaleX(m1_chevron, 95, 118, 2, 8);
    }

    // =========================================================================
    // MOVEMENT 2: GEOMETRIC RIBBON SPLIT & DUAL-VOICE (Frames 110 - 225)
    // Palette: Vibrant Rose Pink (#F7779A) + Crimson Red (#D4143D) + Plum (#2D0B16)
    // =========================================================================
    console.log("[Movement 2] Building Geometric Ribbon Split...");
    var m2_bg = createRectLayer("M2_BG", COMP_WIDTH + 100, COMP_HEIGHT + 100, 0, 0, COLOR_ROSE);
    animateVisibility(m2_bg, 110, 225, 1);

    // Multi-Strip Parallax Typography
    var m2_t1 = createTextLayer("M2_Title_1", "WITH AN", 130, -320, -190, COLOR_CRIMSON, 0, 0.5);
    var m2_t2 = createTextLayer("M2_Title_2", "ENGLISH VOICE,", 130, -320, -30, COLOR_CRIMSON, 0, 0.5);
    var m2_t3 = createTextLayer("M2_Title_3", "A BILINGUAL SOUL.", 130, -320, 130, COLOR_CRIMSON, 0, 0.5);

    [m2_t1, m2_t2, m2_t3].forEach(function(node, idx) {
      if (!node) return;
      var fStart = 115 + idx * 8;
      animateVisibility(node, fStart, 175, 4);
      animateSlideX(node, fStart, fStart + 20, -600, -320);
    });

    // Horizontal Crimson Block Band Wipe
    var m2_crimson_block = createRectLayer("M2_Crimson_Block", COMP_WIDTH + 100, 380, 0, 0, COLOR_CRIMSON);
    var m2_crimson_text = createTextLayer("M2_Crimson_Text", "AND A DEEP RESPECT FOR WHERE WE LIVE.", 72, 0, 0, COLOR_ROSE);
    if (m2_crimson_block && m2_crimson_text) {
      animateVisibility(m2_crimson_block, 170, 225, 4);
      animateVisibility(m2_crimson_text, 170, 225, 4);
      animateSlideX(m2_crimson_block, 170, 192, 1200, 0);
      animateSlideX(m2_crimson_text, 170, 192, -800, 0);
    }

    // Directional Dialogue Flags (Interlocking Chevron Pins)
    var m2_flag1 = createRectLayer("M2_Flag_1", 480, 100, 480, -280, COLOR_WHITE);
    var m2_flag1_tail = createTriangleArrow("M2_Flag1_Tail", 100, 720, -280, 90, COLOR_WHITE);
    var m2_flag1_txt = createTextLayer("M2_Flag1_Txt", "ON JASE.", 52, 480, -280, COLOR_CRIMSON);

    var m2_flag2 = createRectLayer("M2_Flag_2", 540, 100, -460, 280, COLOR_WHITE);
    var m2_flag2_tail = createTriangleArrow("M2_Flag2_Tail", 100, -730, 280, -90, COLOR_WHITE);
    var m2_flag2_txt = createTextLayer("M2_Flag2_Txt", "PARLONS-EN.", 52, -460, 280, COLOR_CRIMSON);

    [m2_flag1, m2_flag1_tail, m2_flag1_txt, m2_flag2, m2_flag2_tail, m2_flag2_txt].forEach(function(node) {
      if (!node) return;
      animateVisibility(node, 185, 225, 4);
    });

    // Chevron Transition into Movement 3
    var m2_chevron_out = createTriangleArrow("M2_Chevron_Out", 1000, -1200, 0, -90, COLOR_PINE);
    if (m2_chevron_out) {
      animateVisibility(m2_chevron_out, 210, 230, 2);
      animateSlideX(m2_chevron_out, 210, 228, -1400, 300);
      animateScaleX(m2_chevron_out, 210, 228, 2, 8);
    }

    // =========================================================================
    // MOVEMENT 3: INTERLOCKING GEOMETRIC ARROWS & SPLIT CANVAS (Frames 220 - 335)
    // Palette: Deep Pine Green (#164E30) + Electric Mint (#2EF2B8) + White (#FFFFFF)
    // =========================================================================
    console.log("[Movement 3] Building Interlocking Geometric Arrows & Split Canvas...");
    var m3_bg = createRectLayer("M3_BG", COMP_WIDTH + 100, COMP_HEIGHT + 100, 0, 0, COLOR_PINE);
    animateVisibility(m3_bg, 220, 335, 1);

    // Split Mint Panel (Left-to-Right Geometric Chevron Wedge)
    var m3_wedge_panel = createRectLayer("M3_Wedge_Panel", 960, COMP_HEIGHT + 100, 480, 0, COLOR_MINT);
    var m3_wedge_arrow = createTriangleArrow("M3_Wedge_Arrow", 680, 0, 0, -90, COLOR_MINT);

    [m3_wedge_panel, m3_wedge_arrow].forEach(function(node) {
      if (!node) return;
      animateVisibility(node, 225, 335, 4);
      animateSlideX(node, 225, 248, 800, node === m3_wedge_arrow ? 0 : 480);
    });

    // Left Panel Headline (Mint text on Pine)
    var m3_t1 = createTextLayer("M3_Text_1", "WITH", 135, -480, -120, COLOR_MINT, 0.5, 0.5);
    var m3_t2 = createTextLayer("M3_Text_2", "OPEN", 135, -480, 10, COLOR_MINT, 0.5, 0.5);
    var m3_t3 = createTextLayer("M3_Text_3", "MINDS,", 135, -480, 140, COLOR_MINT, 0.5, 0.5);

    // Right Panel Headline (Pine text on Mint)
    var m3_t4 = createTextLayer("M3_Text_4", "ON", 135, 480, -60, COLOR_PINE, 0.5, 0.5);
    var m3_t5 = createTextLayer("M3_Text_5", "COMMON", 135, 480, 60, COLOR_PINE, 0.5, 0.5);
    var m3_t6 = createTextLayer("M3_Text_6", "GROUND.", 135, 480, 180, COLOR_PINE, 0.5, 0.5);

    [m3_t1, m3_t2, m3_t3, m3_t4, m3_t5, m3_t6].forEach(function(node, idx) {
      if (!node) return;
      var fStart = 230 + idx * 6;
      animateVisibility(node, fStart, 290, 4);
      setKf(node, "position.y", fStart, idx < 3 ? -120 + idx * 130 + 40 : -60 + (idx - 3) * 120 + 40);
      setKf(node, "position.y", fStart + 18, idx < 3 ? -120 + idx * 130 : -60 + (idx - 3) * 120);
    });

    // Dynamic Central Dialogue Badge that Rotates and Morphs
    var m3_bridge_box = createRectLayer("M3_Bridge_Box", 840, 260, 0, 0, COLOR_WHITE);
    var m3_bridge_text = createTextLayer("M3_Bridge_Text", "WE SEE CONVERSATION AS A BRIDGE UNITING US ALL.", 44, 0, 0, COLOR_PINE);
    if (m3_bridge_box && m3_bridge_text) {
      animateVisibility(m3_bridge_box, 285, 335, 4);
      animateVisibility(m3_bridge_text, 285, 335, 4);
      setKf(m3_bridge_box, "rotation.z", 285, -8);
      setKf(m3_bridge_box, "rotation.z", 335, 6);
      setKf(m3_bridge_text, "rotation.z", 285, -8);
      setKf(m3_bridge_text, "rotation.z", 335, 6);
    }

    // Directional Chevron Arrow Reveal into Movement 4
    var m3_chevron_out = createTriangleArrow("M3_Chevron_Wipe4", 950, 1200, 0, 90, COLOR_PLUM);
    if (m3_chevron_out) {
      animateVisibility(m3_chevron_out, 320, 340, 2);
      animateSlideX(m3_chevron_out, 320, 338, 1400, -200);
      animateScaleX(m3_chevron_out, 320, 338, 2, 8);
    }

    // =========================================================================
    // MOVEMENT 4: EDITORIAL MOSAIC & SEAMLESS LOOP ANCHOR (Frames 330 - 450)
    // Palette: Dark Plum (#3B0D18) + Soft Lilac (#D8B4E2) -> Cobalt Blue (#145AF6)
    // =========================================================================
    console.log("[Movement 4] Building Mosaic Grid & Seamless Loop Reconnect...");
    var m4_bg = createRectLayer("M4_BG", COMP_WIDTH + 100, COMP_HEIGHT + 100, 0, 0, COLOR_PLUM);
    animateVisibility(m4_bg, 330, 420, 1);

    // Dynamic Diagonal Chevron Mosaic Grid (Multiple Interlocking Arrows)
    var mosaicBanners = [
      { text: "BECAUSE LANGUAGE,", color: COLOR_LILAC, txtColor: COLOR_PLUM, y: -280, xStart: -600, xEnd: -300 },
      { text: "NO MATTER ITS ACCENT,", color: COLOR_ROSE, txtColor: COLOR_WHITE, y: -140, xStart: 600, xEnd: 320 },
      { text: "BRINGS PEOPLE TOGETHER.", color: COLOR_MINT, txtColor: COLOR_PINE, y: 0, xStart: -700, xEnd: -240 },
      { text: "LET'S CHAT.", color: COLOR_CRIMSON, txtColor: COLOR_WHITE, y: 140, xStart: 600, xEnd: 360 },
      { text: "SPEAK UP • BE HEARD.", color: COLOR_COBALT, txtColor: COLOR_WHITE, y: 280, xStart: -600, xEnd: -280 }
    ];

    mosaicBanners.forEach(function(b, idx) {
      var rectNode = createRectLayer("M4_Mosaic_Bar_" + idx, 760, 110, b.xEnd, b.y, b.color);
      var arrowNode = createTriangleArrow("M4_Mosaic_Arrow_" + idx, 110, b.xEnd + 380, b.y, 90, b.color);
      var txtNode = createTextLayer("M4_Mosaic_Txt_" + idx, b.text, 44, b.xEnd - 20, b.y, b.txtColor);

      [rectNode, arrowNode, txtNode].forEach(function(node) {
        if (!node) return;
        var fStart = 335 + idx * 5;
        animateVisibility(node, fStart, 395, 4);
        animateSlideX(node, fStart, fStart + 18, b.xStart, b.xEnd + (node === arrowNode ? 380 : (node === txtNode ? -20 : 0)));
      });
    });

    // =========================================================================
    // HERO IDENTITY REVEAL & LOOP RECONNECT (Frames 390 - 450 -> Frame 0)
    // =========================================================================
    var m4_loop_bg = createRectLayer("M4_Loop_BG", COMP_WIDTH + 100, COMP_HEIGHT + 100, 0, 0, COLOR_COBALT);
    animateVisibility(m4_loop_bg, 390, TOTAL_FRAMES, 1);

    // Hero Typographic Brand Mark: "talq"
    var m4_brand_logo = createTextLayer("M4_Brand_Logo", "talq", 280, -220, 0, COLOR_ICE_BLUE, 0.5, 0.5);
    var m4_brand_sub1 = createTextLayer("M4_Brand_Sub1", "Talking.", 48, 120, -60, COLOR_WHITE, 0, 0.5);
    var m4_brand_sub2 = createTextLayer("M4_Brand_Sub2", "Advocating.", 48, 120, 0, COLOR_WHITE, 0, 0.5);
    var m4_brand_sub3 = createTextLayer("M4_Brand_Sub3", "Living in Québec.", 48, 120, 60, COLOR_WHITE, 0, 0.5);

    [m4_brand_logo, m4_brand_sub1, m4_brand_sub2, m4_brand_sub3].forEach(function(node, idx) {
      if (!node) return;
      animateVisibility(node, 395, TOTAL_FRAMES, 5);
      animateSlideX(node, 395, 418, (idx === 0 ? -400 : 300), (idx === 0 ? -220 : 120));
    });

    // Seamless Infinite Loop Morph at Frame 440-450:
    // Brand mark expands smoothly back into the initial "WELCOME TO THE CONVERSATION" composition
    setKf(m4_brand_logo, "scale.x", 435, 1.4);
    setKf(m4_brand_logo, "scale.y", 435, 1.4);
    setKf(m4_brand_logo, "scale.x", TOTAL_FRAMES, 2.8);
    setKf(m4_brand_logo, "scale.y", TOTAL_FRAMES, 2.8);
    setKf(m4_brand_logo, "opacity", TOTAL_FRAMES - 10, 100);
    setKf(m4_brand_logo, "opacity", TOTAL_FRAMES, 0);

    // Reset Playhead to Frame 0
    if (typeof api.setFrame === "function") {
      api.setFrame(0);
    }
    if (typeof api.play === "function") {
      api.play();
    }

    console.log("[✓] Editorial Procedural Motion Identity generated successfully in Cavalry!");

    return {
      success: true,
      duration: "15s (450 frames @ 30fps)",
      movements: 4,
      loop: "Seamless continuous cycle"
    };
  } catch (err) {
    console.error("[Cavalry Script Error]:", err);
    throw err;
  }
})();
