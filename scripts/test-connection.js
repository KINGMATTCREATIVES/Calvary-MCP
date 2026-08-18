import axios from "axios";

const hostsToTry = [
  process.env.CAVALRY_BRIDGE_HOST,
  "localhost",
  "127.0.0.1",
  "[::1]"
].filter(Boolean);

const port = process.env.CAVALRY_BRIDGE_PORT || "8080";

async function testConnection() {
  let connected = false;

  for (const host of hostsToTry) {
    const url = `http://${host}:${port}/post`;
    console.log(`Pinging Cavalry Bridge at ${url}...`);

    try {
      const testPayload = {
        type: "script",
        code: "({ app: 'Cavalry', status: 'connected', frame: (typeof api !== 'undefined' && api.getFrame ? api.getFrame() : 0) });"
      };

      const response = await axios.post(url, testPayload, {
        timeout: 4000,
        headers: { "Content-Type": "application/json" }
      });

      console.log(`[✓] Connection successful on ${host}:${port}!`);
      console.log("Response from Cavalry:", response.data);
      connected = true;
      break;
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        console.log(`[-] Could not connect on ${host}:${port} (ECONNREFUSED).`);
      } else {
        console.error(`[-] Error on ${host}:${port}:`, error.message);
      }
    }
  }

  if (!connected) {
    console.error("\n[✗] Connection failed on all attempted addresses.");
    console.error("Please open Cavalry and run: Scripts -> MCPBridge.");
    process.exit(1);
  }
}

testConnection();
