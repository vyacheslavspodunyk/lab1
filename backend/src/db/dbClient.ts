import { db } from "./db";

export function all<T>(sql: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) reject(err);
            else resolve(rows as T[]);
        });
    });
}

export function get<T>(sql: string): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
        db.get(sql, (err, row) => {
            if (err) reject(err);
            else resolve(row as T | undefined);
        });
    });
}

export function run(sql: string): Promise<{ lastID: number; changes: number }> {
    return new Promise((resolve, reject) => {
        db.run(sql, function (err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}

export function escapeSqlString(value: string): string {
    return String(value).replace(/'/g, "''");
}