export function validate(schema: any) {
    return (req: any, res: any, next: any) => {
        const result = schema(req.body);

        if (!result.valid) {
            return res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Invalid request body",
                    details: result.errors
                }
            });
        }

        next();
    };
}