# Cavalry Motion App MCP Bridge

A Model Context Protocol (MCP) server that connects AI assistants (like Claude Desktop, Antigravity, Cursor, and ChatGPT) directly to **Cavalry**, the procedural 2D motion graphics and animation application by Scene Group.

---

## Features

- **Procedural Layer Creation**: Create shapes, text, duplicators, grids, noise generators, color palettes, math nodes, deformers, and particle emitters via natural language.
- **Dynamic Node Graph Connections**: Connect outputs and inputs between nodes (e.g. wire a noise generator to a shape's scale or rotation).
- **Attribute Control & Keyframing**: Inspect and update any property, scrub the timeline, and add animated keyframes.
- **Scene Introspection**: Query active composition metadata, layer hierarchies, and selected nodes.
- **Render Pipeline**: Add compositions to the Render Queue and trigger batch renders.
- **Raw Script Execution**: Execute arbitrary JavaScript against Cavalry’s native `api.*` module.

---

## Architecture

```
┌─────────────────────────┐          stdio (MCP)         ┌─────────────────────────────────┐
│ AI Assistant / LLM      │ ◄──────────────────────────► │ Cavalry MCP Server              │
│ (Claude, Antigravity)   │                              │ (TypeScript / Node.js)          │
└─────────────────────────┘                              └────────────────┬────────────────┘
                                                                          │
                                                             HTTP POST    │ (http://127.0.0.1:8080)
                                                                          ▼
                                                         ┌─────────────────────────────────┐
                                                         │ In-Cavalry Script Bridge        │
                                                         │ (MCPBridge.js in Scripts menu)  │
                                                         │ ───► api.create(...)            │
                                                         │ ───► api.set(...)               │
                                                         │ ───► api.connect(...)           │
                                                         └─────────────────────────────────┘
```

---

## Quick Start

### 1. Install Dependencies & Build
From this project directory:

```bash
npm install
npm run build
```

### 2. Install Bridge Script into Cavalry
Run the installer to copy `MCPBridge.js` to your Cavalry scripts folder:

```bash
npm run install-bridge
```

*On Windows, this copies `MCPBridge.js` to `%APPDATA%\Cavalry\Scripts\`.*

### 3. Start the Bridge in Cavalry
1. Launch **Cavalry**.
2. Go to the top menu: **Scripts → MCPBridge**.
3. A small panel will open showing `Status: Online (Port 8080)`. Keep this open while using the MCP server.

*(Alternatively, if you already have the Stallion extension active, it also listens on port 8080 and works seamlessly with this MCP server).*

### 4. Test the Connection
Verify that the MCP server can communicate with Cavalry:

```bash
npm run test-connection
```

---

## MCP Client Configuration

### Claude Desktop
Add the following to your `claude_desktop_config.json` (located at `%APPDATA%\Claude\claude_desktop_config.json` on Windows or `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "cavalry": {
      "command": "node",
      "args": [
        "C:/Users/david/Documents/ANTIGRAVITY APP/CALVARY MCP/dist/index.js"
      ],
      "env": {
        "CAVALRY_BRIDGE_PORT": "8080"
      }
    }
  }
}
```

### Antigravity / Cursor / Custom Client
Add to your settings or `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "cavalry": {
      "command": "node",
      "args": ["C:/Users/david/Documents/ANTIGRAVITY APP/CALVARY MCP/dist/index.js"]
    }
  }
}
```

---

## Available MCP Tools

| Tool | Description |
| :--- | :--- |
| `cavalry_run_script` | Run arbitrary JavaScript code in Cavalry using `api.*`. |
| `cavalry_eval_expression` | Evaluate a single expression and return its value. |
| `cavalry_get_scene_info` | Query active composition name, frame count, FPS, and layer count. |
| `cavalry_get_comp_layers` | List all layer IDs in the current composition. |
| `cavalry_get_selected_layers` | Get the IDs of currently selected layers. |
| `cavalry_create_layer` | Create a new layer/node (`basicShape`, `textShape`, `duplicator`, etc.). |
| `cavalry_set_attributes` | Set one or more attribute values on a layer. |
| `cavalry_get_attributes` | Query an attribute value on a layer. |
| `cavalry_delete_layer` | Delete a layer/node from the scene. |
| `cavalry_connect_attributes` | Connect source attribute to target attribute in dependency graph. |
| `cavalry_disconnect_attributes` | Disconnect an attribute connection. |
| `cavalry_set_frame` | Scrub the playhead to a specific frame. |
| `cavalry_get_frame` | Get the current frame number. |
| `cavalry_set_keyframe` | Add a keyframe with value at a specified frame. |
| `cavalry_playback_control` | Play, stop, or rewind the timeline. |
| `cavalry_add_to_render_queue` | Add the composition to the Render Manager. |
| `cavalry_render_queue` | Start rendering items in the queue. |

---

## Example Prompts for AI Assistants

### 1. Animated Noise Grid
> *"Create a 12x12 grid of rounded squares in Cavalry, attach a noise modifier to their rotation and scale, and set the fill color to electric blue."*

### 2. Kinetic Typography
> *"Create kinetic text with the headline 'ANTIGRAVITY' in Cavalry. Set the font size to 120, center it, and add a bouncy spring oscillation to the Y position."*

### 3. Radial Burst Animation
> *"Build a radial burst animation with 24 lines radiating outwards from the center, driven by a step duplicator and keyed to expand from frame 0 to frame 45."*

---

## License

MIT
