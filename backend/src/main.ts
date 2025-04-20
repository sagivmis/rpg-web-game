import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let cachedServer: any = null;

async function bootstrap() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
  }

  return cachedServer;
}

// This is what Vercel will call
export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  return server(req, res);
}
