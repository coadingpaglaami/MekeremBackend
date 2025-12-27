import { BadRequestException, Injectable } from '@nestjs/common';
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
import { PrismaService } from '../database/prisma.service.js';
import * as bcrypt from 'bcrypt';
import { Role } from '../database/prisma-client/enums.js';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service.js';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}
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

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      typeof user.password === 'string' ? user.password : '',
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: refresh_token },
    });

    return {
      message: 'Login successful',
      token: {
        accessToken: access_token,
        refreshToken: refresh_token,
      },
    };
  }
  async forgetPassword(forgetPassword: ForgetPassDto): Promise<AuthResponse> {
    const { email } = forgetPassword;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('Email not found');
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.prisma.user.update({
      where: { email },
      data: {
        otp: await bcrypt.hash(code, 10),
        otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
    await this.mailService.sentOtpMail(email, code);
    return {
      message: `A 6-digit OTP has been sent to ${email}. Please check your email to proceed with password reset.`,
    };
  }
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<AuthResponse> {
    const { email, otp } = verifyOtpDto;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('Email not found');
    }
    if (!user.otp || !user.otpExpiry) {
      throw new BadRequestException('No OTP found. Please request a new one.');
    }
    if (user.otpExpiry < new Date()) {
      throw new BadRequestException(
        'OTP has expired. Please request a new one.',
      );
    }
    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      throw new BadRequestException('Invalid OTP. Please try again.');
    }
    return {
      message: 'OTP verified successfully',
    };
  }
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<AuthResponse> {
    const { email, newPassword, confirmNewPassword, otp } = resetPasswordDto;
    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('Email not found');
    }
    if (!user.otp || !user.otpExpiry) {
      throw new BadRequestException('No OTP found. Please request a new one.');
    }
    if (user.otpExpiry < new Date()) {
      throw new BadRequestException(
        'OTP has expired. Please request a new one.',
      );
    }
    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      throw new BadRequestException('Invalid OTP. Please try again.');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpiry: null,
      },
    });
    return {
      message: 'Password reset successfully',
    };
  }
  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponse> {
    const { refreshToken } = refreshTokenDto;
    let payload: {
      sub: string;
      name: string;
      email: string;
      role: Role;
    };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user || user.refreshToken !== refreshToken) {
      throw new BadRequestException('Invalid refresh token');
    }
    const access_token = await this.jwtService.signAsync({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    return {
      accessToken: access_token,
      refreshToken: refreshToken,
    };
  }

  async googleAuth(req: Request, res: Response): Promise<void> {
    const googleUser = req.user as any;
    const { email, roleIntent } = googleUser;
    const allowedRoles = ['CARRIER', 'TRAVELLER'] as const;

    // roleIntent is string, not object
    if (!roleIntent || !allowedRoles.includes(roleIntent.role)) {
      throw new BadRequestException('Invalid role intent');
    }

    // check existing user
    let existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      existingUser = await this.prisma.user.create({
        data: {
          name: `${googleUser.firstName} ${googleUser.lastName}`.trim(),
          email: googleUser.email,
          oauthProvider: 'google',
          role: roleIntent.role
        },
      });
    }

    // JWT payload
    const payload = {
      sub: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
      role: existingUser.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    // update refresh token in DB
    await this.prisma.user.update({
      where: { id: existingUser.id },
      data: { refreshToken },
    });

    // ✅ Send response and end request
    res.json({
      user: {
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
      accessToken,
      refreshToken,
    });

    return; // important, do not return the object
  }
}
