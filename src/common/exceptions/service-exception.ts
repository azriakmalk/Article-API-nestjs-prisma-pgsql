import { HttpException, HttpStatus } from '@nestjs/common';

export class ServiceException extends HttpException {
  constructor(
    message: string,
    status = HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode = 'SERVICE_ERROR',
  ) {
    super({ message, errorCode }, status);
  }
}
