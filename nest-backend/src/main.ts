import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: [`${process.env.REACT_APP_API_URL}`,`http://suture-bot.it.kmitl.ac.th:5001`],
    credentials: true, 
    allowedHeaders: 'Content-Type, Authorization',
  });
  

  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });
  await app.listen(3000);
}
bootstrap();
