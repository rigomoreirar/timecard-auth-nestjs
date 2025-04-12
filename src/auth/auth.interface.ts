export interface JwtPayload {
    userId: number;
    role: string;
    clientId: string;
}

export interface JwtResponse {
    userId: number;
    role: string;
    clientId: string;
    iat: string;
    exp: string;
}
