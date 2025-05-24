import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const apiPath = '/';
  const options = new DocumentBuilder()
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .setTitle('whaToDO')
    .setDescription('API for version 1.0')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${apiPath}`, app, document);
  app.enableCors({
    origin: [
      'https://task-nest-psi.vercel.app/',
      'http://localhost:3000',
      'https://task-nest.vercel.app/',
    ],
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
    allowedHeaders: '*',
    credentials: true,

  });
  await app.listen(process.env.PORT);
}
bootstrap();
