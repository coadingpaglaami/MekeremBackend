import { Role } from 'src/database/prisma-client/enums.js';
export class CreateAuthDto {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export class SignUpResponse {
  message: string;
  user: Omit<CreateAuthDto, 'password'>;
}
export class LoginDto {
  email: string;
  password: string;
}

export class LoginResponse {
  message: string;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

export class ForgetPassDto {
  email: string;
}
export class VerifyOtpDto {
  email: string;
  otp: string;
}
export class AuthResponse {
  message: string;
}

export class ResetPasswordDto {
  email: string;
  newPassword: string;
  confirmNewPassword: string;
  otp: string;
}

export class RefreshTokenDto {
  refreshToken: string;
}

export class RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

