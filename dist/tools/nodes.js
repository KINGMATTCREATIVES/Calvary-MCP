export const nodeTools = [
    {
        name: "cavalry_create_layer",
        description: "Creates a new layer or procedural node in the active Cavalry scene (e.g. 'basicShape', 'textShape', 'duplicator', 'gridDistribution', 'noise', 'colorArray', 'nullLayer', 'particleEmitter', 'deformer').",
        inputSchema: {
            type: "object",
            properties: {
                type: {
                    type: "string",
                    description: "The Cavalry layer or node type name (e.g., 'basicShape', 'textShape', 'duplicator', 'gridDistribution', 'noise', 'nullLayer', 'colorArray', 'oscillator', 'mathNode').",
                },
                name: {
                    type: "string",
                    description: "Display name for the layer in the scene hierarchy.",
                },
                attributes: {
                    type: "object",
                    description: "Optional initial attributes to set immediately after creation (e.g., {'position.x': 200, 'scale.x': 1.5, 'material.materialColor': '#FF3366'}).",
                },
            },
            required: ["type", "name"],
        },
    },
    {
        name: "cavalry_create_primitive",
        description: "Creates a geometric primitive shape in Cavalry (e.g. 'ellipse', 'rectangle', 'star', 'superEllipse', 'polygon', 'ring', 'arrow', 'line') with optional initial attributes like 'material.materialColor', 'scale.x', 'scale.y', 'position.x', 'position.y'.",
        inputSchema: {
            type: "object",
            properties: {
                generator: {
                    type: "string",
                    enum: ["ellipse", "rectangle", "star", "superEllipse", "polygon", "ring", "arrow", "line"],
                    description: "The primitive generator type.",
                },
                name: {
                    type: "string",
                    description: "Display name for the primitive layer.",
                },
                attributes: {
                    type: "object",
                    description: "Optional initial attributes (e.g., {'material.materialColor': '#FF3366', 'scale.x': 0.5, 'scale.y': 0.5, 'position.y': 100}).",
                },
            },
            required: ["generator", "name"],
        },
    },
    {
        name: "cavalry_set_attributes",
        description: "Sets one or more attribute values on an existing layer in Cavalry (e.g. 'material.materialColor', 'position.x', 'scale.x', 'rotation.z', 'opacity').",
        inputSchema: {
            type: "object",
            properties: {
                layerId: {
                    type: "string",
                    description: "The unique layer ID (e.g., 'basicShape#1' or returned layer ID).",
                },
                attributes: {
                    type: "object",
                    description: "Key-value map of attribute paths and their target values (e.g., {'position.x': 100, 'position.y': 200, 'material.materialColor': '#FF3366', 'rotation.z': 45}).",
                },
            },
            required: ["layerId", "attributes"],
        },
    },
    {
        name: "cavalry_get_attributes",
        description: "Retrieves the value of a specific attribute or array of attributes from a layer.",
        inputSchema: {
            type: "object",
            properties: {
                layerId: {
                    type: "string",
                    description: "The unique layer ID.",
                },
                attributePath: {
                    type: "string",
                    description: "The attribute path to query (e.g., 'position', 'position.x', 'radius', 'textString').",
                },
            },
            required: ["layerId", "attributePath"],
        },
    },
    {
        name: "cavalry_delete_layer",
        description: "Deletes a layer or node from the scene.",
        inputSchema: {
            type: "object",
            properties: {
                layerId: {
                    type: "string",
                    description: "The ID of the layer to remove.",
                },
            },
            required: ["layerId"],
        },
    },
];
export async function handleNodeTools(name, args, client) {
    if (name === "cavalry_create_layer") {
        const { type, name: layerName, attributes } = args;
        const script = `
      (function() {
        var id = api.create("${type}", "${layerName}");
        ${attributes ? `api.set(id, ${JSON.stringify(attributes)});` : ""}
        return {
          id: id,
          type: "${type}",
          name: "${layerName}"
        };
      })();
    `;
        const result = await client.executeScript(script);
        return {
            message: `Layer created successfully.`,
            layer: result,
        };
    }
    if (name === "cavalry_create_primitive") {
        const { generator, name: primitiveName, attributes } = args;
        const script = `
      (function() {
        var id = api.primitive("${generator}", "${primitiveName}");
        ${attributes ? `api.set(id, ${JSON.stringify(attributes)});` : ""}
        return {
          id: id,
          generator: "${generator}",
          name: "${primitiveName}"
        };
      })();
    `;
        const result = await client.executeScript(script);
        return {
            message: `Primitive '${generator}' created successfully.`,
            layer: result,
        };
    }
    if (name === "cavalry_set_attributes") {
        const { layerId, attributes } = args;
        const script = `
      (function() {
        api.set("${layerId}", ${JSON.stringify(attributes)});
        return true;
      })();
    `;
        await client.executeScript(script);
        return {
            message: `Attributes updated for layer ${layerId}.`,
            layerId: layerId,
            attributes: attributes,
        };
    }
    if (name === "cavalry_get_attributes") {
        const { layerId, attributePath } = args;
        const script = `
      (function() {
        if (typeof api.get === 'function') {
          return api.get("${layerId}", "${attributePath}");
        }
        return null;
      })();
    `;
        const val = await client.executeScript(script);
        return {
            layerId: layerId,
            attributePath: attributePath,
            value: val,
        };
    }
    if (name === "cavalry_delete_layer") {
        const { layerId } = args;
        const script = `
      (function() {
        if (typeof api.deleteLayer === 'function') {
          return api.deleteLayer("${layerId}");
        } else if (typeof api.deleteObject === 'function') {
          return api.deleteObject("${layerId}");
        } else {
          // Fallback: evaluate layer deletion
          return api.exec ? api.exec("delete", "${layerId}") : false;
        }
      })();
    `;
        const res = await client.executeScript(script);
        return {
            message: `Layer ${layerId} deletion requested.`,
            result: res,
        };
    }
    throw new Error(`Unhandled node tool: ${name}`);
}
//# sourceMappingURL=nodes.js.map