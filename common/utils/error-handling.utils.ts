import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorStatusCode = (error: any) => {
  if (error instanceof HttpException) {
    return error.getStatus();
  } else {
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorResponse = (error: any) => {
  if (error instanceof HttpException) {
    return error.getResponse();
  } else {
    return {
      message: error.message,
      error: 'Internal Server Error',
      statusCode: 500,
    };
  }
};
