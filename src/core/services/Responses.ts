import * as HttpStatus from "http-status-codes";
import { IGenericResponse } from "../interfaces/IGenericResponse";

export class Responses {
    public static getResponse(message: string, code: number): IGenericResponse {
        const response: IGenericResponse = { message: "", code: 20, recordId: "", errors: [], data: null };
        response.message = message;
        response.code = code;
        return response;
    }

    public static getValidationResponse(errorData: string[], id: string): IGenericResponse {
        return {
            code: HttpStatus.BAD_REQUEST,
            data: null,
            errors: errorData,
            message: "Bad data",
            recordId: id,
        };
    }
}
