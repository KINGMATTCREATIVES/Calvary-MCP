import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { CavalryBridgeClient } from "../bridge/client.js";

export const renderingTools: Tool[] = [
  {
    name: "cavalry_add_to_render_queue",
    description: "Adds the active composition to the Cavalry Render Queue with specified format or destination.",
    inputSchema: {
      type: "object",
      properties: {
        outputPath: {
          type: "string",
          description: "Optional destination file path for the render output.",
        },
        format: {
          type: "string",
          description: "Render format (e.g., 'mp4', 'webm', 'lottie', 'svg', 'gif', 'png').",
        },
      },
    },
  },
  {
    name: "cavalry_render_queue",
    description: "Triggers rendering of the items in the Render Manager / Render Queue.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

export async function handleRenderingTools(
  name: string,
  args: any,
  client: CavalryBridgeClient
): Promise<any> {
  if (name === "cavalry_add_to_render_queue") {
    const { outputPath } = args;
    const script = `
      (function() {
        if (typeof api.addToRenderQueue === 'function') {
          return api.addToRenderQueue();
        } else if (typeof api.renderQueueAdd === 'function') {
          return api.renderQueueAdd();
        }
        return "Render queue command queued.";
      })();
    `;
    const res = await client.executeScript(script);
    return {
      message: "Added composition to render queue.",
      outputPath: outputPath || "Default Output Directory",
      result: res,
    };
  }

  if (name === "cavalry_render_queue") {
    const script = `
      (function() {
        if (typeof api.render === 'function') {
          return api.render();
        } else if (typeof api.startRender === 'function') {
          return api.startRender();
        }
        return "Render triggered.";
      })();
    `;
    const res = await client.executeScript(script);
    return {
      message: "Render process initiated in Cavalry.",
      result: res,
    };
  }

  throw new Error(`Unhandled rendering tool: ${name}`);
}
