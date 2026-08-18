import axios from "axios";

const bouncingBallScript = `
(function createBouncingBall12Principles() {
    if (typeof api === "undefined") {
        console.error("This script must be executed inside Cavalry.");
        return;
    }

    console.log("[MCP] Creating 12-Principles Bouncing Ball Animation in Cavalry...");

    try {
        var totalFrames = 120;
        var bounceCadence = 30;
        var apexY = -240;
        var groundY = 160;
        var dropHeight = groundY - apexY;
        var radius = 60;

        // 1. Create Floor Line Primitive
        var ground = api.primitive("rectangle", "Floor_Line");
        if (ground) {
            api.set(ground, {
                "position.x": 0,
                "position.y": groundY + radius,
                "scale.x": 5.0,
                "scale.y": 0.02,
                "material.materialColor": "#1E293B"
            });
        }

        // 2. Create Impact Shockwave Primitive
        var shockwave = api.primitive("ellipse", "Impact_Shockwave");
        if (shockwave) {
            api.set(shockwave, {
                "position.x": 0,
                "position.y": groundY + radius - 2,
                "scale.x": 0.01,
                "scale.y": 0.01,
                "opacity": 0,
                "material.materialColor": "#FF8A80"
            });
        }

        // 3. Create Ground Shadow Primitive
        var shadow = api.primitive("ellipse", "Ball_Shadow");
        if (shadow) {
            api.set(shadow, {
                "position.x": 0,
                "position.y": groundY + radius - 2,
                "scale.x": 0.66,
                "scale.y": 0.10,
                "material.materialColor": "#0F172A"
            });
        }

        // 4. Create Main Ball Primitive
        var ball = api.primitive("ellipse", "Bouncing_Ball_Core");
        if (!ball) {
            console.error("[MCP] Failed to create ball layer.");
            return;
        }

        api.set(ball, {
            "position.x": 0,
            "position.y": apexY,
            "scale.x": (radius * 2) / 200,
            "scale.y": (radius * 2) / 200,
            "material.materialColor": "#FF3366"
        });

        // 5. Generate Keyframes
        if (typeof api.keyframe === "function") {
            for (var cycle = 0; cycle < 4; cycle++) {
                var startFrame = cycle * bounceCadence;
                var fallDuration = 14;
                var impactFrame = startFrame + fallDuration;
                var maxSquashFrame = impactFrame + 2;
                var leaveGroundFrame = maxSquashFrame + 2;
                var nextApexFrame = startFrame + bounceCadence;

                // Phase 1: Falling from Apex
                for (var f = startFrame; f <= impactFrame; f++) {
                    var progress = (f - startFrame) / fallDuration;
                    var easedY = Math.pow(progress, 2.4);
                    var currentY = apexY + (dropHeight * easedY);

                    var stretchFactor = 1.0 + (0.28 * Math.pow(progress, 1.8));
                    var squashFactor = 1.0 / stretchFactor;

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

                // Phase 2: Maximum Squash
                api.keyframe(ball, maxSquashFrame, {
                    "position.x": 0,
                    "position.y": groundY + 18,
                    "scale.x": 0.88,
                    "scale.y": 0.41
                });

                if (shadow) {
                    api.keyframe(shadow, maxSquashFrame, {
                        "scale.x": 0.85,
                        "scale.y": 0.12,
                        "opacity": 90
                    });
                }

                if (shockwave) {
                    api.keyframe(shockwave, impactFrame, { "scale.x": 0.05, "scale.y": 0.02, "opacity": 90 });
                    api.keyframe(shockwave, maxSquashFrame + 4, { "scale.x": 1.20, "scale.y": 0.20, "opacity": 0 });
                }

                // Phase 3: Launch
                api.keyframe(ball, leaveGroundFrame, {
                    "position.x": 0,
                    "position.y": groundY - 20,
                    "scale.x": 0.48,
                    "scale.y": 0.75
                });

                // Phase 4: Rising to Apex
                var riseDuration = nextApexFrame - leaveGroundFrame;
                for (var f2 = leaveGroundFrame + 1; f2 <= nextApexFrame; f2++) {
                    var progressRise = (f2 - leaveGroundFrame) / riseDuration;
                    var easedRise = 1 - Math.pow(1 - progressRise, 2.2);
                    var currentRiseY = (groundY - 20) - ((groundY - 20 - apexY) * easedRise);

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
`;

async function main() {
  console.log("Dispatching 12-Principles Bouncing Ball to Cavalry at http://localhost:8080/post...");
  try {
    const res = await axios.post("http://localhost:8080/post", {
      type: "script",
      code: bouncingBallScript
    }, {
      timeout: 10000,
      headers: { "Content-Type": "application/json" }
    });

    console.log("[✓] Success! Cavalry response:", res.data);
  } catch (err) {
    console.error("[✗] Error communicating with Cavalry:", err.message);
  }
}

main();
