import {ExceptionFilter, Catch, ArgumentsHost} from '@nestjs/common';
import {QueryFailedError} from 'typeorm';
import {Response} from 'express';

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
    catch(exception: QueryFailedError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        if (exception.message.includes('Duplicate entry')) {
            const matches = exception.message.match(/Duplicate entry '(.+?)'/);
            const duplicateValue = matches ? matches[1] : 'unknown value'
            return response.status(409).json({
                success: false,
                message: `Duplicate entry detected: ${duplicateValue}`,
                errorCode: 'DUPLICATE_ENTRY',
                statusCode: 409,
                timestamp: new Date().toISOString(),
            });
        }
        response.status(500).json({
            success: false,
            message: 'Internal server error',
            errorCode: 'QUERY_FAILED',
            statusCode: 500,
            timestamp: new Date().toISOString(),
        });
    }
}