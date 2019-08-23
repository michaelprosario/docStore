import { Document } from "../entities/Document";
import { IGenericResponse } from "./IGenericResponse";

export interface IDocumentRepository {
    add(record: Document): IGenericResponse;
    update(record: Document): IGenericResponse;
    delete(recordId: string): IGenericResponse;
    get(recordId: string): IGenericResponse;
    getAll(): IGenericResponse;
}
