import { HttpStatus } from '@nestjs/common';

export class BaseResponse<T> {
  status: boolean;
  statusCode: HttpStatus;
  message: string;
  data: T;

  constructor(data: T, message = 'Success', statusCode = HttpStatus.OK) {
    this.status = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
