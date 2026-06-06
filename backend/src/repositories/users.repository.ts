import { CreateUserDto, UserResponseDto, UpdateUserDto } from "../dtos/user.dto";

let users: UserResponseDto[] = [
    { id: 1, name: "Слава" }
];

let nextId = 2;

export class UsersRepository {
    findAll(): UserResponseDto[] {
        return users;
    }

    findById(id: number): UserResponseDto | undefined {
        return users.find((user) => user.id === id);
    }

    create(data: CreateUserDto): UserResponseDto {
        const user: UserResponseDto = {
            id: nextId++,
            name: data.name
        };

        users.push(user);
        return user;
    }

    update(id: number, data: UpdateUserDto): UserResponseDto | null {
        const user = this.findById(id);
        if (!user) return null;

        if (data.name !== undefined) {
            user.name = data.name;
        }

        return user;
    }

    delete(id: number): boolean {
        const before = users.length;
        users = users.filter((user) => user.id !== id);
        return users.length < before;
    }
}
