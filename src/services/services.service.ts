import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class ServicesService {
    constructor(private prismaService:PrismaService) {}
    

}
