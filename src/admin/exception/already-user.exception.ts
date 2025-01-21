import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyUserException extends HttpException {
  constructor(message: string, statusCode: number = HttpStatus.CONFLICT) {
    super(
      {
        message,
        statusCode,
      },
      statusCode,
    );
  }
}