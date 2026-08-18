/**
 * Cavalry 2D Motion Graphics - 12-Principles Colored Bouncing Ball (Downward to Floor)
 * 
 * In Calvary's coordinate space (+Y is UP, -Y is DOWN):
 * - Apex / Peak: +240px (Top of screen)
 * - Floor / Ground: -180px (Bottom of screen)
 * 
 * Generates a classical downward bounce cycle:
 * 1. Ball starts at apex (+240px at top)
 * 2. Accelerates DOWNWARD due to gravity (cubic power ease-in)
 * 3. Impacts the floor at bottom (-180px) with horizontal squash & vertical compression
 * 4. Ground shadow at the bottom expands and darkens on contact
 * 5. Impact shockwave ring ripples across the bottom floor
 * 6. Ball rebounds UPWARD against gravity (ease-out deceleration) back to apex
 */

(function createDownwardBouncingBall() {
    if (typeof api === "undefined") {
        console.error("This script must be executed inside Calvary.");
        return;
    }

    console.log("[MCP] Creating Downward Bouncing Ball Animation in Calvary...");

    try {
        var totalFrames = 120;  // 2.0 seconds at 60 FPS
        var bounceCadence = 30; // 30 frames per complete bounce cycle (4 full bounces)
        var apexY = 240;        // Peak / High point (Top of screen)
        var groundY = -180;     // Floor contact (Bottom of screen)
        var dropDistance = apexY - groundY; // 420px drop downward
        var radius = 55;
        var baseScale = (radius * 2) / 200; // 0.55 (110px sphere)

        // 1. Create Ground Floor Line at the BOTTOM of screen
        var ground = api.primitive("rectangle", "Floor_Line");
        if (ground) {
            api.set(ground, {
                "position.x": 0,
                "position.y": groundY - radius, // Below the contact point
                "scale.x": 5.0,                  // 1000px wide
                "scale.y": 0.02,                 // 4px tall
                "material.materialColor": "#1E293B" // Deep Slate
            });
        }

        // 2. Create Impact Shockwave at the bottom floor
        var shockwave = api.primitive("ellipse", "Impact_Shockwave");
        if (shockwave) {
            api.set(shockwave, {
                "position.x": 0,
                "position.y": groundY - radius + 2,
                "scale.x": 0.01,
                "scale.y": 0.01,
                "opacity": 0,
                "material.materialColor": "#FF8A80" // Soft Coral
            });
        }

        // 3. Create Contact Shadow on the bottom floor
        var shadow = api.primitive("ellipse", "Ball_Shadow");
        if (shadow) {
            api.set(shadow, {
                "position.x": 0,
                "position.y": groundY - radius + 2,
                "scale.x": 0.65,
                "scale.y": 0.10,
                "material.materialColor": "#0F172A" // Dark Charcoal
            });
        }

        // 4. Create Main Bouncing Ball
        var ball = api.primitive("ellipse", "Bouncing_Ball_Core");
        if (!ball) {
            console.error("[MCP] Failed to create ball layer.");
            return;
        }

        api.set(ball, {
            "position.x": 0,
            "position.y": apexY,
            "scale.x": baseScale,
            "scale.y": baseScale,
            "material.materialColor": "#FF3366" // Electric Coral/Red
        });

        // 5. Generate Keyframes for 4 complete downward bounce cycles
        if (typeof api.keyframe === "function") {
            for (var cycle = 0; cycle < 4; cycle++) {
                var startFrame = cycle * bounceCadence;
                var fallDuration = 14;
                var impactFrame = startFrame + fallDuration; // Frame 14
                var maxSquashFrame = impactFrame + 2;        // Frame 16
                var leaveGroundFrame = maxSquashFrame + 2;   // Frame 18
                var nextApexFrame = startFrame + bounceCadence; // Frame 30

                // Phase 1: Falling DOWNWARD from Apex (+240) to Ground (-180)
                for (var f = startFrame; f <= impactFrame; f++) {
                    var progress = (f - startFrame) / fallDuration; // 0 -> 1
                    var easedGravity = Math.pow(progress, 2.4); // Gravity power acceleration downwards
                    var currentY = apexY - (dropDistance * easedGravity); // Drops from +240 down to -180

                    // Stretch vertically along downward velocity vector
                    var stretchFactor = 1.0 + (0.28 * Math.pow(progress, 1.8));
                    var squashFactor = 1.0 / stretchFactor;

                    // Shadow darkens & expands as ball nears bottom floor
                    var shadowScale = 0.35 + (0.65 * progress);
                    var shadowOpacity = 15 + (70 * progress);

                    api.keyframe(ball, f, {
                        "position.x": 0,
                        "position.y": Math.round(currentY),
                        "scale.x": Math.round(baseScale * squashFactor * 1000) / 1000,
                        "scale.y": Math.round(baseScale * stretchFactor * 1000) / 1000
                    });

                    if (shadow) {
                        api.keyframe(shadow, f, {
                            "scale.x": Math.round(0.65 * shadowScale * 1000) / 1000,
                            "scale.y": Math.round(0.10 * shadowScale * 1000) / 1000,
                            "opacity": Math.round(shadowOpacity)
                        });
                    }
                }

                // Phase 2: Maximum Squash at Floor Contact (Bottom)
                api.keyframe(ball, maxSquashFrame, {
                    "position.x": 0,
                    "position.y": groundY - 12, // Compress into floor
                    "scale.x": Math.round(baseScale * 1.45 * 1000) / 1000, // Squash wider
                    "scale.y": Math.round(baseScale * 0.68 * 1000) / 1000  // Compress flatter
                });

                if (shadow) {
                    api.keyframe(shadow, maxSquashFrame, {
                        "scale.x": 0.85,
                        "scale.y": 0.12,
                        "opacity": 95
                    });
                }

                // Trigger Shockwave ripple on floor impact
                if (shockwave) {
                    api.keyframe(shockwave, impactFrame, { "scale.x": 0.05, "scale.y": 0.02, "opacity": 90 });
                    api.keyframe(shockwave, maxSquashFrame + 5, { "scale.x": 1.25, "scale.y": 0.22, "opacity": 0 });
                }

                // Phase 3: Launch / Push-off upwards
                api.keyframe(ball, leaveGroundFrame, {
                    "position.x": 0,
                    "position.y": groundY + 25,
                    "scale.x": Math.round(baseScale * 0.80 * 1000) / 1000,
                    "scale.y": Math.round(baseScale * 1.25 * 1000) / 1000
                });

                // Phase 4: Rising UPWARD from Floor (-180) to Apex (+240)
                var riseDuration = nextApexFrame - leaveGroundFrame;
                for (var f2 = leaveGroundFrame + 1; f2 <= nextApexFrame; f2++) {
                    var progressRise = (f2 - leaveGroundFrame) / riseDuration; // 0 -> 1
                    var easedRise = 1 - Math.pow(1 - progressRise, 2.2); // Deceleration against gravity
                    var currentRiseY = (groundY + 25) + ((apexY - (groundY + 25)) * easedRise);

                    // Revert to round sphere near peak
                    var stretchRise = 1.25 - (0.25 * progressRise);
                    var squashRise = 1.0 / stretchRise;

                    var shadowScaleRise = 1.0 - (0.65 * progressRise);
                    var shadowOpacityRise = 85 - (70 * progressRise);

                    api.keyframe(ball, f2, {
                        "position.x": 0,
                        "position.y": Math.round(currentRiseY),
                        "scale.x": Math.round(baseScale * squashRise * 1000) / 1000,
                        "scale.y": Math.round(baseScale * stretchRise * 1000) / 1000
                    });

                    if (shadow) {
                        api.keyframe(shadow, f2, {
                            "scale.x": Math.round(0.65 * shadowScaleRise * 1000) / 1000,
                            "scale.y": Math.round(0.10 * shadowScaleRise * 1000) / 1000,
                            "opacity": Math.round(shadowOpacityRise)
                        });
                    }
                }
            }
        }

        // Rewind and trigger live playback
        api.setFrame(0);
        api.play();

        console.log("[MCP] ✓ Downward Bouncing Ball created and playing (Frames 0 to " + totalFrames + ")!");
        return "Downward Bouncing Ball created successfully!";
    } catch (err) {
        console.error("[MCP] Error creating downward bouncing ball:", err);
    }
})();
