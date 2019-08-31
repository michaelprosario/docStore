import { Document } from "../entities/Document";

export interface IDocumentRepository {
    add(record: Document): Promise<string>;
    update(record: Document): Promise<void>;
    delete(collection: string, recordId: string): Promise<void>;
    get(collection: string, recordId: string): Promise<Document>;
    recordExists(collection: string, recordId: string): Promise<boolean>;
    getAll(collection: string): Promise<Document[]>;
}
