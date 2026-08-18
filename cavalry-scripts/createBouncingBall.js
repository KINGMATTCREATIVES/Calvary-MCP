/**
 * Cavalry 2D Motion Graphics - Procedural Bouncing Ball Generator (Fully Colored)
 * 
 * Implements classical animation principles:
 * - Parabolic gravity curve / Ease-in on descent, ease-out on ascent
 * - Squash & Stretch deformation aligned with velocity vector
 * - Dynamic contact shadow synchronized with height and contact timing
 * - Impact dust/ring shockwave
 * - Dedicated color materials connected to each shape layer
 * 
 * Usage:
 * 1. Open Cavalry
 * 2. Scripts -> Script Editor (or run via MCP Bridge `cavalry_run_script`)
 * 3. Paste and run this script
 */

(function createBouncingBallScene() {
    if (typeof api === "undefined") {
        console.error("This script must be executed inside Cavalry.");
        return;
    }

    try {
        // --- Helper to create and connect Color Material ---
        function createColorMaterial(name, hex, r, g, b, a) {
            var cNode = api.create("color", name);
            if (cNode) {
                api.set(cNode, {
                    "color": hex,
                    "color.hex": hex,
                    "color.r": r !== undefined ? r : 255,
                    "color.g": g !== undefined ? g : 255,
                    "color.b": b !== undefined ? b : 255,
                    "color.a": a !== undefined ? a : 255
                });
            }
            return cNode;
        }

        function applyColorToShape(shapeId, colorNodeId) {
            if (!shapeId || !colorNodeId) return;
            try {
                api.connect(colorNodeId, "id", shapeId, "material");
            } catch (e) {
                console.warn("Could not connect material via id:", e);
            }
        }

        // --- Configuration ---
        var totalFrames = 60;
        var groundY = 220;
        var apexY = -260;
        var dropHeight = groundY - apexY;
        var radius = 48;

        // 1. Create Materials
        var floorColor = createColorMaterial("Floor_Mat", "#4C566A", 76, 86, 106, 255);
        var shadowColor = createColorMaterial("Shadow_Mat", "#111625", 17, 22, 37, 180);
        var ballColor = createColorMaterial("Ball_Mat", "#FF3366", 255, 51, 102, 255);
        var specularColor = createColorMaterial("Specular_Mat", "#FFFFFF", 255, 255, 255, 220);
        var shockwaveColor = createColorMaterial("Shockwave_Mat", "#FF8A80", 255, 138, 128, 240);

        // 2. Create Ground Line
        var ground = api.create("basicShape", "Floor_Line");
        if (ground) {
            api.set(ground, {
                "shapeType": 0, // Rectangle
                "size.x": 1000,
                "size.y": 4,
                "position.x": 0,
                "position.y": groundY + radius
            });
            applyColorToShape(ground, floorColor);
        }

        // 3. Create Impact Shockwave
        var shockwave = api.create("basicShape", "Impact_Shockwave");
        if (shockwave) {
            api.set(shockwave, {
                "shapeType": 1, // Circle
                "radius": radius * 0.5,
                "position.x": 0,
                "position.y": groundY + radius - 2,
                "opacity": 0
            });
            applyColorToShape(shockwave, shockwaveColor);
        }

        // 4. Create Ground Shadow
        var shadow = api.create("basicShape", "Ball_Shadow");
        if (shadow) {
            api.set(shadow, {
                "shapeType": 1, // Ellipse
                "size.x": radius * 2.2,
                "size.y": radius * 0.35,
                "position.x": 0,
                "position.y": groundY + radius - 2
            });
            applyColorToShape(shadow, shadowColor);
        }

        // 5. Create Ball
        var ball = api.create("basicShape", "Bouncing_Ball_Core");
        if (!ball) {
            console.error("Failed to create ball layer.");
            return;
        }

        api.set(ball, {
            "shapeType": 1, // Circle
            "radius": radius,
            "position.x": 0,
            "position.y": apexY
        });
        applyColorToShape(ball, ballColor);

        // 6. Create Specular
        var specular = api.create("basicShape", "Ball_Specular");
        if (specular) {
            api.set(specular, {
                "shapeType": 1,
                "radius": radius * 0.28,
                "position.x": -radius * 0.25,
                "position.y": apexY - radius * 0.25,
                "opacity": 75
            });
            applyColorToShape(specular, specularColor);
        }

        // 7. Keyframes
        function addKeyframes(layerId, frame, attrs) {
            if (typeof api.keyframe === "function") {
                api.keyframe(layerId, frame, attrs);
            } else if (typeof api.setKeyframe === "function") {
                for (var k in attrs) {
                    if (attrs.hasOwnProperty(k)) {
                        api.setKeyframe(layerId, k, frame, attrs[k]);
                    }
                }
            }
        }

        var fImpact = 26;
        var fReboundEnd = 54;

        for (var f = 0; f <= totalFrames; f++) {
            var posY, scaleX, scaleY, shadowScale, shadowOpacity, shockScale = 1, shockOpacity = 0;

            if (f <= fImpact) {
                var t = f / fImpact;
                var fallCurve = Math.pow(t, 2.2);
                posY = apexY + (dropHeight * fallCurve);

                if (t < 0.7) {
                    var st = t / 0.7;
                    scaleX = 100 - (st * 8);
                    scaleY = 100 + (st * 8);
                } else if (t < 0.95) {
                    var st2 = (t - 0.7) / 0.25;
                    scaleX = 92 - (st2 * 14);
                    scaleY = 108 + (st2 * 18);
                } else {
                    var st3 = (t - 0.95) / 0.05;
                    scaleX = 78 + (st3 * 67);
                    scaleY = 126 - (st3 * 64);
                }

                shadowScale = 35 + (fallCurve * 75);
                shadowOpacity = 15 + (fallCurve * 65);

            } else if (f <= fImpact + 3) {
                var rebT = (f - fImpact) / 3;
                posY = groundY - (rebT * 25);
                scaleX = 145 - (rebT * 63);
                scaleY = 62 + (rebT * 58);

                shadowScale = 110 - (rebT * 30);
                shadowOpacity = 80 - (rebT * 25);

                shockScale = 1.0 + (rebT * 2.5);
                shockOpacity = Math.round((1 - rebT) * 90);

            } else if (f <= fReboundEnd) {
                var upT = (f - (fImpact + 3)) / (fReboundEnd - (fImpact + 3));
                var riseCurve = 1 - Math.pow(1 - upT, 1.9);
                posY = (groundY - 25) - ((groundY - 25 - apexY) * riseCurve);

                var stretchRelax = 1 - upT;
                scaleX = 100 - (stretchRelax * 16);
                scaleY = 100 + (stretchRelax * 18);

                shadowScale = 80 - (riseCurve * 45);
                shadowOpacity = 55 - (riseCurve * 40);

            } else {
                var apexT = (f - fReboundEnd) / (totalFrames - fReboundEnd);
                posY = apexY - (Math.sin(apexT * Math.PI) * 4);
                scaleX = 100;
                scaleY = 100;
                shadowScale = 35;
                shadowOpacity = 15;
            }

            addKeyframes(ball, f, {
                "position.y": Math.round(posY * 10) / 10,
                "scale.x": Math.round(scaleX * 10) / 10,
                "scale.y": Math.round(scaleY * 10) / 10
            });

            if (specular) {
                addKeyframes(specular, f, {
                    "position.y": Math.round((posY - (radius * 0.25 * (scaleY / 100))) * 10) / 10,
                    "scale.x": Math.round(scaleX * 0.9 * 10) / 10,
                    "scale.y": Math.round(scaleY * 0.9 * 10) / 10
                });
            }

            if (shadow) {
                addKeyframes(shadow, f, {
                    "scale.x": Math.round(shadowScale * 10) / 10,
                    "scale.y": Math.round(shadowScale * 0.9 * 10) / 10,
                    "opacity": Math.round(shadowOpacity)
                });
            }

            if (shockwave) {
                addKeyframes(shockwave, f, {
                    "scale.x": Math.round(shockScale * 100) / 100,
                    "scale.y": Math.round((shockScale * 0.35) * 100) / 100,
                    "opacity": shockOpacity
                });
            }
        }

        if (typeof api.setFrame === "function") api.setFrame(0);
        if (typeof api.play === "function") api.play();

        console.log("Bouncing Ball procedural animation generated successfully!");
        return {
            ballId: ball,
            shadowId: shadow,
            groundId: ground,
            frames: totalFrames
        };
    } catch (e) {
        console.error("Error generating bouncing ball: " + e.toString());
        throw e;
    }
})();
