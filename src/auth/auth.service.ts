import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto, SignUpResponse } from './dto/create-auth.dto.js';
import { PrismaService } from '../database/prisma.service.js';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/database/prisma-client/enums.js';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signUp(createAuthDto: CreateAuthDto): Promise<SignUpResponse> {
    console.log(createAuthDto);
    const { name, email, password, role } = createAuthDto;
    if (!role || !email || !password || !name) {
      throw new BadRequestException('All fields are required');
    }
    // console.log('EMAIL VALUE:', email, typeof email);
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    console.log('Existing User:', existingUser);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
      });
      return {
        message: 'User registered successfully',
        user: {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role as Role,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Registration failed: ${error.message}`);
    }
  }
}
