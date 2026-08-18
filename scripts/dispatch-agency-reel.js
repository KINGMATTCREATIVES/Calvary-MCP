import axios from "axios";

const agencyReelScript = `
(function create30SecondAgencyReel() {
  if (typeof api === "undefined") {
    console.error("This script must be executed inside Cavalry.");
    return;
  }

  console.log("[MCP] Creating 30-Second 'Growth Proof: Strategy That Works' Motion Graphic Reel...");

  var totalFrames = 1800; // 30 seconds at 60 FPS
  var bgColor = "#0A0F1D";          // Deep Obsidian Midnight
  var primaryCyan = "#00F2FE";      // Electric Cyan
  var primaryBlue = "#3B82F6";      // Vivid Blue
  var primaryPurple = "#8B5CF6";    // Neon Purple
  var primaryPink = "#EC4899";      // Hot Pink
  var textWhite = "#FFFFFF";        // Crisp White
  var textMuted = "#94A3B8";        // Slate Gray

  // Easing helpers
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function easeOutBack(t, s) {
    if (s === undefined) s = 1.15;
    t = t - 1;
    return (t * t * ((s + 1) * t + s) + 1);
  }
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function addKeyframe(layerId, frame, attrs) {
    if (typeof api.keyframe === "function" && layerId) {
      api.keyframe(layerId, frame, attrs);
    }
  }

  // ==========================================
  // 1. MASTER BACKDROP & EDITORIAL GRID
  // ==========================================
  var bg = api.primitive("rectangle", "Reel_Master_Backdrop");
  if (bg) {
    api.set(bg, {
      "position.x": 0,
      "position.y": 0,
      "scale.x": 12.0, // 2400px wide
      "scale.y": 8.0,  // 1600px tall
      "material.materialColor": bgColor
    });
  }

  // Persistent Top & Bottom Framing Rules
  var topRule = api.primitive("rectangle", "Reel_Header_Rule");
  if (topRule) {
    api.set(topRule, {
      "position.x": 0,
      "position.y": -350,
      "scale.x": 5.4,
      "scale.y": 0.01,
      "material.materialColor": primaryCyan
    });
  }

  var bottomRule = api.primitive("rectangle", "Reel_Footer_Rule");
  if (bottomRule) {
    api.set(bottomRule, {
      "position.x": 0,
      "position.y": 350,
      "scale.x": 5.4,
      "scale.y": 0.01,
      "material.materialColor": primaryCyan
    });
  }

  var brandTagLeft = api.create("textShape", "Reel_Brand_Tag");
  if (brandTagLeft) {
    api.set(brandTagLeft, {
      "text": "[ MKT IDEAS AGENCY // 30s CASE STUDY ]",
      "fontSize": 18,
      "horizontalAlignment": 0,
      "position.x": -520,
      "position.y": -375,
      "material.materialColor": textWhite
    });
  }

  var brandTagRight = api.create("textShape", "Reel_Status_Tag");
  if (brandTagRight) {
    api.set(brandTagRight, {
      "text": "CAMPAIGN: SABI // 2026",
      "fontSize": 18,
      "horizontalAlignment": 2,
      "position.x": 520,
      "position.y": -375,
      "material.materialColor": primaryCyan
    });
  }

  // ==========================================
  // ACT 1 (0s - 6s / Frames 0 - 360): THE HOOK
  // "GROWTH PROOF: STRATEGY THAT WORKS"
  // ==========================================
  var act1Title = api.create("textShape", "Act1_Title_GROWTH");
  if (act1Title) {
    api.set(act1Title, {
      "text": "GROWTH PROOF",
      "fontSize": 130,
      "horizontalAlignment": 1,
      "position.x": 0,
      "position.y": -60,
      "material.materialColor": primaryCyan
    });
  }

  var act1Subtitle = api.create("textShape", "Act1_Subtitle_STRATEGY");
  if (act1Subtitle) {
    api.set(act1Subtitle, {
      "text": "STRATEGY THAT WORKS",
      "fontSize": 48,
      "horizontalAlignment": 1,
      "position.x": 0,
      "position.y": 45,
      "material.materialColor": textWhite
    });
  }

  var act1TagBadge = api.primitive("rectangle", "Act1_Tag_Badge");
  if (act1TagBadge) {
    api.set(act1TagBadge, {
      "position.x": 0,
      "position.y": 125,
      "scale.x": 1.6,
      "scale.y": 0.22,
      "material.materialColor": primaryBlue
    });
  }

  var act1TagText = api.create("textShape", "Act1_Tag_Text");
  if (act1TagText) {
    api.set(act1TagText, {
      "text": "ELEVATE YOUR SOCIAL PRESENCE",
      "fontSize": 18,
      "horizontalAlignment": 1,
      "position.x": 0,
      "position.y": 131,
      "material.materialColor": textWhite
    });
  }

  // ==========================================
  // ACT 2 (6s - 14s / Frames 360 - 840): CASE STUDY & DATA
  // "+340% REACH / 1.2M+ IMPRESSIONS"
  // ==========================================
  var act2Header = api.create("textShape", "Act2_Header_CaseStudy");
  if (act2Header) {
    api.set(act2Header, {
      "text": "CASE STUDY: 3-MONTH IMPACT",
      "fontSize": 36,
      "horizontalAlignment": 1,
      "position.x": 0,
      "position.y": -220,
      "material.materialColor": primaryPurple
    });
  }

  var act2StatNumber = api.create("textShape", "Act2_Stat_BigNumber");
  if (act2StatNumber) {
    api.set(act2StatNumber, {
      "text": "+340% REACH",
      "fontSize": 110,
      "horizontalAlignment": 1,
      "position.x": 0,
      "position.y": -110,
      "material.materialColor": primaryCyan
    });
  }

  // 4 Animated Growth Metric Bars
  var barColors = [primaryCyan, primaryBlue, primaryPurple, primaryPink];
  var barHeights = [90, 150, 220, 310];
  var barLayers = [];

  for (var b = 0; b < 4; b++) {
    var bar = api.primitive("rectangle", "Act2_GrowthBar_" + (b + 1));
    if (bar) {
      api.set(bar, {
        "position.x": -210 + (b * 140),
        "position.y": 160,
        "scale.x": 0.45,
        "scale.y": 0.01,
        "material.materialColor": barColors[b]
      });
      barLayers.push(bar);
    }
  }

  var act2Substat = api.create("textShape", "Act2_Footer_Stats");
  if (act2Substat) {
    api.set(act2Substat, {
      "text": "MONTH 1: +45%   →   MONTH 2: +180%   →   MONTH 3: +340%",
      "fontSize": 20,
      "horizontalAlignment": 1,
      "position.x": 0,
      "position.y": 270,
      "material.materialColor": textMuted
    });
  }

  // ==========================================
  // ACT 3 (14s - 22s / Frames 840 - 1320): STRATEGY PILLARS
  // 3 Staggered Editorial Cards
  // ==========================================
  var act3Header = api.create("textShape", "Act3_Pillars_Header");
  if (act3Header) {
    api.set(act3Header, {
      "text": "HOW WE GENERATE MEASURABLE GROWTH",
      "fontSize": 34,
      "horizontalAlignment": 1,
      "position.x": 0,
      "position.y": -220,
      "material.materialColor": primaryCyan
    });
  }

  var pillarTitles = ["01. CONTENT SYSTEM", "02. CONVERSION ENGINE", "03. VIRAL DISTRIBUTION"];
  var pillarSubs = ["High-Retention Formats", "Followers → Buyers", "Multi-Platform Scale"];
  var pillarColors = [primaryCyan, primaryPurple, primaryPink];
  var pillarCards = [];
  var pillarTextLayers = [];

  for (var p = 0; p < 3; p++) {
    var card = api.primitive("rectangle", "Act3_Card_" + (p + 1));
    if (card) {
      api.set(card, {
        "position.x": -340 + (p * 340),
        "position.y": 10,
        "scale.x": 1.45,
        "scale.y": 1.60,
        "material.materialColor": "#141C2E"
      });
      pillarCards.push(card);
    }

    var cardTitle = api.create("textShape", "Act3_CardTitle_" + (p + 1));
    if (cardTitle) {
      api.set(cardTitle, {
        "text": pillarTitles[p],
        "fontSize": 20,
        "horizontalAlignment": 1,
        "position.x": -340 + (p * 340),
        "position.y": -50,
        "material.materialColor": pillarColors[p]
      });
      pillarTextLayers.push(cardTitle);
    }

    var cardSub = api.create("textShape", "Act3_CardSub_" + (p + 1));
    if (cardSub) {
      api.set(cardSub, {
        "text": pillarSubs[p],
        "fontSize": 18,
        "horizontalAlignment": 1,
        "position.x": -340 + (p * 340),
        "position.y": 10,
        "material.materialColor": textWhite
      });
      pillarTextLayers.push(cardSub);
    }
  }

  // ==========================================
  // ACT 4 (22s - 30s / Frames 1320 - 1800): CTA & OUTRO
  // "ELEVATE YOUR BRAND // TRANSFORM FOLLOWERS"
  // ==========================================
  var act4Title = api.create("textShape", "Act4_CTA_Title");
  if (act4Title) {
    api.set(act4Title, {
      "text": "ELEVATE YOUR BRAND",
      "fontSize": 105,
      "horizontalAlignment": 1,
      "position.x": 0,
      "position.y": -110,
      "material.materialColor": primaryCyan
    });
  }

  var act4Sub = api.create("textShape", "Act4_CTA_Sub");
  if (act4Sub) {
    api.set(act4Sub, {
      "text": "STAND OUT EVERYWHERE WITH A PROVEN STRATEGY",
      "fontSize": 26,
      "horizontalAlignment": 1,
      "position.x": 0,
      "position.y": -20,
      "material.materialColor": textWhite
    });
  }

  var act4Button = api.primitive("rectangle", "Act4_CTA_Button");
  if (act4Button) {
    api.set(act4Button, {
      "position.x": 0,
      "position.y": 80,
      "scale.x": 2.2,
      "scale.y": 0.38,
      "material.materialColor": primaryPink
    });
  }

  var act4ButtonText = api.create("textShape", "Act4_CTA_ButtonText");
  if (act4ButtonText) {
    api.set(act4ButtonText, {
      "text": "LET'S BUILD YOUR STRATEGY →",
      "fontSize": 24,
      "horizontalAlignment": 1,
      "position.x": 0,
      "position.y": 88,
      "material.materialColor": textWhite
    });
  }

  var act4AgencyFooter = api.create("textShape", "Act4_Agency_Footer");
  if (act4AgencyFooter) {
    api.set(act4AgencyFooter, {
      "text": "MKT IDEAS AGENCY • WWW.MKTIDEAS.AGENCY • 2026",
      "fontSize": 18,
      "horizontalAlignment": 1,
      "position.x": 0,
      "position.y": 240,
      "material.materialColor": textMuted
    });
  }

  // ==========================================
  // KEYFRAME TIMING & CHOREOGRAPHY ACROSS 1800 FRAMES
  // ==========================================
  for (var f = 0; f <= totalFrames; f += 2) {
    // --- ACT 1: Frames 0 - 360 (0s - 6s) ---
    var a1Op = 0;
    var a1Y = 0;
    var a1Scale = 1.0;
    if (f < 30) {
      var p = f / 30;
      a1Op = Math.round(easeOutCubic(p) * 100);
      a1Y = 40 * (1 - easeOutBack(p, 1.1));
      a1Scale = 0.92 + 0.08 * easeOutBack(p, 1.1);
    } else if (f <= 310) {
      a1Op = 100;
      a1Y = Math.sin((f - 30) * 0.03) * 3;
      a1Scale = 1.0 + Math.sin((f - 30) * 0.02) * 0.015;
    } else if (f <= 360) {
      var pOut = (f - 310) / 50;
      a1Op = Math.round((1 - easeInOutCubic(pOut)) * 100);
      a1Y = -50 * easeInOutCubic(pOut);
      a1Scale = 1.0 + 0.05 * pOut;
    }

    addKeyframe(act1Title, f, { "opacity": a1Op, "position.y": Math.round((-60 + a1Y) * 10) / 10, "scale.x": a1Scale, "scale.y": a1Scale });
    addKeyframe(act1Subtitle, f, { "opacity": a1Op, "position.y": Math.round((45 + a1Y) * 10) / 10 });
    addKeyframe(act1TagBadge, f, { "opacity": a1Op, "scale.x": 1.6 * a1Scale, "scale.y": 0.22 * a1Scale });
    addKeyframe(act1TagText, f, { "opacity": a1Op });

    // --- ACT 2: Frames 360 - 840 (6s - 14s) ---
    var a2Op = 0;
    var a2Y = 0;
    if (f < 360) {
      a2Op = 0;
    } else if (f <= 410) {
      var p2 = (f - 360) / 50;
      a2Op = Math.round(easeOutCubic(p2) * 100);
      a2Y = 30 * (1 - easeOutBack(p2, 1.1));
    } else if (f <= 790) {
      a2Op = 100;
      a2Y = Math.sin((f - 410) * 0.025) * 3;
    } else if (f <= 840) {
      var p2Out = (f - 790) / 50;
      a2Op = Math.round((1 - easeInOutCubic(p2Out)) * 100);
      a2Y = -40 * easeInOutCubic(p2Out);
    }

    addKeyframe(act2Header, f, { "opacity": a2Op, "position.y": Math.round((-220 + a2Y) * 10) / 10 });
    addKeyframe(act2StatNumber, f, { "opacity": a2Op, "position.y": Math.round((-110 + a2Y) * 10) / 10 });
    addKeyframe(act2Substat, f, { "opacity": a2Op });

    // Staggered Growth Bars
    for (var bi = 0; bi < barLayers.length; bi++) {
      var barStart = 410 + (bi * 20);
      var barScaleY = 0.01;
      var barY = 160;
      if (f >= barStart && f <= 790) {
        var bp = Math.min(1, (f - barStart) / 45);
        var be = easeOutBack(bp, 1.2);
        var targetH = (barHeights[bi] / 200);
        barScaleY = Math.max(0.01, targetH * be);
        barY = 160 - (barHeights[bi] * be * 0.5);
      } else if (f > 790 && f <= 840) {
        var targetH2 = (barHeights[bi] / 200);
        barScaleY = targetH2 * (1 - (f - 790) / 50);
        barY = 160 - (barHeights[bi] * 0.5);
      }
      addKeyframe(barLayers[bi], f, { "scale.y": Math.round(barScaleY * 1000) / 1000, "position.y": Math.round(barY), "opacity": a2Op });
    }

    // --- ACT 3: Frames 840 - 1320 (14s - 22s) ---
    var a3Op = 0;
    if (f < 840) {
      a3Op = 0;
    } else if (f <= 890) {
      var p3 = (f - 840) / 50;
      a3Op = Math.round(easeOutCubic(p3) * 100);
    } else if (f <= 1270) {
      a3Op = 100;
    } else if (f <= 1320) {
      var p3Out = (f - 1270) / 50;
      a3Op = Math.round((1 - easeInOutCubic(p3Out)) * 100);
    }

    addKeyframe(act3Header, f, { "opacity": a3Op });

    // Staggered Cards (Rotate into view with spring)
    for (var ci = 0; ci < pillarCards.length; ci++) {
      var cStart = 870 + (ci * 25);
      var cScale = 0.0;
      var cRot = 0;
      if (f >= cStart && f <= 1270) {
        var cp = Math.min(1, (f - cStart) / 45);
        var ce = easeOutBack(cp, 1.15);
        cScale = ce;
        cRot = (1 - ce) * 8; // Gentle twist settling to 0
      } else if (f > 1270 && f <= 1320) {
        cScale = 1 - ((f - 1270) / 50);
      }
      addKeyframe(pillarCards[ci], f, { "scale.x": Math.round(1.45 * cScale * 1000) / 1000, "scale.y": Math.round(1.60 * cScale * 1000) / 1000, "rotation.z": Math.round(cRot * 10) / 10, "opacity": a3Op });
    }
    for (var ti = 0; ti < pillarTextLayers.length; ti++) {
      addKeyframe(pillarTextLayers[ti], f, { "opacity": a3Op });
    }

    // --- ACT 4: Frames 1320 - 1800 (22s - 30s) ---
    var a4Op = 0;
    var a4Y = 0;
    var btnPulse = 1.0;
    if (f < 1320) {
      a4Op = 0;
    } else if (f <= 1380) {
      var p4 = (f - 1320) / 60;
      a4Op = Math.round(easeOutCubic(p4) * 100);
      a4Y = 35 * (1 - easeOutBack(p4, 1.15));
    } else if (f <= 1740) {
      a4Op = 100;
      btnPulse = 1.0 + Math.abs(Math.sin((f - 1380) * 0.05)) * 0.05; // Pulsing CTA
    } else {
      // Loop settle
      var p4End = (f - 1740) / 60;
      a4Op = Math.round((1 - easeInOutCubic(p4End)) * 100);
    }

    addKeyframe(act4Title, f, { "opacity": a4Op, "position.y": Math.round((-110 + a4Y) * 10) / 10 });
    addKeyframe(act4Sub, f, { "opacity": a4Op, "position.y": Math.round((-20 + a4Y) * 10) / 10 });
    addKeyframe(act4Button, f, { "opacity": a4Op, "scale.x": Math.round(2.2 * btnPulse * 1000) / 1000, "scale.y": Math.round(0.38 * btnPulse * 1000) / 1000 });
    addKeyframe(act4ButtonText, f, { "opacity": a4Op, "scale.x": Math.round(btnPulse * 1000) / 1000, "scale.y": Math.round(btnPulse * 1000) / 1000 });
    addKeyframe(act4AgencyFooter, f, { "opacity": a4Op });
  }

  // Rewind playhead to frame 0 and trigger playback
  api.setFrame(0);
  api.play();

  console.log("[MCP] ✓ 30-Second 'Growth Proof' Agency Reel created and playing (1800 frames)!");
  return "30s Agency Reel created successfully!";
})();
`;

async function main() {
  console.log("Dispatching 30-Second 'Growth Proof' Reel to Cavalry at http://localhost:8080/post...");
  try {
    const res = await axios.post("http://localhost:8080/post", {
      type: "script",
      code: agencyReelScript
    }, {
      timeout: 25000,
      headers: { "Content-Type": "application/json" }
    });

    console.log("[✓] Success! Cavalry response:", res.data);
    console.log("✓ 30-second 'Growth Proof' agency showreel created and playing in Cavalry!");
  } catch (err) {
    console.error("[✗] Error communicating with Cavalry:", err.message);
  }
}

main();
