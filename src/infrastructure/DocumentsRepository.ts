import { IDocumentRepository } from "../core/interfaces/IDocumentRepository";
import { Document } from "../core/entities/Document";
import { Pool } from "pg";

export class DocumentRepository implements IDocumentRepository {

    _pool: Pool;
    constructor(pool: Pool) {
        this._pool = pool;
    }

    async add(record: Document): Promise<string> {
        const sql = 'INSERT INTO public.documents(id, collection_name, document_data)VALUES ($1, $2, $3);'
        const values = [record.id, record.collectionName, record.data]
        try {
            const res = await this._pool.query(sql, values)
            console.log(res.rows[0]);
        } catch (err) {
            console.log(err.stack)
        }

        return record.id;
    }

    async update(record: Document): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(recordId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async get(recordId: string): Promise<Document> {
        throw new Error("Method not implemented.");
    }

    async getAll(): Promise<Document[]> {
        throw new Error("Method not implemented.");
    }

    async recordExists(recordId: string): Promise<boolean> {
        const sql = 'SELECT COUNT(*) FROM public.documents WHERE id = $1';
        const values = [recordId];
        let count: number;

        try {
            const res = await this._pool.query(sql, values)
            count = res.rows[0].count;
        } catch (err) {
            console.log(err.stack)
        }

        return count > 0;
    }
}