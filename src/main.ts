import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { WinstonModule, utilities } from 'nest-winston'
import * as winston from 'winston'
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.STAGE === 'prod' ? 'info' : 'debug',
          format: winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike('HM-Project', { prettyPrint: true })
          )
        })
      ]
    })
  });
  
  const configService = app.get(ConfigService);
  const stage = configService.get('STAGE');

  const config = new DocumentBuilder()
    .setTitle('hotel management')
    .setDescription('hotel management API')
    .setVersion('1.0.0')
    .addTag('management web app')
    .addBearerAuth()
    .build();
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    }
  }
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, customOptions);

  app.useGlobalFilters(new HttpExceptionFilter());
  
  const port = 3000;
  await app.listen(port);
  Logger.log(`start ${port}`)
  Logger.log(`stage: ${stage}`)
}
bootstrap();
