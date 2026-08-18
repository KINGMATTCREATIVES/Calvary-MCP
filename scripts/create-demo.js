import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const demoArg = process.argv[2] || "1";
let demoFile = "01_procedural_grid_pulse.js";

if (demoArg === "2") {
  demoFile = "02_kinetic_typography.js";
} else if (demoArg === "3") {
  demoFile = "03_geometric_mandala.js";
}

const scriptPath = path.resolve(__dirname, "../examples", demoFile);

if (!fs.existsSync(scriptPath)) {
  console.error(`[-] Demo script not found: ${scriptPath}`);
  process.exit(1);
}

const code = fs.readFileSync(scriptPath, "utf-8");

async function main() {
  console.log(`Preparing to send demo [${demoFile}] to Cavalry...`);
  try {
    const res = await axios.post("http://localhost:8080/post", {
      type: "script",
      code: code
    }, {
      timeout: 10000,
      headers: { "Content-Type": "application/json" }
    });

    console.log(`[✓] Success! Cavalry executed [${demoFile}] via localhost:8080.`);
    console.log("Result:", res.data);
  } catch (err) {
    console.error(`[-] Failed to dispatch demo to Cavalry:`, err.message);
  }
}

main();
