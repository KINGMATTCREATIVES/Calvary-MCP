// 03_geometric_mandala.js
// Creates a hypnotic geometric radial mandala in Cavalry

(function() {
    console.log("Generating Geometric Mandala in Cavalry...");

    // 1. Create Base Shape (Ellipse Petal via api.primitive)
    var petalId = api.primitive("ellipse", "Mandala_Petal");
    if (petalId) {
        api.set(petalId, {
            "scale.x": 0.15, // 30px
            "scale.y": 0.90, // 180px
            "material.materialColor": "#FF2A85" // Hot Pink
        });
    }

    // 2. Create Duplicator
    var dupId = api.create("duplicator", "Mandala_Duplicator");
    if (dupId && petalId) {
        api.connect(petalId, "id", dupId, "shapes");
    }

    // 3. Create Circle Distribution
    var circleDistId = api.create("circleDistribution", "Radial_Array");
    if (circleDistId && dupId) {
        api.set(circleDistId, {
            "count": 24,
            "radius": 150
        });
        api.connect(circleDistId, "id", dupId, "distribution");
    }

    // 4. Create Oscillator for continuous rotation
    var oscId = api.create("oscillator", "Mandala_Spin");
    if (oscId && dupId) {
        api.set(oscId, {
            "frequency": 0.5,
            "amplitude": 360,
            "offset": 0
        });
        api.connect(oscId, "id", dupId, "rotation.z");
    }

    console.log("✓ Geometric Mandala created successfully.");
    return "Mandala created successfully!";
})();
