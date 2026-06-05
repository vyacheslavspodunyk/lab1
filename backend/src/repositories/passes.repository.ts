import { CreatePassDto, PassResponseDto, UpdatePassDto } from "../dtos/pass.dto";
import { all, get, run, escapeSqlString } from "../db/dbClient";

type PassRow = PassResponseDto & {
    createdAt: string;
    updatedAt: string | null;
};

type PassQuery = {
    reason?: string;
    search?: string;
    sort?: string;
};

function sqlText(value: string): string {
    return `'${escapeSqlString(value)}'`;
}

function sqlNullableText(value: string | undefined | null): string {
    if (!value) return "NULL";
    return sqlText(value);
}

export class PassesRepository {
    async findAll(query: PassQuery = {}) {
        const conditions: string[] = [];

        if (query.reason) {
            conditions.push(`reason = ${sqlText(query.reason)}`);
        }

        if (query.search) {
            const search = escapeSqlString(query.search.toLowerCase());
            conditions.push(`LOWER(userName) LIKE '%${search}%'`);
        }

        let sql = `
            SELECT id, userName, reason, date, comment, issuer, createdAt, updatedAt
            FROM passes
        `;

        if (conditions.length > 0) {
            sql += ` WHERE ${conditions.join(" AND ")}`;
        }

        if (query.sort === "dateAsc") {
            sql += " ORDER BY date ASC";
        } else if (query.sort === "dateDesc") {
            sql += " ORDER BY date DESC";
        } else {
            sql += " ORDER BY id DESC";
        }

        return await all<PassRow>(sql);
    }

    async findById(id: number) {
        return await get<PassRow>(`
            SELECT id, userName, reason, date, comment, issuer, createdAt, updatedAt
            FROM passes
            WHERE id = ${Number(id)}
        `);
    }

    async create(data: CreatePassDto) {
        const now = new Date().toISOString();

        const result = await run(`
            INSERT INTO passes 
            (userName, reason, date, comment, issuer, createdAt, updatedAt)
            VALUES (
                ${sqlText(data.userName)},
                ${sqlText(data.reason)},
                ${sqlText(data.date)},
                ${sqlNullableText(data.comment)},
                ${sqlText(data.issuer)},
                ${sqlText(now)},
                NULL
            )
        `);

        await run(`
            INSERT INTO pass_logs (passId, action, createdAt)
            VALUES (${result.lastID}, 'created', ${sqlText(now)})
        `);

        return await this.findById(result.lastID);
    }

    async update(id: number, data: UpdatePassDto) {
        const current = await this.findById(id);
        if (!current) return null;

        const updated = {
            userName: data.userName ?? current.userName,
            reason: data.reason ?? current.reason,
            date: data.date ?? current.date,
            comment: data.comment ?? current.comment,
            issuer: data.issuer ?? current.issuer
        };

        const now = new Date().toISOString();

        const result = await run(`
            UPDATE passes
            SET
                userName = ${sqlText(updated.userName)},
                reason = ${sqlText(updated.reason)},
                date = ${sqlText(updated.date)},
                comment = ${sqlNullableText(updated.comment)},
                issuer = ${sqlText(updated.issuer)},
                updatedAt = ${sqlText(now)}
            WHERE id = ${Number(id)}
        `);

        if (result.changes === 0) return null;

        await run(`
            INSERT INTO pass_logs (passId, action, createdAt)
            VALUES (${Number(id)}, 'updated', ${sqlText(now)})
        `);

        return await this.findById(id);
    }

    async delete(id: number) {
        const result = await run(`
            DELETE FROM passes 
            WHERE id = ${Number(id)}
        `);

        return result.changes > 0;
    }

    async findLogs(passId: number) {
        return await all(`
            SELECT id, passId, action, createdAt
            FROM pass_logs
            WHERE passId = ${Number(passId)}
            ORDER BY id DESC
        `);
    }
}