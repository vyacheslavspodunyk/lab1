export interface CreateUserDto {
    name: string;
}

export interface UpdateUserDto {
    name?: string;
}

export interface UserResponseDto {
    id: number;
    name: string;
}
