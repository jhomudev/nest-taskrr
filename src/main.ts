import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CORS } from './config/cors.config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.setGlobalPrefix('api/v1');
  app.enableCors(CORS);

  // API documentation
  const config = new DocumentBuilder()
    .setTitle('Taskrr App')
    .setDescription('Application oh tasks management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Run app
  const port = app.get(ConfigService).get('PORT') || 3000;
  await app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}
bootstrap();
