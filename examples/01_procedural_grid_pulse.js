// 01_procedural_grid_pulse.js
// Creates a 10x10 pulsating procedural grid in Cavalry

(function() {
    console.log("Generating Procedural Noise Grid in Cavalry...");

    // 1. Create Base Shape (Super Ellipse for smooth rounded square)
    var rectId = api.primitive("superEllipse", "Matrix_Node");
    if (rectId) {
        api.set(rectId, {
            "scale.x": 0.2, // 40px (default 200px * 0.2)
            "scale.y": 0.2,
            "material.materialColor": "#00E5FF" // Neon Cyan
        });
    }

    // 2. Create Duplicator
    var dupId = api.create("duplicator", "Grid_Duplicator");
    if (dupId && rectId) {
        api.connect(rectId, "id", dupId, "shapes");
    }

    // 3. Create Grid Distribution
    var gridId = api.create("gridDistribution", "Grid_Layout");
    if (gridId && dupId) {
        api.set(gridId, {
            "count.x": 10,
            "count.y": 10,
            "size.x": 800,
            "size.y": 800
        });
        api.connect(gridId, "id", dupId, "distribution");
    }

    // 4. Create Noise Value modifier
    var noiseId = api.create("noise", "Noise_Pulse");
    if (noiseId && dupId) {
        api.set(noiseId, {
            "frequency": 0.8,
            "amplitude": 1.5,
            "minimum": 0.2,
            "maximum": 1.2
        });
        api.connect(noiseId, "id", dupId, "shapeScale.x");
        api.connect(noiseId, "id", dupId, "shapeScale.y");
    }

    console.log("✓ Procedural Noise Grid created successfully.");
    return "Grid pulse created successfully!";
})();
