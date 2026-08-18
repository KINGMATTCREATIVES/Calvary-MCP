import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { CavalryBridgeClient } from "../bridge/client.js";
import { executionTools, handleExecutionTools } from "./execution.js";
import { sceneTools, handleSceneTools } from "./scene.js";
import { nodeTools, handleNodeTools } from "./nodes.js";
import { connectionTools, handleConnectionTools } from "./connections.js";
import { animationTools, handleAnimationTools } from "./animation.js";
import { renderingTools, handleRenderingTools } from "./rendering.js";

export const allTools: Tool[] = [
  ...executionTools,
  ...sceneTools,
  ...nodeTools,
  ...connectionTools,
  ...animationTools,
  ...renderingTools,
];

export async function dispatchToolCall(
  name: string,
  args: any,
  client: CavalryBridgeClient
): Promise<any> {
  if (name.startsWith("cavalry_run_") || name.startsWith("cavalry_eval_")) {
    return handleExecutionTools(name, args, client);
  }
  if (name === "cavalry_get_scene_info" || name === "cavalry_get_comp_layers" || name === "cavalry_get_selected_layers") {
    return handleSceneTools(name, args, client);
  }
  if (name === "cavalry_create_layer" || name === "cavalry_create_primitive" || name === "cavalry_set_attributes" || name === "cavalry_get_attributes" || name === "cavalry_delete_layer") {
    return handleNodeTools(name, args, client);
  }
  if (name === "cavalry_connect_attributes" || name === "cavalry_disconnect_attributes") {
    return handleConnectionTools(name, args, client);
  }
  if (name === "cavalry_set_frame" || name === "cavalry_get_frame" || name === "cavalry_set_keyframe" || name === "cavalry_playback_control") {
    return handleAnimationTools(name, args, client);
  }
  if (name === "cavalry_add_to_render_queue" || name === "cavalry_render_queue") {
    return handleRenderingTools(name, args, client);
  }

  throw new Error(`Unrecognized MCP tool: ${name}`);
}
