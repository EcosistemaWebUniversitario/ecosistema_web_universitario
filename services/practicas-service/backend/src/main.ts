import * as dotenv from 'dotenv';
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.local' });
}
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req: any, res: any, next: any) => {
  const originalJson = res.json;
  res.json = function (body: any) {
    if (body && body.statusCode >= 400) {
      console.error('🔥 ERROR RESPONSE:', JSON.stringify(body, null, 2));
    }
    return originalJson.call(this, body);
  };
  next();
});

  // Obtener configuración de variables de entorno
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const allowedOrigins = configService.get<string>('CORS_ORIGINS')?.split(',') || ['http://localhost:5173'];

  // Prefijo global
  app.setGlobalPrefix('api/v1');

  // CORS configurable
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Pipes globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Interceptores y filtros
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Logger más detallado en desarrollo
  if (configService.get('NODE_ENV') === 'development') {
    app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);
  } else {
    app.useLogger(['log', 'error', 'warn']);
  }

  await app.listen(port);
  console.log(`🚀 Practicas-service corriendo en http://localhost:${port}/api/v1`);
}
bootstrap();