export interface CreatePassDto {
    userName: string;
    reason: string;
    date: string;
    comment?: string;
    issuer: string;
}

export interface UpdatePassDto {
    userName?: string;
    reason?: string;
    date?: string;
    comment?: string;
    issuer?: string;
}

export interface PassResponseDto {
    id: number;
    userName: string;
    reason: string;
    date: string;
    comment?: string;
    issuer: string;
}