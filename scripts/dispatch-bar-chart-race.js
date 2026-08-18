import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptPath = path.join(__dirname, "..", "cavalry-scripts", "createBarChartRace.js");
const code = fs.readFileSync(scriptPath, "utf-8");

console.log("Sending Bar Chart Race script to Cavalry on http://localhost:8080...");

async function dispatch() {
  try {
    const res = await axios.post("http://localhost:8080/post", { code: code }, { timeout: 8000 });
    console.log("Cavalry Response:", res.data);
    console.log("✓ Bar Chart Race successfully created in active Cavalry composition.");
  } catch (err) {
    try {
      const res2 = await axios.post("http://127.0.0.1:8080/post", { code: code }, { timeout: 8000 });
      console.log("Cavalry Response (127.0.0.1):", res2.data);
      console.log("✓ Bar Chart Race successfully created in active Cavalry composition.");
    } catch (err2) {
      console.error("Error communicating with Cavalry bridge:", err.message);
    }
  }
}

dispatch();
