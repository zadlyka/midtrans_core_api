import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(HttpException)
export class DefaultExceptionFilter implements ExceptionFilter {
  constructor(protected readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const { message = 'Unknown error' } = exception.getResponse();

    const responseBody = {
      statusCode: httpStatus,
      message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
