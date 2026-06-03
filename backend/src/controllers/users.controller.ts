import { UsersService } from "../services/users.service";

const service = new UsersService();

export const UsersController = {
    getAll: (req: any, res: any) => {
        res.json(service.getAll());
    },

    getById: (req: any, res: any) => {
        res.json(service.getById(Number(req.params.id)));
    },

    create: (req: any, res: any) => {
        res.status(201).json(service.create(req.body));
    },

    update: (req: any, res: any) => {
        res.json(service.update(Number(req.params.id), req.body));
    },

    delete: (req: any, res: any) => {
        service.delete(Number(req.params.id));
        res.status(204).send();
    }
};