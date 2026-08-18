import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function dispatchAgencyReel() {
  const scriptPath = path.resolve(__dirname, '../cavalry-scripts/createAgencyReel30s.js');
  if (!fs.existsSync(scriptPath)) {
    console.error(`Script not found at: ${scriptPath}`);
    process.exit(1);
  }

  const code = fs.readFileSync(scriptPath, 'utf8');
  const port = process.env.CAVALRY_BRIDGE_PORT || 8080;
  const bridgeUrl = `http://localhost:${port}/post`;

  console.log(`Dispatching 30s Commercial Agency Reel script to Cavalry at ${bridgeUrl}...`);

  try {
    const response = await axios.post(bridgeUrl, code, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
      timeout: 20000,
    });

    console.log('[✓] Response from Cavalry:', response.data);
    console.log('[✓] 30-Second Commercial Agency Reel successfully generated in Cavalry!');
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error(`[!] Could not connect to Cavalry on port ${port}. Ensure Cavalry is running with the MCPBridge script active.`);
    } else {
      console.error('[!] Error executing script in Cavalry:', error.message);
    }
    process.exit(1);
  }
}

dispatchAgencyReel();
