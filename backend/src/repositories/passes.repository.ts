import { CreatePassDto, PassResponseDto } from "../dtos/pass.dto";

let passes: PassResponseDto[] = [];
let id = 1;

export class PassesRepository {
    findAll() {
        return passes;
    }

    findById(id: number) {
        return passes.find(p => p.id === id);
    }

    create(data: CreatePassDto) {
        const pass = { id: id++, ...data };
        passes.push(pass);
        return pass;
    }

    update(id: number, data: Partial<CreatePassDto>) {
        const pass = passes.find(p => p.id === id);
        if (!pass) return null;

        Object.assign(pass, data);
        return pass;
    }

    delete(id: number) {
        passes = passes.filter(p => p.id !== id);
    }
}