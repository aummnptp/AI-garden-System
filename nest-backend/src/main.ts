import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: [`${process.env.REACT_APP_API_URL}`,' https://lh3.googleusercontent.com', ],// หรือคุณสามารถใส่ '*' เพื่ออนุญาตทุก domain
    // methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, 
  });

  await app.listen(3000);
}
bootstrap();
