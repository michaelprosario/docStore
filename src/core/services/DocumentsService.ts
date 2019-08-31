import { AbstractValidator, Severity } from "fluent-ts-validator";
import * as HttpStatus from "http-status-codes";
import { v4 as uuid } from "uuid";
import { Document } from "../entities/Document";
import { IDocumentRepository } from "../interfaces/IDocumentRepository";
import { IGenericResponse } from "../interfaces/IGenericResponse";
import { Responses } from "../services/Responses";
import { DocumentValidator } from "../validators/DocumentValidator";

export class DocumentsService {

    constructor(private repository: IDocumentRepository) {
    }

    public validate(record: Document): string[] {
        const validator = new DocumentValidator();
        const validatorResults = validator.validate(record);
        return validatorResults.getFailureMessages();
    }

    public async add(record: Document): Promise<IGenericResponse> {
        if (!record) {
            return Responses.getResponse("record is null", HttpStatus.BAD_REQUEST);
        }

        const errors = this.validate(record);
        if (errors.length > 0) {
            return Responses.getValidationResponse(errors, record.id);
        }

        record.id = uuid();
        record.createdAt = new Date();
        await this.repository.add(record);

        const response = Responses.getResponse("ok", HttpStatus.OK);
        response.recordId = record.id;
        return response;
    }

    public async delete(collection: string, recordId: string): Promise<IGenericResponse> {
        if (!recordId || recordId === "") {
            return Responses.getResponse("recordId is not defined", HttpStatus.BAD_REQUEST);
        }

        const recordExists = await this.repository.recordExists(collection, recordId);
        if (!recordExists) {
            return Responses.getResponse("recordId is not found", HttpStatus.NOT_FOUND);
        }

        await this.repository.delete(collection, recordId);

        return Responses.getResponse("ok", 200);
    }

    public async get(collection: string, recordId: string): Promise<IGenericResponse> {
        if (!recordId || recordId === "") {
            return Responses.getResponse("recordId is not defined", HttpStatus.BAD_REQUEST);
        }

        const recordExists = await this.repository.recordExists(collection, recordId);
        if (!recordExists) {
            return Responses.getResponse("recordId is not found", HttpStatus.NOT_FOUND);
        }

        const response = Responses.getResponse("ok", HttpStatus.OK);
        response.data = await this.repository.get(collection, recordId);

        return response;
    }

    public async update(record: Document): Promise<IGenericResponse> {
        const recordExists = await this.repository.recordExists(record.collectionName, record.id);
        if (!recordExists) {
            return Responses.getResponse("recordId is not found", HttpStatus.NOT_FOUND);
        }

        const errors = this.validate(record);
        if (errors.length > 0) {
            return Responses.getValidationResponse(errors, record.id);
        }

        const recordToWrite = await this.repository.get(record.collectionName, record.id);
        recordToWrite.data = record.data;
        recordToWrite.updatedAt = new Date();
        this.repository.update(recordToWrite);

        const response = Responses.getResponse("ok", HttpStatus.OK);

        return response;
    }

    public async getAll(collection: string): Promise<IGenericResponse> {
        const response = Responses.getResponse("ok", HttpStatus.OK);
        response.data = await this.repository.getAll(collection);
        return response;
    }
}
