import { Document } from "../entities/Document";
import { IGenericResponse } from "./IGenericResponse";

export interface IDocumentRepository {
    add(record: Document): string;
    update(record: Document): void;
    delete(recordId: string): void;
    get(recordId: string): Document;
    getAll(): Array<Document>;
}
