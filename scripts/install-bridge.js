import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceScript = path.join(__dirname, "..", "cavalry-scripts", "MCPBridge.js");

function getCavalryScriptsDirs() {
  const home = os.homedir();
  const dirs = [];

  if (process.platform === "win32") {
    // Windows AppData
    const appData = process.env.APPDATA || path.join(home, "AppData", "Roaming");
    dirs.push(path.join(appData, "Cavalry", "Scripts"));
    // Windows Documents
    dirs.push(path.join(home, "Documents", "Cavalry", "Scripts"));
  } else if (process.platform === "darwin") {
    // macOS Application Support & Documents
    dirs.push(path.join(home, "Library", "Application Support", "Cavalry", "Scripts"));
    dirs.push(path.join(home, "Documents", "Cavalry", "Scripts"));
  } else {
    // Linux
    dirs.push(path.join(home, ".config", "Cavalry", "Scripts"));
  }

  return dirs;
}

function install() {
  console.log("==========================================");
  console.log("  Cavalry MCP Bridge - Script Installer   ");
  console.log("==========================================\n");

  if (!fs.existsSync(sourceScript)) {
    console.error(`Source script not found at: ${sourceScript}`);
    process.exit(1);
  }

  const targetDirs = getCavalryScriptsDirs();
  let installedCount = 0;

  for (const dir of targetDirs) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const destPath = path.join(dir, "MCPBridge.js");
      fs.copyFileSync(sourceScript, destPath);
      console.log(`[✓] Installed bridge script to:\n    ${destPath}\n`);
      installedCount++;
    } catch (err) {
      console.warn(`[!] Could not copy to ${dir}: ${err.message}`);
    }
  }

  if (installedCount > 0) {
    console.log("Installation Complete!");
    console.log("Next steps:");
    console.log("1. Open Cavalry.");
    console.log("2. Open menu: Scripts -> MCPBridge");
    console.log("3. The bridge server will start automatically on port 8080.");
  } else {
    console.error("Failed to install bridge script automatically. Please copy `cavalry-scripts/MCPBridge.js` manually to your Cavalry Scripts folder.");
  }
}

install();
