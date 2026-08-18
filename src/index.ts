#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { CavalryBridgeClient } from "./bridge/client.js";
import { allTools, dispatchToolCall } from "./tools/index.js";
import { allPrompts, getPromptResponse } from "./prompts/templates.js";

const SERVER_NAME = "cavalry-mcp-server";
const SERVER_VERSION = "1.0.0";

async function main() {
  const bridgeHost = process.env.CAVALRY_BRIDGE_HOST || "127.0.0.1";
  const bridgePort = parseInt(process.env.CAVALRY_BRIDGE_PORT || "8080", 10);
  const client = new CavalryBridgeClient(bridgeHost, bridgePort);

  const server = new Server(
    {
      name: SERVER_NAME,
      version: SERVER_VERSION,
    },
    {
      capabilities: {
        tools: {},
        prompts: {},
      },
    }
  );

  // List all available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: allTools };
  });

  // Handle tool invocations
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
      const result = await dispatchToolCall(name, args || {}, client);
      return {
        content: [
          {
            type: "text",
            text: typeof result === "string" ? result : JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `[Cavalry MCP Error in ${name}]: ${errorMessage}`,
          },
        ],
      };
    }
  });

  // Prompts handlers
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return { prompts: allPrompts };
  });

  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    return getPromptResponse(name, args);
  });

  // Connect via stdio
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`[Cavalry MCP] Server v${SERVER_VERSION} connected via stdio (Target: http://${bridgeHost}:${bridgePort})`);
}

main().catch((err) => {
  console.error("[Cavalry MCP] Fatal startup error:", err);
  process.exit(1);
});
