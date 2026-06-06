import { Request, Response, NextFunction } from "express";
import { UsersService } from "../services/users.service";

const service = new UsersService();

export const UsersController = {
    getAll: (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(service.getAll());
        } catch (err) {
            next(err);
        }
    },

    getById: (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(service.getById(Number(req.params.id)));
        } catch (err) {
            next(err);
        }
    },

    create: (req: Request, res: Response, next: NextFunction) => {
        try {
            res.status(201).json(service.create(req.body));
        } catch (err) {
            next(err);
        }
    },

    update: (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(service.update(Number(req.params.id), req.body));
        } catch (err) {
            next(err);
        }
    },

    delete: (req: Request, res: Response, next: NextFunction) => {
        try {
            service.delete(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
};
