export class ExceptionResponseDto {
    message: string;
    statusCode: number;
    error: string;
    timestamp: string;

    constructor(message: string, statusCode: number, error: string) {
        this.message = message;
        this.statusCode = statusCode;
        this.error = error;
        this.timestamp = new Date().toISOString();
    }
}