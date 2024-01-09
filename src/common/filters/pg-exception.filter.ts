import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { DefaultExceptionFilter } from './default-exception.filter';

const formatter = {
  '22001': {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'value too long for type character varying',
  },
  '23503': {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'non existent key violates foreign key constraint',
  },
  '23505': {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'duplicate key value violates unique constraint',
  },
  '22P02': {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Not Found',
  },
};

@Catch(QueryFailedError)
export class PgExceptionFilter extends DefaultExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    if (formatter[exception.driverError.code]) {
      const responseBody = formatter[exception.driverError.code];
      return httpAdapter.reply(
        ctx.getResponse(),
        responseBody,
        responseBody.statusCode,
      );
    }

    return super.catch(exception, host);
  }
}
