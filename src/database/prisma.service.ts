import { Injectable } from '@nestjs/common';
import { PrismaClient } from './prisma-client/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const url = process.env.DATABASE_URL;
console.log('Prisma DATABASE URL:', url);

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({ url });
    console.log('Prisma Adapter:', adapter);
    super({ adapter });
  }
}
