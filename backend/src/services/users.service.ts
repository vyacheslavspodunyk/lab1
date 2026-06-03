import { UsersRepository } from "../repositories/users.repository";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";

const repo = new UsersRepository();

export class UsersService {
    getAll() {
        return repo.findAll();
    }

    getById(id: number) {
        const user = repo.findById(id);
        if (!user) throw { status: 404, message: "User not found" };
        return user;
    }

    create(dto: CreateUserDto) {
        return repo.create(dto);
    }

    update(id: number, dto: UpdateUserDto) {
        const updated = repo.update(id, dto);
        if (!updated) throw { status: 404, message: "User not found" };
        return updated;
    }

    delete(id: number) {
        repo.delete(id);
    }
}