import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { Environemnt } from './environemnt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({ json: true, colors: true }),
  });
  app.enableCors({})
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  await app.listen(Environemnt.PORT);
}
bootstrap();
