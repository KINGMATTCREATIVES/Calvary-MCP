import axios, { AxiosError } from "axios";
import { CavalryBridgeResponse, CavalryHealthResponse } from "./types.js";

export class CavalryBridgeClient {
  private baseUrl: string;
  private timeoutMs: number;

  constructor(
    host: string = process.env.CAVALRY_BRIDGE_HOST || "localhost",
    port: number = parseInt(process.env.CAVALRY_BRIDGE_PORT || "8080", 10),
    timeoutMs: number = 15000
  ) {
    this.baseUrl = `http://${host}:${port}`;
    this.timeoutMs = timeoutMs;
  }

  /**
   * Check connection health with the in-Cavalry bridge
   */
  async checkHealth(): Promise<CavalryHealthResponse> {
    try {
      const response = await axios.get<CavalryHealthResponse>(`${this.baseUrl}/health`, {
        timeout: 3000,
      });
      return response.data;
    } catch (error) {
      // Fallback: ping via eval test
      try {
        const testRes = await this.executeScript("api.getFrame ? api.getFrame() : 0;");
        return {
          status: "online",
          scene: { currentFrame: typeof testRes === "number" ? testRes : undefined },
        };
      } catch (innerError) {
        throw this.formatError(error);
      }
    }
  }

  /**
   * Execute arbitrary JavaScript code inside the Cavalry scene context
   */
  async executeScript<T = any>(code: string): Promise<T> {
    try {
      // Send code in standard bridge format compatible with both Stallion and MCPBridge.js
      const payload = {
        type: "script",
        code: code,
      };

      const response = await axios.post<CavalryBridgeResponse<T> | string>(
        `${this.baseUrl}/post`,
        payload,
        {
          timeout: this.timeoutMs,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      // Handle raw string or JSON response
      if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data);
          if (parsed.success === false) {
            throw new Error(parsed.error || "Unknown error from Cavalry script execution.");
          }
          return (parsed.result !== undefined ? parsed.result : parsed) as T;
        } catch (jsonErr) {
          return data as unknown as T;
        }
      }

      if (typeof data === "object" && data !== null) {
        if ("success" in data && data.success === false) {
          throw new Error(data.error || "Execution failed in Cavalry.");
        }
        return (data.result !== undefined ? data.result : ("data" in data ? data.data : data)) as T;
      }

      return data as T;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  private formatError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosErr = error as AxiosError;
      if (axiosErr.code === "ECONNREFUSED") {
        return new Error(
          `Cannot connect to Cavalry at ${this.baseUrl}.\n` +
          `Troubleshooting:\n` +
          `1. Ensure Cavalry Motion App is open.\n` +
          `2. Open the menu in Cavalry: Scripts -> MCPBridge (or Scripts -> Stallion).\n` +
          `3. Verify that port ${this.baseUrl.split(":").pop()} is open and listening.`
        );
      }
      if (axiosErr.code === "ETIMEDOUT" || axiosErr.message.includes("timeout")) {
        return new Error(`Cavalry request timed out after ${this.timeoutMs}ms.`);
      }
      return new Error(`Cavalry Bridge Network Error: ${axiosErr.message}`);
    }
    return error instanceof Error ? error : new Error(String(error));
  }
}
