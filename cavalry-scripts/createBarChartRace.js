/**
 * Cavalry 2D Motion Graphics - Quarterly Metrics Bar Chart Race Generator
 * 
 * Features:
 * - 5 competing quarterly business units with realistic growth trajectories
 * - Smooth rank overtaking transitions (Y-position glide based on continuous rank)
 * - Dynamic bar width growth with easing
 * - Real-time value ticker updates ($M) and Quarter counter (Q1 -> Q4 2026)
 * - Premium modern motion design palette & hierarchy
 */

(function createBarChartRaceScene() {
  if (typeof api === "undefined") {
    console.error("This script must be executed inside Cavalry.");
    return;
  }

  api.log("[MCP] Building Animated Bar Chart Race on active composition...");

  // --- Configuration ---
  var totalFrames = 240; // 4 seconds @ 60fps
  var chartLeftX = -320; // Left baseline of the bars
  var chartTopY = -140;  // Top rank Y position
  var barHeight = 44;
  var barGap = 20;
  var maxBarWidth = 640;
  var maxMetricValue = 160; // Scale domain ($160M max)

  // --- Dataset (Quarterly Revenue in $M) ---
  var quarters = [
    { name: "Q1 2026", frame: 0 },
    { name: "Q2 2026", frame: 70 },
    { name: "Q3 2026", frame: 140 },
    { name: "Q4 2026", frame: 200 }
  ];

  var seriesData = [
    {
      id: "cloud",
      label: "Cloud Platform",
      color: "#00F2FE", // Electric Cyan
      values: [42, 68, 105, 148]
    },
    {
      id: "ai",
      label: "AI Solutions",
      color: "#10B981", // Emerald Green
      values: [31, 59, 94, 132]
    },
    {
      id: "enterprise",
      label: "Enterprise SaaS",
      color: "#FFB300", // Radiant Gold
      values: [78, 88, 98, 112]
    },
    {
      id: "hardware",
      label: "Devices & HW",
      color: "#FF5252", // Coral Red
      values: [65, 70, 74, 79]
    },
    {
      id: "consumer",
      label: "Consumer Apps",
      color: "#8B5CF6", // Purple
      values: [24, 35, 46, 58]
    }
  ];

  // 1. Create Title & Header
  var titleNode = api.create("textShape", "Chart_Title");
  if (titleNode) {
    api.set(titleNode, {
      "text": "QUARTERLY REVENUE GROWTH ($M)",
      "fontSize": 24,
      "position.x": chartLeftX + (maxBarWidth / 2),
      "position.y": chartTopY - 70,
      "alignment.x": 0.5,
      "alignment.y": 0.5,
      "color": "#94A3B8"
    });
  }

  // 2. Create Big Quarter Display Badge (Bottom Right)
  var quarterBadge = api.create("textShape", "Quarter_Indicator");
  if (quarterBadge) {
    api.set(quarterBadge, {
      "text": "Q1 2026",
      "fontSize": 84,
      "position.x": chartLeftX + maxBarWidth - 40,
      "position.y": chartTopY + (seriesData.length * (barHeight + barGap)) - 10,
      "alignment.x": 1.0,
      "alignment.y": 0.5,
      "color": "#1E293B"
    });
  }

  // 3. Create Left Baseline Axis
  var axisLine = api.create("basicShape", "Chart_Axis_Line");
  if (axisLine) {
    api.set(axisLine, {
      "shapeType": 0, // Rectangle
      "size.x": 3,
      "size.y": (seriesData.length * (barHeight + barGap)) + 20,
      "position.x": chartLeftX - 10,
      "position.y": chartTopY + ((seriesData.length * (barHeight + barGap)) / 2) - (barGap / 2),
      "color": "#334155"
    });
  }

  // 4. Create Bar, Label, & Ticker Layers for each item
  var barNodes = {};
  for (var i = 0; i < seriesData.length; i++) {
    var item = seriesData[i];

    // Background Bar Track
    var trackId = api.create("basicShape", "Track_" + item.id);
    if (trackId) {
      api.set(trackId, {
        "shapeType": 0,
        "size.x": maxBarWidth,
        "size.y": barHeight,
        "position.x": chartLeftX + (maxBarWidth / 2),
        "position.y": chartTopY + (i * (barHeight + barGap)),
        "color": "#111827",
        "cornerRadius": 6
      });
    }

    // Active Animated Value Bar
    var barId = api.create("basicShape", "Bar_" + item.id);
    if (barId) {
      api.set(barId, {
        "shapeType": 0,
        "size.x": 10,
        "size.y": barHeight,
        "position.x": chartLeftX,
        "position.y": chartTopY + (i * (barHeight + barGap)),
        "color": item.color,
        "cornerRadius": 6
      });
    }

    // Category Label Text
    var labelId = api.create("textShape", "Label_" + item.id);
    if (labelId) {
      api.set(labelId, {
        "text": item.label,
        "fontSize": 17,
        "position.x": chartLeftX - 25,
        "position.y": chartTopY + (i * (barHeight + barGap)),
        "alignment.x": 1.0,
        "alignment.y": 0.5,
        "color": "#F8FAFC"
      });
    }

    // Metric Value Ticker Text ($M)
    var valId = api.create("textShape", "Value_" + item.id);
    if (valId) {
      api.set(valId, {
        "text": "$0M",
        "fontSize": 17,
        "position.x": chartLeftX + 30,
        "position.y": chartTopY + (i * (barHeight + barGap)),
        "alignment.x": 0.0,
        "alignment.y": 0.5,
        "color": "#F8FAFC"
      });
    }

    barNodes[item.id] = {
      bar: barId,
      track: trackId,
      label: labelId,
      val: valId,
      item: item
    };
  }

  // --- 5. Frame Interpolation Engine ---
  // Easing function (ease-in-out cubic)
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Helper: Get continuous interpolated value for an item at any frame
  function getItemValueAtFrame(item, frame) {
    if (frame <= quarters[0].frame) {
      // Intro grow from 0 to Q1 value
      var introProgress = Math.min(1, Math.max(0, frame / 30));
      return item.values[0] * easeInOutCubic(introProgress);
    }
    if (frame >= quarters[3].frame) {
      return item.values[3];
    }

    // Determine which quarter segment we are between
    for (var q = 0; q < quarters.length - 1; q++) {
      var qStart = quarters[q];
      var qEnd = quarters[q + 1];
      if (frame >= qStart.frame && frame <= qEnd.frame) {
        var progress = (frame - qStart.frame) / (qEnd.frame - qStart.frame);
        var eased = easeInOutCubic(progress);
        return item.values[q] + (item.values[q + 1] - item.values[q]) * eased;
      }
    }
    return item.values[3];
  }

  // Helper: Get active quarter string
  function getQuarterNameAtFrame(frame) {
    if (frame < quarters[1].frame) return "Q1 2026";
    if (frame < quarters[2].frame) return "Q2 2026";
    if (frame < quarters[3].frame) return "Q3 2026";
    return "Q4 2026";
  }

  // --- 6. Bake Keyframes (Step every 2 frames for ultra-smooth continuous ranks) ---
  if (typeof api.setKeyframe === "function") {
    var keyStep = 2;

    for (var f = 0; f <= totalFrames; f += keyStep) {
      // Calculate current value for all items at this frame
      var frameItems = [];
      for (var j = 0; j < seriesData.length; j++) {
        var it = seriesData[j];
        var val = getItemValueAtFrame(it, f);
        frameItems.push({ item: it, value: val });
      }

      // Sort by value descending to determine ranks
      frameItems.sort(function(a, b) {
        return b.value - a.value;
      });

      // Update Quarter Badge
      if (quarterBadge && f % 10 === 0) {
        api.setKeyframe(quarterBadge, "text", f, getQuarterNameAtFrame(f));
      }

      // Apply animated position & width for each item based on rank
      for (var rank = 0; rank < frameItems.length; rank++) {
        var entry = frameItems[rank];
        var nodes = barNodes[entry.item.id];
        if (!nodes) continue;

        var targetY = chartTopY + (rank * (barHeight + barGap));
        var widthPx = Math.max(8, (entry.value / maxMetricValue) * maxBarWidth);
        var centerX = chartLeftX + (widthPx / 2);
        var valText = "$" + Math.round(entry.value) + "M";

        // Keyframe Value Bar
        if (nodes.bar) {
          api.setKeyframe(nodes.bar, "size.x", f, Math.round(widthPx));
          api.setKeyframe(nodes.bar, "position.x", f, Math.round(centerX));
          api.setKeyframe(nodes.bar, "position.y", f, Math.round(targetY));
        }

        // Keyframe Track Bar
        if (nodes.track) {
          api.setKeyframe(nodes.track, "position.y", f, Math.round(targetY));
        }

        // Keyframe Label
        if (nodes.label) {
          api.setKeyframe(nodes.label, "position.y", f, Math.round(targetY));
        }

        // Keyframe Value Ticker
        if (nodes.val) {
          api.setKeyframe(nodes.val, "text", f, valText);
          api.setKeyframe(nodes.val, "position.x", f, Math.round(chartLeftX + widthPx + 14));
          api.setKeyframe(nodes.val, "position.y", f, Math.round(targetY));
        }
      }
    }
  }

  // Rewind playhead to frame 0
  if (typeof api.setFrame === "function") {
    api.setFrame(0);
  }

  api.log("[MCP] ✓ Bar Chart Race for Quarterly Metrics successfully generated (Frames 0 to " + totalFrames + ")!");
})();
