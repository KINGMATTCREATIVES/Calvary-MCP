// 03_geometric_mandala.js
// Creates a hypnotic geometric radial mandala in Cavalry

(function() {
    console.log("Generating Geometric Radial Mandala...");

    // 1. Create Base Ellipse Shape
    var shapeId = api.create("basicShape", "Petal Shape");
    api.set(shapeId, {
        "shapeType": 1, // Ellipse
        "radius": 140,
        "scale.x": 0.35,
        "scale.y": 1.0,
        "color": "#7C4DFF" // Purple
    });

    // 2. Create Duplicator
    var dupId = api.create("duplicator", "Radial Duplicator");
    api.connect(shapeId, "id", dupId, "generator");

    // 3. Create Circle Distribution
    var distId = api.create("circleDistribution", "Radial Distribution");
    api.set(distId, {
        "count": 24,
        "radius": 180
    });
    api.connect(distId, "id", dupId, "distribution");

    // 4. Connect an oscillator to rotate the mandala
    var oscId = api.create("oscillator", "Rotation Speed");
    api.set(oscId, {
        "frequency": 0.5,
        "amplitude": 360
    });
    api.connect(oscId, "id", dupId, "rotation");

    console.log("Geometric Mandala generated!");
    return "Mandala created with " + dupId;
})();
