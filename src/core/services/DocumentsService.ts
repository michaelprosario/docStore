
import { v4 as uuid } from "uuid";
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

    public async add(record: Document): Promise<IGenericResponse> {
        if (!record) {
            return Responses.getResponse("record is null", 400);
        }

        this.validate(record);

        record.id = uuid();
        await this.repository.add(record);

        const response = Responses.getResponse("ok", 200);
        response.recordId = record.id;
        return response;
    }

    public async delete(recordId: string): Promise<IGenericResponse> {
        if (!recordId || recordId === "") {
            return Responses.getResponse("recordId is not defined", 400);
        }

        const recordExists = await this.repository.recordExists(recordId);
        if (!recordExists) {
            return Responses.getResponse("recordId is not found", 404);
        }

        await this.repository.delete(recordId);

        return Responses.getResponse("ok", 200);
    }

    public async get(recordId: string): Promise<IGenericResponse> {
        if (!recordId || recordId === "") {
            return Responses.getResponse("recordId is not defined", 400);
        }

        const recordExists = await this.repository.recordExists(recordId);
        if (!recordExists) {
            return Responses.getResponse("recordId is not found", 404);
        }

        const response = Responses.getResponse("ok", 200);
        response.data = await this.repository.get(recordId);

        return response;
    }

    public async update(record: Document): Promise<IGenericResponse> {
        const originalRecord = await this.repository.get(record.id);
        originalRecord.data = record.data;
        this.repository.update(originalRecord);

        const response = Responses.getResponse("ok", 200);
        return response;
    }

    public async getAll(collection: string): Promise<IGenericResponse> {
        const response = Responses.getResponse("ok", 200);
        response.data = await this.repository.getAll(collection);
        return response;
    }
}
