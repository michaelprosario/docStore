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
        } catch (err) {
            console.log(err.stack)
        }

        return record.id;
    }

    async update(record: Document): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(recordId: string): Promise<void> {
        const sql = 'DELETE FROM public.documents WHERE id = $1;'
        try {
            const res = await this._pool.query(sql, [recordId]);
        } catch (err) {
            console.log(err.stack)
        }
    }

    async get(recordId: string): Promise<Document> {
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
        `
        let document = new Document();
        try {
            const res = await this._pool.query(sql, [recordId])
            if (res.rowCount > 0) {
                let record = res.rows[0];
                this.populateEntityFromRecord(document, record);
                return document;
            } else {
                return null;
            }
        } catch (err) {
            console.log(err.stack)
        }
    }

    private populateEntityFromRecord(document: Document, record: any) {
        document.collectionName = record.collection_name;
        document.data = record.document_data;
        document.id = record.id;
    }

    async getAll(collection: string): Promise<Document[]> {
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
        `

        let results = Array<Document>();
        try {
            const res = await this._pool.query(sql, [collection])
            if (res.rowCount > 0) {
                for (let record of res.rows) {
                    let document = new Document();
                    this.populateEntityFromRecord(document, record);
                    results.push(document);
                }

                return results;
            } else {
                return results;
            }
        } catch (err) {
            console.log(err.stack)
        }
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