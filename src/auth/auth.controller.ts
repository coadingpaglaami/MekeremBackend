import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import {
  AuthResponse,
  CreateAuthDto,
  ForgetPassDto,
  LoginDto,
  LoginResponse,
  RefreshTokenDto,
  RefreshTokenResponse,
  ResetPasswordDto,
  SignUpResponse,
  VerifyOtpDto,
} from './dto/create-auth.dto.js';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { Role } from '../database/prisma-client/enums.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createAuthDto: CreateAuthDto): Promise<SignUpResponse> {
    return await this.authService.signUp(createAuthDto);
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return await this.authService.login(loginDto);
  }
  @Post('forget-password')
  async forgetPassword(
    @Body() forgetPassDto: ForgetPassDto,
  ): Promise<AuthResponse> {
    return await this.authService.forgetPassword(forgetPassDto);
  }
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<AuthResponse> {
    return await this.authService.verifyOtp(verifyOtpDto);
  }
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<AuthResponse> {
    return await this.authService.resetPassword(resetPasswordDto);
  }
  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponse> {
    return await this.authService.refreshToken(refreshTokenDto);
  }
  @Get('google')
  async googleAuth(
    @Res() res: Response,
    @Query() role: Role,
  ): Promise<any> {
    const state = encodeURIComponent(JSON.stringify({ role }));
    const redirectUrl =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${process.env.GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}` +
      `&response_type=code` +
      `&scope=profile email` +
      `&state=${state}`;
    return res.redirect(redirectUrl);
  }
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req:Request, @Res() res:Response): Promise<any> {
    return await this.authService.googleAuth(req, res);
  }
}
