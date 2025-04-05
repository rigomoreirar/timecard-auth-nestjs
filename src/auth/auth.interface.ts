export interface User {
    id: string;
    role: string;
    clientId: string;
}

export interface JwtPayload {
    sub: string;
    role: string;
    clientId: string;
}
