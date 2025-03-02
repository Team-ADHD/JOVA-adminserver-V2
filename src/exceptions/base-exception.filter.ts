import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ExceptionResponseDto } from './dto/response/exception-response.dto';

@Catch(HttpException)
export class BaseExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;
    const responseDto = new ExceptionResponseDto(
      exceptionResponse.message || 'An error occurred',
      status,
      exceptionResponse.errorCode || 'UNKNOWN_ERROR',
    );
    response.status(status).json(responseDto);
  }
}