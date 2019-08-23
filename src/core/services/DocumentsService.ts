
import { v4 as uuid } from 'uuid';
import { Document } from "../entities/Document";
import { IDocumentRepository } from "../interfaces/IDocumentRepository";
import { IGenericResponse } from "../interfaces/IGenericResponse";
import { Responses } from "../services/Responses";

export class DocumentsService {

    constructor(private repository: IDocumentRepository) {
    }

    public validate(record: Document) {
        const errors = [];

        if (!record.collectionName || record.collectionName === "") {
            errors.push("Collection name not defined");
        }

        if (!record.data || record.data === "") {
            errors.push("Data not defined");
        }

        return errors;
    }

    public add(record: Document): IGenericResponse {
        if (!record) {
            return Responses.getResponse("record is null", 400);
        }

        this.validate(record);

        record.id = uuid();
        this.repository.add(record);

        const response = Responses.getResponse("ok", 200);
        response.recordId = record.id;
        return response;
    }

    public delete(recordId: string): IGenericResponse {
        if (!recordId || recordId === "") {
            return Responses.getResponse("recordId is not defined", 400);
        }

        this.repository.delete(recordId);

        return Responses.getResponse("ok", 200);
    }

    public get(recordId: string): IGenericResponse {
        if (!recordId || recordId === "") {
            return Responses.getResponse("recordId is not defined", 400);
        }

        const response = Responses.getResponse("ok", 200);
        response.data = this.repository.get(recordId);

        return response;
    }

    public update(record: Document): IGenericResponse {
        const originalRecord = this.repository.get(record.id);
        originalRecord.data = record;
        this.repository.update(record);

        const response = Responses.getResponse("ok", 200);
        return response;
    }

    public getAll(): IGenericResponse {
        const response = Responses.getResponse("ok", 200);
        response.data = this.repository.getAll();
        return response;
    }
}
