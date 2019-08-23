import { Document } from "../entities/Document";
import { IGenericResponse } from "./IGenericResponse";

export interface IDocumentRepository {
    add(record: Document): Promise<string>;
    update(record: Document): Promise<void>;
    delete(recordId: string): Promise<void>;
    get(recordId: string): Promise<Document>;
    getAll(): Promise<Array<Document>>;
}
