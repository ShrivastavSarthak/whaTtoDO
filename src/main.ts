import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const apiPath = '/';
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('whaToDO')
    .setDescription('Swagger example')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${apiPath}`, app, document);

  await app.listen(3000);
}
bootstrap();
