import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptPath = path.join(__dirname, "..", "cavalry-scripts", "createFlyingBall.js");
const code = fs.readFileSync(scriptPath, "utf-8");

console.log("Sending Flying Ball script to Cavalry on http://localhost:8080...");

try {
  const res = await axios.post("http://localhost:8080/post", { code: code }, { timeout: 5000 });
  console.log("Cavalry Response:", res.data);
  console.log("✓ Flying Ball animation successfully created in active Cavalry composition.");
} catch (err) {
  console.error("Error communicating with Cavalry:", err.message);
}
