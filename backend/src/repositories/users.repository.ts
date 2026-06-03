import { CreateUserDto, UserResponseDto } from "../dtos/user.dto";

let users: UserResponseDto[] = [];
let id = 1;

export class UsersRepository {
    findAll() {
        return users;
    }

    findById(id: number) {
        return users.find(u => u.id === id);
    }

    create(data: CreateUserDto) {
        const user = { id: id++, ...data };
        users.push(user);
        return user;
    }

    update(id: number, data: Partial<CreateUserDto>) {
        const user = users.find(u => u.id === id);
        if (!user) return null;

        Object.assign(user, data);
        return user;
    }

    delete(id: number) {
        users = users.filter(u => u.id !== id);
    }
}