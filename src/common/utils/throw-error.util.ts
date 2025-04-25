import { HttpException } from '@nestjs/common';
import { ServiceException } from '../exceptions';

export function throwError(error: any): never {
  console.error('[Service Error]', {
    name: error?.name,
    message: error?.message,
    stack: error?.stack,
  });

  if (error instanceof HttpException) {
    throw error;
  }

  throw new ServiceException('Internal server error');
}
