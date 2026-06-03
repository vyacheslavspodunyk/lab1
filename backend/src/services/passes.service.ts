import { PassesRepository } from "../repositories/passes.repository";
import { CreatePassDto, UpdatePassDto } from "../dtos/pass.dto";

const repo = new PassesRepository();

export class PassesService {

    getAll(query: any) {
        let data = repo.findAll();

        // filter
        if (query.reason) {
            data = data.filter(p => p.reason === query.reason);
        }

        // search
        if (query.search) {
            data = data.filter(p =>
                p.userName.toLowerCase().includes(query.search.toLowerCase())
            );
        }

        // sort
        if (query.sort === "dateAsc") {
            data.sort((a, b) => a.date.localeCompare(b.date));
        }

        if (query.sort === "dateDesc") {
            data.sort((a, b) => b.date.localeCompare(a.date));
        }

        return {
            items: data,
            total: data.length
        };
    }

    getById(id: number) {
        const pass = repo.findById(id);
        if (!pass) throw { status: 404, message: "Pass not found" };
        return pass;
    }

    create(dto: CreatePassDto) {
        return repo.create(dto);
    }

    update(id: number, dto: UpdatePassDto) {
        const updated = repo.update(id, dto);
        if (!updated) throw { status: 404, message: "Pass not found" };
        return updated;
    }

    delete(id: number) {
        repo.delete(id);
    }
}