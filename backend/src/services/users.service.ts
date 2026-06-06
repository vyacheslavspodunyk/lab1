import { UsersRepository } from "../repositories/users.repository";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";

const repo = new UsersRepository();

function validateId(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
        throw {
            status: 400,
            code: "INVALID_ID",
            message: "Invalid user id"
        };
    }
}

function validateName(name: unknown) {
    if (typeof name !== "string") {
        throw {
            status: 400,
            code: "INVALID_NAME",
            message: "User name must be a string"
        };
    }

    const trimmed = name.trim();

    if (trimmed.length < 2 || trimmed.length > 50) {
        throw {
            status: 400,
            code: "INVALID_NAME",
            message: "User name must contain from 2 to 50 characters"
        };
    }

    return trimmed;
}

export class UsersService {
    getAll() {
        const items = repo.findAll();

        return {
            items,
            total: items.length
        };
    }

    getById(id: number) {
        validateId(id);

        const user = repo.findById(id);

        if (!user) {
            throw {
                status: 404,
                code: "USER_NOT_FOUND",
                message: "User not found"
            };
        }

        return user;
    }

    create(dto: CreateUserDto) {
        const name = validateName(dto.name);
        return repo.create({ name });
    }

    update(id: number, dto: UpdateUserDto) {
        validateId(id);

        const data: UpdateUserDto = {};

        if (dto.name !== undefined) {
            data.name = validateName(dto.name);
        }

        const updated = repo.update(id, data);

        if (!updated) {
            throw {
                status: 404,
                code: "USER_NOT_FOUND",
                message: "User not found"
            };
        }

        return updated;
    }

    delete(id: number) {
        validateId(id);

        const deleted = repo.delete(id);

        if (!deleted) {
            throw {
                status: 404,
                code: "USER_NOT_FOUND",
                message: "User not found"
            };
        }
    }
}
