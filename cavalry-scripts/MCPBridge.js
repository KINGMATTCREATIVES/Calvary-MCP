/**
 * Cavalry Motion App - Model Context Protocol (MCP) Bridge
 * Uses direct instance callback and while(server.postCount())
 */

(function() {
    var SCRIPT_ID = "com.scenegroup.mcpbridge";
    var PORT = 8080;

    var server = new api.WebServer();
    server.listen("localhost", PORT);

    var callbackObj = {
        onPost: function() {
            try {
                while (server.postCount && server.postCount() > 0) {
                    var post = server.getNextPost();
                    if (!post || !post.result) continue;

                    var data;
                    try {
                        data = JSON.parse(post.result);
                    } catch (parseErr) {
                        data = { type: "script", code: post.result };
                    }

                    var code = data.code || "";
                    var path = data.path || "";

                    if (path) {
                        if (typeof api.exec === "function") {
                            api.exec(SCRIPT_ID, path);
                        }
                    } else if (code) {
                        if (typeof api.exec === "function") {
                            api.exec(SCRIPT_ID, code);
                        } else {
                            eval(code);
                        }
                        console.log("[MCP Bridge] Executed animation command successfully.");
                    }
                }
            } catch (err) {
                console.error("[MCP Bridge] onPost error: " + err);
            }
        }
    };

    server.addCallbackObject(callbackObj);

    if (typeof server.setRealtime === "function") {
        server.setRealtime();
    } else if (typeof server.setHighFrequency === "function") {
        server.setHighFrequency();
    }

    // UI Window
    if (typeof ui !== "undefined" && typeof ui.Label === "function") {
        var label = new ui.Label("MCP Bridge: Online (Port " + PORT + ")");
        if (typeof label.setAlignment === "function") label.setAlignment(1);
        
        var sub = new ui.Label("Ready for AI generation");
        if (typeof sub.setAlignment === "function") sub.setAlignment(1);

        var layout = new ui.VLayout();
        if (typeof layout.addStretch === "function") layout.addStretch();
        layout.add(label, sub);
        if (typeof layout.addStretch === "function") layout.addStretch();

        ui.setTitle("Cavalry MCP Bridge");
        ui.add(layout);
        ui.show();
    }

    console.log("[MCP Bridge] WebServer listening on localhost:" + PORT);
})();
