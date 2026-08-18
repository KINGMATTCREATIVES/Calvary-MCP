export interface CavalryBridgeResponse<T = any> {
    success: boolean;
    result?: T;
    error?: string;
    data?: T;
}
export interface CavalryHealthResponse {
    status: string;
    version?: string;
    requestsHandled?: number;
    scene?: {
        currentFrame?: number;
        layerCount?: number;
    };
}
export interface LayerAttributes {
    [key: string]: string | number | boolean | LayerAttributes | Array<string | number | boolean>;
}
export interface CreateLayerOptions {
    type: string;
    name: string;
    attributes?: LayerAttributes;
}
export interface KeyframeOptions {
    layerId: string;
    attributePath: string;
    frame: number;
    value: number | string | boolean | number[];
}
