import { CavalryHealthResponse } from "./types.js";
export declare class CavalryBridgeClient {
    private baseUrl;
    private timeoutMs;
    constructor(host?: string, port?: number, timeoutMs?: number);
    /**
     * Check connection health with the in-Cavalry bridge
     */
    checkHealth(): Promise<CavalryHealthResponse>;
    /**
     * Execute arbitrary JavaScript code inside the Cavalry scene context
     */
    executeScript<T = any>(code: string): Promise<T>;
    private formatError;
}
