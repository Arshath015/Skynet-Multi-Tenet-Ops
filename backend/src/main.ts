import * as dotenv from 'dotenv';
import 'dotenv/config';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((req: any, res, next) => {
    req.tenantId = 'PUT_REAL_TENANT_ID_HERE';
    next();
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();