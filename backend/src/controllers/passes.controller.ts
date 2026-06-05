import { Request, Response, NextFunction } from "express";
import { PassesService } from "../services/passes.service";

const service = new PassesService();

function requireDemoUser(req: Request, res: Response): string | null {
    const userId = req.header("X-Demo-UserId");

    if (!userId) {
        res.status(401).json({
            error: {
                code: "UNAUTHORIZED",
                message: "X-Demo-UserId header required"
            }
        });

        return null;
    }

    return userId;
}

export const PassesController = {
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!requireDemoUser(req, res)) return;
            res.json(await service.getAll(req.query));
        } catch (err) {
            next(err);
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!requireDemoUser(req, res)) return;
            res.json(await service.getById(Number(req.params.id)));
        } catch (err) {
            next(err);
        }
    },

    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!requireDemoUser(req, res)) return;
            res.status(201).json(await service.create(req.body));
        } catch (err) {
            next(err);
        }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!requireDemoUser(req, res)) return;
            res.json(await service.update(Number(req.params.id), req.body));
        } catch (err) {
            next(err);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!requireDemoUser(req, res)) return;
            await service.delete(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },

    getLogs: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!requireDemoUser(req, res)) return;
            res.json(await service.getLogs(Number(req.params.id)));
        } catch (err) {
            next(err);
        }
    }
};