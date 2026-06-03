export interface CreateUserDto {
    name: string;
    email: string;
}

export interface UpdateUserDto {
    name?: string;
    email?: string;
}

export interface UserResponseDto {
    id: number;
    name: string;
    email: string;
}