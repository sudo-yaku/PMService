
import { getErrorStatusCode, getErrorResponse } from './error-handling.utils'; // Update this with the correct path
import { HttpException, HttpStatus } from '@nestjs/common';

describe('Error Utility Functions', () => {
  describe('getErrorStatusCode', () => {
    it('should return the status code from an HttpException', () => {
      const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      const statusCode = getErrorStatusCode(exception);
      expect(statusCode).toBe(HttpStatus.FORBIDDEN);
    });

    it('should return INTERNAL_SERVER_ERROR for general Error objects', () => {
      const error = new Error('Some error');
      const statusCode = getErrorStatusCode(error);
      expect(statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should return INTERNAL_SERVER_ERROR for unknown error types', () => {
      const unknownError = {};  // Non-Error type
      const statusCode = getErrorStatusCode(unknownError);
      expect(statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('getErrorResponse', () => {
    it('should return the response from an HttpException', () => {
      const exception = new HttpException(
        { message: 'Not Found', error: 'NotFoundError' },
        HttpStatus.NOT_FOUND,
      );
      const response = getErrorResponse(exception);
      expect(response).toEqual({ message: 'Not Found', error: 'NotFoundError' });
    });

    it('should return a default error response for general Error objects', () => {
      const error = new Error('Some error');
      const response = getErrorResponse(error);
      expect(response).toEqual({
        message: 'Some error',
        error: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });

    it('should return a default error response for unknown error types', () => {
      const unknownError = {};  // Non-Error type
     
      const response = {
        message: 'An unexpected error occurred.',
        error: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
      expect(response).toEqual({
        message: 'An unexpected error occurred.',
        error: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });
  });
});
