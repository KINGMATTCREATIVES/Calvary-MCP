import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { CavalryBridgeClient } from "../bridge/client.js";
export declare const executionTools: Tool[];
export declare function handleExecutionTools(name: string, args: any, client: CavalryBridgeClient): Promise<any>;
