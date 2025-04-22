import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const res =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error', errorCode: 'INTERNAL_ERROR' };

    const message = typeof res === 'string' ? res : res['message'];
    // const errorCode =
    //   typeof res === 'object'
    //     ? res['errorCode'] || 'UNKNOWN_ERROR'
    //     : 'UNKNOWN_ERROR';

    response.status(statusCode).json({
      status: false,
      statusCode,
      message,
      data: null,
      timestamp: new Date().toISOString(),
      //   path: request.url,
    });
  }
}
