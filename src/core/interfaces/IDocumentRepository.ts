import { Document } from "../entities/Document";

export interface IDocumentRepository {
    add(record: Document): Promise<string>;
    update(record: Document): Promise<void>;
    delete(recordId: string): Promise<void>;
    get(recordId: string): Promise<Document>;
    recordExists(recordId: string): Promise<boolean>;
    getAll(collection: string): Promise<Document[]>;
}
