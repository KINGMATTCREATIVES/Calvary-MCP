/**
 * Cavalry 2D Motion Graphics - 12-Principles Colored Bouncing Ball
 * 
 * Generates a classical animation study featuring:
 * 1. Gravity Acceleration & Deceleration (Cubic Ease-In falling / Ease-Out rising)
 * 2. Squash and Stretch (Preserves volume: Sx * Sy = 1.0)
 * 3. Anticipation & Follow-Through
 * 4. Ground Shadow with dynamic opacity & scale tied to ball height
 * 5. Impact Shockwave ring on ground contact
 * 6. Clean Distinct Colors:
 *    - Ball Core: Electric Magenta-Red (#FF3366)
 *    - Floor Line: Deep Slate (#1E293B)
 *    - Contact Shadow: Semi-Transparent Charcoal (#0F172A)
 *    - Impact Shockwave: Soft Coral (#FF8A80)
 */

(function createBouncingBall12Principles() {
    if (typeof api === "undefined") {
        console.error("This script must be executed inside Cavalry.");
        return;
    }

    console.log("[MCP] Creating 12-Principles Bouncing Ball Animation in Cavalry...");

    try {
        var totalFrames = 120; // 2.0 seconds at 60 FPS
        var bounceCadence = 30; // 1 full bounce cycle = 30 frames
        var apexY = -240;      // High point
        var groundY = 160;     // Contact floor
        var dropHeight = groundY - apexY; // 400px drop
        var radius = 60;

        // 1. Create Floor Line Primitive (Rectangle)
        var ground = api.primitive("rectangle", "Floor_Line");
        if (ground) {
            api.set(ground, {
                "position.x": 0,
                "position.y": groundY + radius,
                "scale.x": 5.0, // 1000px wide
                "scale.y": 0.02, // 4px tall
                "material.materialColor": "#1E293B" // Deep Slate
            });
        }

        // 2. Create Impact Shockwave Primitive (Ellipse)
        var shockwave = api.primitive("ellipse", "Impact_Shockwave");
        if (shockwave) {
            api.set(shockwave, {
                "position.x": 0,
                "position.y": groundY + radius - 2,
                "scale.x": 0.01,
                "scale.y": 0.01,
                "opacity": 0,
                "material.materialColor": "#FF8A80" // Soft Coral
            });
        }

        // 3. Create Ground Shadow Primitive (Ellipse)
        var shadow = api.primitive("ellipse", "Ball_Shadow");
        if (shadow) {
            api.set(shadow, {
                "position.x": 0,
                "position.y": groundY + radius - 2,
                "scale.x": 0.66,
                "scale.y": 0.10,
                "material.materialColor": "#0F172A" // Dark Charcoal
            });
        }

        // 4. Create Main Ball Primitive (Ellipse)
        var ball = api.primitive("ellipse", "Bouncing_Ball_Core");
        if (!ball) {
            console.error("[MCP] Failed to create ball layer.");
            return;
        }

        api.set(ball, {
            "position.x": 0,
            "position.y": apexY,
            "scale.x": (radius * 2) / 200, // 0.60 (120px)
            "scale.y": (radius * 2) / 200,
            "material.materialColor": "#FF3366" // Electric Magenta-Red
        });

        // 5. Generate Keyframes for 4 complete bounce cycles
        if (typeof api.keyframe === "function") {
            for (var cycle = 0; cycle < 4; cycle++) {
                var startFrame = cycle * bounceCadence;
                var fallDuration = 14;
                var impactFrame = startFrame + fallDuration; // Frame 14
                var maxSquashFrame = impactFrame + 2;        // Frame 16
                var leaveGroundFrame = maxSquashFrame + 2;   // Frame 18
                var nextApexFrame = startFrame + bounceCadence; // Frame 30

                // Phase 1: Falling from Apex to Ground (Gravity acceleration)
                for (var f = startFrame; f <= impactFrame; f++) {
                    var progress = (f - startFrame) / fallDuration; // 0 -> 1
                    var easedY = Math.pow(progress, 2.4); // Power curve acceleration
                    var currentY = apexY + (dropHeight * easedY);

                    // Stretch increases with velocity (max ~1.28 stretch at contact)
                    var stretchFactor = 1.0 + (0.28 * Math.pow(progress, 1.8));
                    var squashFactor = 1.0 / stretchFactor;

                    // Shadow expands and darkens as ball nears floor
                    var shadowScale = 0.35 + (0.65 * progress);
                    var shadowOpacity = 15 + (65 * progress);

                    api.keyframe(ball, f, {
                        "position.x": 0,
                        "position.y": Math.round(currentY),
                        "scale.x": Math.round(0.60 * squashFactor * 1000) / 1000,
                        "scale.y": Math.round(0.60 * stretchFactor * 1000) / 1000
                    });

                    if (shadow) {
                        api.keyframe(shadow, f, {
                            "scale.x": Math.round(0.66 * shadowScale * 1000) / 1000,
                            "scale.y": Math.round(0.10 * shadowScale * 1000) / 1000,
                            "opacity": Math.round(shadowOpacity)
                        });
                    }
                }

                // Phase 2: Maximum Squash at Floor Contact
                api.keyframe(ball, maxSquashFrame, {
                    "position.x": 0,
                    "position.y": groundY + 18,
                    "scale.x": 0.88, // 1.46x wider
                    "scale.y": 0.41  // 0.68x flatter
                });

                if (shadow) {
                    api.keyframe(shadow, maxSquashFrame, {
                        "scale.x": 0.85,
                        "scale.y": 0.12,
                        "opacity": 90
                    });
                }

                // Trigger Shockwave ripple on impact
                if (shockwave) {
                    api.keyframe(shockwave, impactFrame, { "scale.x": 0.05, "scale.y": 0.02, "opacity": 90 });
                    api.keyframe(shockwave, maxSquashFrame + 4, { "scale.x": 1.20, "scale.y": 0.20, "opacity": 0 });
                }

                // Phase 3: Launch / Push-off
                api.keyframe(ball, leaveGroundFrame, {
                    "position.x": 0,
                    "position.y": groundY - 20,
                    "scale.x": 0.48, // 0.80x narrower
                    "scale.y": 0.75  // 1.25x stretched
                });

                // Phase 4: Rising from Floor to Apex (Deceleration against gravity)
                var riseDuration = nextApexFrame - leaveGroundFrame;
                for (var f2 = leaveGroundFrame + 1; f2 <= nextApexFrame; f2++) {
                    var progressRise = (f2 - leaveGroundFrame) / riseDuration; // 0 -> 1
                    var easedRise = 1 - Math.pow(1 - progressRise, 2.2); // Ease-out deceleration
                    var currentRiseY = (groundY - 20) - ((groundY - 20 - apexY) * easedRise);

                    // Revert to round sphere near apex
                    var stretchRise = 1.25 - (0.25 * progressRise);
                    var squashRise = 1.0 / stretchRise;

                    var shadowScaleRise = 1.0 - (0.65 * progressRise);
                    var shadowOpacityRise = 80 - (65 * progressRise);

                    api.keyframe(ball, f2, {
                        "position.x": 0,
                        "position.y": Math.round(currentRiseY),
                        "scale.x": Math.round(0.60 * squashRise * 1000) / 1000,
                        "scale.y": Math.round(0.60 * stretchRise * 1000) / 1000
                    });

                    if (shadow) {
                        api.keyframe(shadow, f2, {
                            "scale.x": Math.round(0.66 * shadowScaleRise * 1000) / 1000,
                            "scale.y": Math.round(0.10 * shadowScaleRise * 1000) / 1000,
                            "opacity": Math.round(shadowOpacityRise)
                        });
                    }
                }
            }
        }

        // Rewind and play
        api.setFrame(0);
        api.play();

        console.log("[MCP] ✓ 12-Principles Colored Bouncing Ball created and playing!");
        return "Bouncing Ball created successfully!";
    } catch (err) {
        console.error("[MCP] Error creating bouncing ball:", err);
    }
})();
