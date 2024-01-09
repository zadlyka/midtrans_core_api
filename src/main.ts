import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { TypeOrmExceptionFilter } from './common/filters/typeorm-exception.filter';
import { PgExceptionFilter } from './common/filters/pg-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );

  app.useGlobalFilters(
    new TypeOrmExceptionFilter(httpAdapter),
    new PgExceptionFilter(httpAdapter),
  );
  await app.listen(3000);
}
bootstrap();
