import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { CavalryBridgeClient } from "../bridge/client.js";
export declare const nodeTools: Tool[];
export declare function handleNodeTools(name: string, args: any, client: CavalryBridgeClient): Promise<any>;
