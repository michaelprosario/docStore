import { IDocumentRepository } from "../core/interfaces/IDocumentRepository";
import { Document } from "../core/entities/Document";

//  todo: Implement using https://www.npmjs.com/package/mysql
export class DocumentRepository implements IDocumentRepository
{
    add(record: Document): string {
        throw new Error("Method not implemented.");
    }    
    
    update(record: Document): void {
        throw new Error("Method not implemented.");
    }

    delete(recordId: string): void {
        throw new Error("Method not implemented.");
    }

    get(recordId: string): Document {
        throw new Error("Method not implemented.");
    }

    getAll(): Document[] {
        throw new Error("Method not implemented.");
    }


}