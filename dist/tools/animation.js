export const animationTools = [
    {
        name: "cavalry_set_frame",
        description: "Moves the timeline playhead to a specific frame number in the active composition.",
        inputSchema: {
            type: "object",
            properties: {
                frame: {
                    type: "number",
                    description: "Target frame number (0-indexed integer).",
                },
            },
            required: ["frame"],
        },
    },
    {
        name: "cavalry_get_frame",
        description: "Returns the current playhead frame number in the active composition.",
        inputSchema: {
            type: "object",
            properties: {},
        },
    },
    {
        name: "cavalry_set_keyframe",
        description: "Sets an animation keyframe for attributes on a layer at a given frame number using Cavalry's official `api.keyframe(layerId, frame, { attr: value })` API.",
        inputSchema: {
            type: "object",
            properties: {
                layerId: {
                    type: "string",
                    description: "The layer ID.",
                },
                frame: {
                    type: "number",
                    description: "The frame number where the keyframe should be set.",
                },
                attributes: {
                    type: "object",
                    description: "Key-value dictionary of attributes and their values at this keyframe (e.g. {'position.y': 50, 'scale.x': 1.25}).",
                },
            },
            required: ["layerId", "frame", "attributes"],
        },
    },
    {
        name: "cavalry_playback_control",
        description: "Controls timeline playback (play, stop, or rewind) in the active viewport.",
        inputSchema: {
            type: "object",
            properties: {
                action: {
                    type: "string",
                    enum: ["play", "stop", "rewind"],
                    description: "Playback action to perform.",
                },
            },
            required: ["action"],
        },
    },
];
export async function handleAnimationTools(name, args, client) {
    if (name === "cavalry_set_frame") {
        const frame = Number(args.frame);
        const script = `api.setFrame(${frame}); api.getFrame();`;
        const curr = await client.executeScript(script);
        return {
            message: `Playhead moved to frame ${frame}.`,
            currentFrame: curr,
        };
    }
    if (name === "cavalry_get_frame") {
        const script = `api.getFrame();`;
        const curr = await client.executeScript(script);
        return {
            currentFrame: curr,
        };
    }
    if (name === "cavalry_set_keyframe") {
        const { layerId, frame, attributes } = args;
        const script = `api.keyframe("${layerId}", ${frame}, ${JSON.stringify(attributes)});`;
        await client.executeScript(script);
        return {
            message: `Keyframe set for ${layerId} at frame ${frame}.`,
            keyframe: { layerId, frame, attributes },
        };
    }
    if (name === "cavalry_playback_control") {
        const action = args.action;
        let script = "";
        if (action === "play")
            script = "api.play();";
        else if (action === "stop")
            script = "if (typeof api.stop === 'function') api.stop();";
        else if (action === "rewind")
            script = "api.setFrame(0);";
        await client.executeScript(script);
        return {
            actionExecuted: action,
        };
    }
    throw new Error(`Unhandled animation tool: ${name}`);
}
//# sourceMappingURL=animation.js.map