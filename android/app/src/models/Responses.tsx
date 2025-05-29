export interface ErrorResponse {
    data: {
        type: number;
        address: string;
        description: string;
    }
}

export interface SuccessResponse {
    data: {
        username: string;
    }
}
