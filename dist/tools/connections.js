export const connectionTools = [
    {
        name: "cavalry_connect_attributes",
        description: "Connects an attribute or output of a source node to an input attribute of a target node in Cavalry's procedural dependency graph.",
        inputSchema: {
            type: "object",
            properties: {
                sourceId: {
                    type: "string",
                    description: "ID of the source node (e.g. 'noise#1', 'oscillator#1', 'circle#1').",
                },
                sourceAttr: {
                    type: "string",
                    description: "Attribute name or socket on the source node (e.g. 'id', 'value', 'outColor', 'array.0').",
                },
                targetId: {
                    type: "string",
                    description: "ID of the target node (e.g. 'duplicator#1', 'basicShape#1').",
                },
                targetAttr: {
                    type: "string",
                    description: "Attribute name or socket on the target node (e.g. 'generator', 'distribution', 'position.x', 'shapeScale').",
                },
            },
            required: ["sourceId", "sourceAttr", "targetId", "targetAttr"],
        },
    },
    {
        name: "cavalry_disconnect_attributes",
        description: "Breaks a connection to a specific attribute on a target node in Cavalry.",
        inputSchema: {
            type: "object",
            properties: {
                targetId: {
                    type: "string",
                    description: "ID of the target node.",
                },
                targetAttr: {
                    type: "string",
                    description: "Attribute name on the target node to disconnect.",
                },
                sourceId: {
                    type: "string",
                    description: "Optional source node ID if specific disconnect is needed.",
                },
                sourceAttr: {
                    type: "string",
                    description: "Optional source attribute name.",
                },
            },
            required: ["targetId", "targetAttr"],
        },
    },
];
export async function handleConnectionTools(name, args, client) {
    if (name === "cavalry_connect_attributes") {
        const { sourceId, sourceAttr, targetId, targetAttr } = args;
        const script = `
      (function() {
        api.connect("${sourceId}", "${sourceAttr}", "${targetId}", "${targetAttr}");
        return true;
      })();
    `;
        await client.executeScript(script);
        return {
            message: `Connection established: ${sourceId}.${sourceAttr} -> ${targetId}.${targetAttr}`,
            connection: {
                sourceId,
                sourceAttr,
                targetId,
                targetAttr,
            },
        };
    }
    if (name === "cavalry_disconnect_attributes") {
        const { targetId, targetAttr, sourceId, sourceAttr } = args;
        const script = `
      (function() {
        if (typeof api.disconnect === 'function') {
          ${sourceId && sourceAttr ? `api.disconnect("${sourceId}", "${sourceAttr}", "${targetId}", "${targetAttr}");` : `api.disconnect("${targetId}", "${targetAttr}");`}
          return true;
        }
        return false;
      })();
    `;
        await client.executeScript(script);
        return {
            message: `Disconnected attribute on ${targetId}.${targetAttr}`,
        };
    }
    throw new Error(`Unhandled connection tool: ${name}`);
}
//# sourceMappingURL=connections.js.map