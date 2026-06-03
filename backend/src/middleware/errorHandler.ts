export function errorHandler(err: any, req: any, res: any, next: any) {
    console.error(err);

    res.status(err.status || 500).json({
        error: {
            code: err.code || "INTERNAL_ERROR",
            message: err.message || "Unexpected error",
            details: err.details || []
        }
    });
}