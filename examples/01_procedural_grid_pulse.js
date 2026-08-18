// 01_procedural_grid_pulse.js
// Creates a 10x10 pulsating procedural grid in Cavalry

(function() {
    console.log("Generating Procedural Noise Grid...");

    // 1. Create Base Shape (Rounded Rectangle)
    var rectId = api.create("basicShape", "Matrix Node");
    api.set(rectId, {
        "shapeType": 0, // Rectangle
        "width": 40,
        "height": 40,
        "cornerRadius": 12,
        "color": "#00E5FF" // Neon Cyan
    });

    // 2. Create Duplicator
    var dupId = api.create("duplicator", "Grid Duplicator");
    api.connect(rectId, "id", dupId, "generator");

    // 3. Create Grid Distribution
    var gridId = api.create("gridDistribution", "Grid Layout");
    api.set(gridId, {
        "count.x": 10,
        "count.y": 10,
        "size.x": 700,
        "size.y": 700
    });
    api.connect(gridId, "id", dupId, "distribution");

    // 4. Create Noise Generator for Dynamic Scale & Motion
    var noiseId = api.create("noise", "Pulse Noise");
    api.set(noiseId, {
        "frequency": 0.4,
        "speed": 2.0,
        "minimum": 0.2,
        "maximum": 1.6
    });
    api.connect(noiseId, "id", dupId, "shapeScale");

    console.log("Procedural Noise Grid generated successfully!");
    return "Grid created with " + dupId;
})();
