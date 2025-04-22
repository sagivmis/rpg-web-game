import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let cachedServer: any = null;

async function bootstrap() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.init();
    if (process.env.ENV === 'local-development')
      await app.listen(process.env.PORT ?? 3000);

    cachedServer = app.getHttpAdapter().getInstance();
  }

  return cachedServer;
}

bootstrap();

// This is what Vercel will call
export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  return server(req, res);
}
