export interface IGenericResponse {
    recordId: string;
    code: number;
    message: string;
    errors: [];
    data: any;
}