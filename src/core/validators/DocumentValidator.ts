import { AbstractValidator, Severity } from "fluent-ts-validator";
import { Document } from "../entities/Document";

export class DocumentValidator extends AbstractValidator<Document> {
    constructor() {
        super();
        this.validateIfString((doc) => doc.collectionName)
            .isNotEmpty().hasMinLength(5);

        this.validateIfAny((doc) => doc.data)
            .isNotEmpty();
    }
}
