import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { CavalryBridgeClient } from "../bridge/client.js";
export declare const allTools: Tool[];
export declare function dispatchToolCall(name: string, args: any, client: CavalryBridgeClient): Promise<any>;
