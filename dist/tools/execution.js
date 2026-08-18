export const executionTools = [
    {
        name: "cavalry_run_script",
        description: "Executes a multiline JavaScript automation script inside Cavalry using the `api.*` module. Use this for complex procedural generation, node network creation, and batch updates.",
        inputSchema: {
            type: "object",
            properties: {
                code: {
                    type: "string",
                    description: "JavaScript code using Cavalry API methods (e.g. `api.create()`, `api.set()`, `api.connect()`, `api.setKeyframe()`).",
                },
            },
            required: ["code"],
        },
    },
    {
        name: "cavalry_eval_expression",
        description: "Evaluates a single JavaScript expression inside Cavalry and returns its value.",
        inputSchema: {
            type: "object",
            properties: {
                expression: {
                    type: "string",
                    description: "JavaScript expression to evaluate (e.g. `api.getCompLayers(false)` or `api.get('basicShape#1', 'position.x')`).",
                },
            },
            required: ["expression"],
        },
    },
];
export async function handleExecutionTools(name, args, client) {
    if (name === "cavalry_run_script") {
        const code = args.code;
        const result = await client.executeScript(code);
        return {
            message: "Script executed successfully in Cavalry.",
            result: result,
        };
    }
    if (name === "cavalry_eval_expression") {
        const expr = args.expression;
        const result = await client.executeScript(`(${expr})`);
        return {
            expression: expr,
            result: result,
        };
    }
    throw new Error(`Unhandled execution tool: ${name}`);
}
//# sourceMappingURL=execution.js.map