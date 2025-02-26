import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: [`${process.env.REACT_APP_API_URL}`],// หรือคุณสามารถใส่ '*' เพื่ออนุญาตทุก domain
    // methods: 'GET,POST,PUT,DELETE',
    credentials: true, 
    allowedHeaders: 'Content-Type, Authorization',
  });
  
  // เสิร์ฟไฟล์จากโฟลเดอร์ 'uploads'
  app.useStaticAssets('/app/uploads', { prefix: '/uploads' });
  await app.listen(3000);
}
bootstrap();
