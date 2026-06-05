import { Request, Response, NextFunction } from "express";
import { PassesService } from "../services/passes.service";

const service = new PassesService();

export const PassesController = {
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(await service.getAll(req.query));
        } catch (err) {
            next(err);
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(await service.getById(Number(req.params.id)));
        } catch (err) {
            next(err);
        }
    },

    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.status(201).json(await service.create(req.body));
        } catch (err) {
            next(err);
        }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(await service.update(Number(req.params.id), req.body));
        } catch (err) {
            next(err);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await service.delete(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },

    getLogs: async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(await service.getLogs(Number(req.params.id)));
        } catch (err) {
            next(err);
        }
    }
};