import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { EntityNotFoundError, TypeORMError } from 'typeorm';
import { DefaultExceptionFilter } from './default-exception.filter';

@Catch(TypeORMError)
export class TypeOrmExceptionFilter extends DefaultExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    if (exception instanceof EntityNotFoundError) {
      const responseBody = {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Not Found',
      };

      return httpAdapter.reply(
        ctx.getResponse(),
        responseBody,
        responseBody.statusCode,
      );
    }

    return super.catch(exception, host);
  }
}
