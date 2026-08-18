import { Prompt } from "@modelcontextprotocol/sdk/types.js";
export declare const allPrompts: Prompt[];
export declare function getPromptResponse(name: string, args?: Record<string, string>): {
    description: string;
    messages: {
        role: "user";
        content: {
            type: "text";
            text: string;
        };
    }[];
};
