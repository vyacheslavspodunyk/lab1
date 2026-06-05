import express from "express";
import userRoutes from "./routes/users.routes";
import passRoutes from "./routes/passes.routes";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./middleware/logger";

const app = express();

app.use(express.json());
app.use(logger);

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/users", userRoutes);
app.use("/api/passes", passRoutes);

app.use(errorHandler);

export default app;