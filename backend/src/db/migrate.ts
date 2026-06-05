import fs from "fs";
import path from "path";
import { all, run, escapeSqlString } from "./dbClient";

type MigrationRow = {
    filename: string;
};

function splitSql(sql: string): string[] {
    return sql
        .split(";")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
}

export async function migrate(): Promise<void> {
    await run("PRAGMA foreign_keys = ON");

    await run(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id INTEGER PRIMARY KEY,
            filename TEXT NOT NULL UNIQUE,
            appliedAt TEXT NOT NULL
        )
    `);

    const migrationsDir = path.join(__dirname, "..", "migrations");

    const files = fs
        .readdirSync(migrationsDir)
        .filter((file) => file.endsWith(".sql"))
        .sort();

    const applied = await all<MigrationRow>(
        "SELECT filename FROM schema_migrations"
    );

    const appliedFiles = new Set(applied.map((item) => item.filename));

    for (const file of files) {
        if (appliedFiles.has(file)) continue;

        const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
        const statements = splitSql(sql);

        for (const statement of statements) {
            await run(statement);
        }

        await run(`
            INSERT INTO schema_migrations (filename, appliedAt)
            VALUES ('${escapeSqlString(file)}', '${new Date().toISOString()}')
        `);

        console.log("Migration applied:", file);
    }

    console.log("DB migrations completed");
}