import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceBridge = path.resolve(__dirname, "../cavalry-scripts/MCPBridge.js");
const targetDirs = [
  path.join(os.homedir(), "Documents", "Cavalry", "Scripts"),
  path.join(os.homedir(), "AppData", "Roaming", "Cavalry", "Scripts")
];

console.log("Installing MCPBridge to Cavalry scripts folders...");

targetDirs.forEach((dir) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const dest = path.join(dir, "MCPBridge.js");
    fs.copyFileSync(sourceBridge, dest);
    console.log(`[✓] Installed MCPBridge to: ${dest}`);
  } catch (err) {
    console.warn(`[-] Could not write to ${dir}: ${err.message}`);
  }
});

console.log("\nSetup Complete!");
console.log("In Cavalry, open menu: Scripts -> MCPBridge to start listening on port 8080.");
