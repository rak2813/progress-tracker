import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  // app.enableCors({
  //   origin: 'http://127.0.0.1:5500', // Replace with your frontend URL
  //   methods: 'GET,POST,PUT,DELETE',
  //   allowedHeaders: 'Content-Type, Authorization',
  // });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
