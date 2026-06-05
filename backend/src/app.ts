import express from "express";
import userRoutes from "./routes/users.routes";
import passRoutes from "./routes/passes.routes";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./middleware/logger";

const app = express();

const allowedOrigins = ["http://localhost:5500", "http://127.0.0.1:5500"];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (typeof origin === "string" && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});

app.use(express.json());
app.use(logger);

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/users", userRoutes);
app.use("/api/passes", passRoutes);

app.use(errorHandler);

export default app;