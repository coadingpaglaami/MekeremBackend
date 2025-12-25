import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateAuthDto, SignUpResponse } from './dto/create-auth.dto.js';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createAuthDto:CreateAuthDto):Promise<SignUpResponse> {
   return  await this.authService.signUp(createAuthDto);
    
  }

 
}
