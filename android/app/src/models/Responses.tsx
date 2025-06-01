export interface ErrorResponse {
    type: number;
    address: string;
    description: string;
}

export interface SuccessResponse {
    username: string;
}

export interface HueResponse {
    success?: SuccessResponse
    error?: ErrorResponse
}

export interface BridgeIPResponse {
    id: string;
    internalipaddress: string;
    port: number;
}

export interface Lights<L> {
    [key: string]: L;
}

export interface Light {
    state: {
        on: boolean;
        bri: number;
        hue?: number;
        sat?: number;
        effect?: string;
        ct: number;
        xy?: [number, number];
        alert?: string;
        colormode: string;
        reachable: boolean;
        mode: string;
    };
    type: string;
    name: string;
}
