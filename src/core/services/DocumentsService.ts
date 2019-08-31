
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
        record.createdAt = new Date();
        await this.repository.add(record);

        const response = Responses.getResponse("ok", 200);
        response.recordId = record.id;
        return response;
    }

    public async delete(collection: string, recordId: string): Promise<IGenericResponse> {
        if (!recordId || recordId === "") {
            return Responses.getResponse("recordId is not defined", 400);
        }

        const recordExists = await this.repository.recordExists(collection, recordId);
        if (!recordExists) {
            return Responses.getResponse("recordId is not found", 404);
        }

        await this.repository.delete(collection, recordId);

        return Responses.getResponse("ok", 200);
    }

    public async get(collection: string, recordId: string): Promise<IGenericResponse> {
        if (!recordId || recordId === "") {
            return Responses.getResponse("recordId is not defined", 400);
        }

        const recordExists = await this.repository.recordExists(collection, recordId);
        if (!recordExists) {
            return Responses.getResponse("recordId is not found", 404);
        }

        const response = Responses.getResponse("ok", 200);
        response.data = await this.repository.get(collection, recordId);

        return response;
    }

    public async update(record: Document): Promise<IGenericResponse> {
        const recordExists = await this.repository.recordExists(record.collectionName, record.id);
        if (!recordExists) {
            return Responses.getResponse("recordId is not found", 404);
        }

        const recordToWrite = await this.repository.get(record.collectionName, record.id);
        recordToWrite.data = record.data;
        recordToWrite.updatedAt = new Date();
        this.repository.update(recordToWrite);

        const response = Responses.getResponse("ok", 200);

        return response;
    }

    public async getAll(collection: string): Promise<IGenericResponse> {
        const response = Responses.getResponse("ok", 200);
        response.data = await this.repository.getAll(collection);
        return response;
    }
}
