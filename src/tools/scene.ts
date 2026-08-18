import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { CavalryBridgeClient } from "../bridge/client.js";

export const sceneTools: Tool[] = [
  {
    name: "cavalry_get_scene_info",
    description: "Retrieves metadata about the active Cavalry composition, including current frame, total duration, frame rate, and layer hierarchy.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "cavalry_get_comp_layers",
    description: "Returns an array of layer and node IDs present in the active composition.",
    inputSchema: {
      type: "object",
      properties: {
        topLevelOnly: {
          type: "boolean",
          description: "If true, only returns root-level layers. Defaults to false.",
        },
      },
    },
  },
  {
    name: "cavalry_get_selected_layers",
    description: "Returns an array of IDs of the currently selected layers in the Cavalry viewport / scene tree.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

export async function handleSceneTools(
  name: string,
  args: any,
  client: CavalryBridgeClient
): Promise<any> {
  if (name === "cavalry_get_scene_info") {
    const script = `
      (function() {
        var info = {};
        if (typeof api.getFrame === 'function') info.currentFrame = api.getFrame();
        if (typeof api.getCompLayers === 'function') {
          var layers = api.getCompLayers(false);
          info.totalLayers = layers ? layers.length : 0;
          info.layers = layers || [];
        }
        if (typeof api.getSelectedLayers === 'function') {
          info.selectedLayers = api.getSelectedLayers();
        }
        return info;
      })();
    `;
    return await client.executeScript(script);
  }

  if (name === "cavalry_get_comp_layers") {
    const topLevelOnly = Boolean(args?.topLevelOnly);
    const script = `api.getCompLayers(${topLevelOnly});`;
    const layers = await client.executeScript(script);
    return {
      topLevelOnly: topLevelOnly,
      count: Array.isArray(layers) ? layers.length : 0,
      layers: layers,
    };
  }

  if (name === "cavalry_get_selected_layers") {
    const script = `typeof api.getSelectedLayers === 'function' ? api.getSelectedLayers() : [];`;
    const selected = await client.executeScript(script);
    return {
      selectedLayers: selected || [],
    };
  }

  throw new Error(`Unhandled scene tool: ${name}`);
}
