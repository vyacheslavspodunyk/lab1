import { PassesRepository } from "../repositories/passes.repository";
import { CreatePassDto, UpdatePassDto } from "../dtos/pass.dto";

const repo = new PassesRepository();

function validateId(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
        throw {
            status: 400,
            code: "INVALID_ID",
            message: "Invalid id",
            details: []
        };
    }
}

export class PassesService {
    async getAll(query: any) {
        const items = await repo.findAll({
            reason: query.reason,
            search: query.search,
            sort: query.sort
        });

        return {
            items,
            total: items.length
        };
    }

    async getById(id: number) {
        validateId(id);

        const pass = await repo.findById(id);

        if (!pass) {
            throw {
                status: 404,
                code: "PASS_NOT_FOUND",
                message: "Pass not found",
                details: []
            };
        }

        return pass;
    }

    async create(dto: CreatePassDto) {
        return await repo.create(dto);
    }

    async update(id: number, dto: UpdatePassDto) {
        validateId(id);

        const updated = await repo.update(id, dto);

        if (!updated) {
            throw {
                status: 404,
                code: "PASS_NOT_FOUND",
                message: "Pass not found",
                details: []
            };
        }

        return updated;
    }

    async delete(id: number) {
        validateId(id);

        const deleted = await repo.delete(id);

        if (!deleted) {
            throw {
                status: 404,
                code: "PASS_NOT_FOUND",
                message: "Pass not found",
                details: []
            };
        }
    }

    async getLogs(id: number) {
        validateId(id);

        await this.getById(id);

        return {
            items: await repo.findLogs(id)
        };
    }
}