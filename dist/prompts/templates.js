export const allPrompts = [
    {
        name: "cavalry_procedural_grid",
        description: "Template for creating a procedural animated grid of shapes with noise scaling in Cavalry.",
        arguments: [
            {
                name: "shapeType",
                description: "Type of shape: circle, rectangle, or star (default: circle)",
                required: false,
            },
            {
                name: "gridCount",
                description: "Number of rows and columns (e.g. 8x8)",
                required: false,
            },
        ],
    },
    {
        name: "cavalry_kinetic_typography",
        description: "Template for creating kinetic bouncy typography with staggered delays.",
        arguments: [
            {
                name: "text",
                description: "The headline text to animate",
                required: true,
            },
        ],
    },
    {
        name: "cavalry_bouncing_ball",
        description: "Template for creating a procedural bouncing ball with squash and stretch, easing curves, and dynamic shadow in Cavalry.",
        arguments: [
            {
                name: "color",
                description: "Hex color or preset name for the ball (default: #FF5252)",
                required: false,
            },
            {
                name: "squashIntensity",
                description: "Intensity of squash and stretch deformation (e.g. 1.3)",
                required: false,
            },
        ],
    },
];
export function getPromptResponse(name, args) {
    if (name === "cavalry_procedural_grid") {
        const shape = args?.shapeType || "circle";
        const count = args?.gridCount || "8";
        return {
            description: "Procedural animated grid in Cavalry",
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `Please generate a procedural motion graphic in Cavalry using a ${shape} inside a ${count}x${count} duplicator grid with a noise generator driving its scale and rotation.`,
                    },
                },
            ],
        };
    }
    if (name === "cavalry_kinetic_typography") {
        const text = args?.text || "MOTION DESIGN";
        return {
            description: "Kinetic typography template",
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `Create kinetic typography in Cavalry for the text "${text}", using staggered position offsets and spring / bouncy easing.`,
                    },
                },
            ],
        };
    }
    if (name === "cavalry_bouncing_ball") {
        const color = args?.color || "#FF5252";
        const squash = args?.squashIntensity || "1.35";
        return {
            description: "Bouncing ball animation template",
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `Create a bouncing ball animation in Cavalry with squash and stretch factor ${squash}, ball color ${color}, ground contact shadow, and parabolic easing.`,
                    },
                },
            ],
        };
    }
    throw new Error(`Unknown prompt: ${name}`);
}
//# sourceMappingURL=templates.js.map