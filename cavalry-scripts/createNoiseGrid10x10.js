/**
 * Cavalry 2D Motion Graphics - 10x10 Duplicator Grid with Animated Noise Modifier
 * 
 * Hierarchy & Node Graph:
 * - Base Shape: Rounded Square (`rectangle` primitive with corner radius & cyan material)
 * - Duplicator: `duplicator` node referencing the rounded square
 * - Distribution: `gridDistribution` (10x10 count, 900x900px area)
 * - Modifiers:
 *   - `noise` (Scale): Modulates `shapeScale.x` and `shapeScale.y` with organic pulsing waves
 *   - `noise` (Rotation): Modulates `shapeRotation.z` for subtle dynamic angle variation
 * 
 * Execution:
 * Paste in Cavalry (Scripts -> Script Editor) or execute via MCP (`cavalry_run_script`).
 */

(function createNoiseGrid() {
  if (typeof api === "undefined") {
    console.error("This script must be executed inside Cavalry.");
    return;
  }

  console.log("[MCP] Creating 10x10 Animated Noise Duplicator Grid...");

  try {
    // 1. Create Base Rounded Square Shape (superEllipse primitive)
    var rectId = api.primitive ? api.primitive("superEllipse", "Rounded_Square_Shape") : api.create("basicShape", "Rounded_Square_Shape");
    if (rectId) {
      api.set(rectId, {
        "scale.x": 0.28,
        "scale.y": 0.28,
        "material.materialColor": "#00F2FE" // Electric Cyan
      });
    }

    // 2. Create Duplicator Node
    var dupId = api.create("duplicator", "Noise_Grid_Duplicator");
    if (dupId && rectId) {
      api.connect(rectId, "id", dupId, "shapes");
    }

    // 3. Create 10x10 Grid Distribution
    var gridId = api.create("gridDistribution", "Grid_10x10_Distribution");
    if (gridId && dupId) {
      api.set(gridId, {
        "count.x": 10,
        "count.y": 10,
        "size.x": 900,
        "size.y": 900
      });
      api.connect(gridId, "id", dupId, "distribution");
    }

    // 4. Create Animated Scale Noise Modifier
    var noiseId = api.create("noise", "Scale_Noise_Modifier");
    if (noiseId && dupId) {
      api.set(noiseId, {
        "frequency": 0.6,
        "amplitude": 1.4,
        "minimum": 0.15,
        "maximum": 1.25,
        "animated": true,
        "animationSpeed": 1.2
      });

      api.connect(noiseId, "id", dupId, "shapeScale.x");
      api.connect(noiseId, "id", dupId, "shapeScale.y");
    }

    // 5. Create Dynamic Rotation Noise Modifier
    var rotNoiseId = api.create("noise", "Rotation_Noise_Modifier");
    if (rotNoiseId && dupId) {
      api.set(rotNoiseId, {
        "frequency": 0.4,
        "amplitude": 45,
        "minimum": -30,
        "maximum": 30,
        "animated": true,
        "animationSpeed": 0.8
      });
      api.connect(rotNoiseId, "id", dupId, "shapeRotation.z");
    }

    // 6. Reset Timeline and Start Playback
    if (typeof api.setFrame === "function") {
      api.setFrame(0);
    }
    if (typeof api.play === "function") {
      api.play();
    }

    console.log("[✓] 10x10 Animated Noise Grid generated successfully!");

    return {
      success: true,
      grid: "10x10",
      shape: rectId,
      duplicator: dupId,
      distribution: gridId,
      modifiers: [noiseId, rotNoiseId]
    };
  } catch (err) {
    console.error("Failed to create noise grid:", err);
    throw err;
  }
})();
