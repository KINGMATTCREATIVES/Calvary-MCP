import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const demoArg = process.argv[2] || "1";
let demoFile = "01_procedural_grid_pulse.js";

if (demoArg === "2" || demoArg.toLowerCase().includes("text")) {
  demoFile = "02_kinetic_typography.js";
} else if (demoArg === "3" || demoArg.toLowerCase().includes("mandala")) {
  demoFile = "03_geometric_mandala.js";
}

const filePath = path.join(__dirname, "..", "examples", demoFile);
const code = fs.readFileSync(filePath, "utf8");

const hostsToTry = [
  process.env.CAVALRY_BRIDGE_HOST,
  "localhost",
  "127.0.0.1",
  "[::1]"
].filter(Boolean);

const port = process.env.CAVALRY_BRIDGE_PORT || "8080";

async function runDemo() {
  console.log(`Preparing to send demo [${demoFile}] to Cavalry...`);
  let success = false;

  for (const host of hostsToTry) {
    const url = `http://${host}:${port}/post`;
    try {
      const response = await axios.post(url, {
        type: "script",
        code: code,
      }, {
        timeout: 10000,
        headers: { "Content-Type": "application/json" }
      });

      console.log(`[✓] Success! Cavalry executed [${demoFile}] via ${host}:${port}.`);
      console.log("Result:", response.data);
      success = true;
      break;
    } catch (error) {
      if (error.code !== "ECONNREFUSED") {
        console.warn(`[!] Attempt on ${host}:${port} responded with error:`, error.message);
      }
    }
  }

  if (!success) {
    console.error("[✗] Could not connect to Cavalry on any host.");
    console.error("Make sure Cavalry is open, then click: Scripts -> MCPBridge (or Scripts -> Stallion).");
  }
}

runDemo();
