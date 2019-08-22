import { Document } from "../entities/Document";
import { IDocumentRepository } from "../interfaces/IDocumentRepository";

export class DocumentsService {

    constructor(private repository: IDocumentRepository) {
    }
    public add(record: Document): string {
        return this.repository.add(record);
    }
}
