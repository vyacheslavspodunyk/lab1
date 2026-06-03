import express from "express";
import { PassesController } from "../controllers/passes.controller";

const router = express.Router();

router.get("/", PassesController.getAll);
router.get("/:id", PassesController.getById);
router.post("/", PassesController.create);
router.put("/:id", PassesController.update);
router.delete("/:id", PassesController.delete);

export default router;