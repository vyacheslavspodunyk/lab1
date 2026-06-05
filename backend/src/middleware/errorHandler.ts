export function errorHandler(err: any, req: any, res: any, next: any) {
    console.error(err);

    const message = String(err?.message || "");

    if (message.includes("UNIQUE constraint failed")) {
        return res.status(409).json({
            error: {
                code: "UNIQUE_CONSTRAINT",
                message: "Duplicate value"
            }
        });
    }

    if (
        message.includes("NOT NULL constraint failed") ||
        message.includes("CHECK constraint failed")
    ) {
        return res.status(400).json({
            error: {
                code: "INVALID_DATA",
                message: "Invalid data"
            }
        });
    }

    res.status(err.status || 500).json({
        error: {
            code: err.code || "INTERNAL_ERROR",
            message: err.message || "Unexpected error"
        }
    });
}