import { Pool } from "pg";
import { Document } from "../core/entities/Document";
import { IDocumentRepository } from "../core/interfaces/IDocumentRepository";

function logError(info: string) {
    console.log(info);
}

export class DocumentRepository implements IDocumentRepository {

    public pool: Pool;
    constructor(pool: Pool) {
        this.pool = pool;
    }

    public async add(record: Document): Promise<string> {
        const sql = "INSERT INTO public.documents(id, collection_name, document_data)VALUES ($1, $2, $3);";
        const values = [record.id, record.collectionName, record.data];
        try {
            const res = await this.pool.query(sql, values);
        } catch (err) {
            logError(err.stack);
        }

        return record.id;
    }

    public async update(record: Document): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async delete(recordId: string): Promise<void> {
        const sql = "DELETE FROM public.documents WHERE id = $1;";
        try {
            const res = await this.pool.query(sql, [recordId]);
        } catch (err) {
            logError(err.stack);
        }
    }

    public async get(recordId: string): Promise<Document> {
        const sql = `
        SELECT
        id,
        collection_name,
        document_data,
        created_at,
        created_by,
        updated_at,
        updated_by
        FROM public.documents
        WHERE id = $1;
        `;
        const document = new Document();
        try {
            const res = await this.pool.query(sql, [recordId]);
            if (res.rowCount > 0) {
                const record = res.rows[0];
                this.populateEntityFromRecord(document, record);
                return document;
            } else {
                return null;
            }
        } catch (err) {
            logError(err.stack);
        }
    }

    public async getAll(collection: string): Promise<Document[]> {
        const sql = `
        SELECT
        id,
        collection_name,
        document_data,
        created_at,
        created_by,
        updated_at,
        updated_by
        FROM public.documents
        WHERE collection_name = $1;
        `;

        const results = Array<Document>();
        try {
            const res = await this.pool.query(sql, [collection]);
            if (res.rowCount > 0) {
                for (const record of res.rows) {
                    const document = new Document();
                    this.populateEntityFromRecord(document, record);
                    results.push(document);
                }

                return results;
            } else {
                return results;
            }
        } catch (err) {
            logError(err.stack);
        }
    }

    public async recordExists(recordId: string): Promise<boolean> {
        const sql = "SELECT COUNT(*) FROM public.documents WHERE id = $1";
        const values = [recordId];
        let count: number;

        try {
            const res = await this.pool.query(sql, values);
            count = res.rows[0].count;
        } catch (err) {
            logError(err.stack);
        }

        return count > 0;
    }

    private populateEntityFromRecord(document: Document, record: any) {
        document.collectionName = record.collection_name;
        document.data = record.document_data;
        document.id = record.id;
    }
}
