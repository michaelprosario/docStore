import { Document } from "../entities/Document";

export interface IDocumentRepository {
    add(record: Document): string;
}
