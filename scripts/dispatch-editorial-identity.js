import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function dispatchEditorialIdentity() {
  const scriptPath = path.resolve(__dirname, '../cavalry-scripts/createEditorialMotionIdentity.js');
  if (!fs.existsSync(scriptPath)) {
    console.error(`Script not found at: ${scriptPath}`);
    process.exit(1);
  }

  const code = fs.readFileSync(scriptPath, 'utf8');
  const port = process.env.CAVALRY_BRIDGE_PORT || 8080;
  const bridgeUrl = `http://localhost:${port}/post`;

  console.log(`Dispatching Editorial Motion Identity script to Cavalry at ${bridgeUrl}...`);

  try {
    const response = await axios.post(bridgeUrl, {
      type: 'script',
      code: code
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 20000,
    });

    console.log('[✓] Response from Cavalry:', response.data);
    console.log('[✓] Editorial Procedural Motion Identity successfully built in Cavalry!');
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error(`[!] Could not connect to Cavalry on port ${port}. Ensure Cavalry is running with MCPBridge active.`);
    } else {
      console.error('[!] Error executing script in Cavalry:', error.message);
    }
    process.exit(1);
  }
}

dispatchEditorialIdentity();
