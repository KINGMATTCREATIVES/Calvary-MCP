// 02_kinetic_typography.js - Verified with Official Cavalry API
var textId = api.create("textShape", "CALVARY MCP");

api.set(textId, {
    "string": "CALVARY MCP",
    "fontSize": 96,
    "horizontalAlignment": 1, // Center
    "verticalAlignment": 1    // Center
});

api.keyframe(textId, 0, {
    "position.y": -450,
    "scale.x": 0.2,
    "scale.y": 0.2
});

api.keyframe(textId, 16, {
    "position.y": 50,
    "scale.x": 1.25,
    "scale.y": 1.25
});

api.keyframe(textId, 23, {
    "position.y": -20,
    "scale.x": 0.95,
    "scale.y": 0.95
});

api.keyframe(textId, 30, {
    "position.y": 0,
    "scale.x": 1.0,
    "scale.y": 1.0
});

api.setFrame(0);
api.play();
