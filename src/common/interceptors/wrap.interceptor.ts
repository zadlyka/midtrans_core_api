import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Observable, map } from 'rxjs';

@Injectable()
export class WrapInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((args) => {
        const data = instanceToPlain(args);
        if (data?.data) return { statusCode: response.statusCode, ...data };
        return { statusCode: response.statusCode, data };
      }),
    );
  }
}
