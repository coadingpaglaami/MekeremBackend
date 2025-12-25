import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sentOtpMail(to: string, otp: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; padding:20px;">
        <h2>Password Reset OTP</h2>
        <p>Hello,</p>
        <p>Your OTP for resetting your password is:</p>
        <h1 style="color:#2d89ef;">${otp}</h1>
        <p>This code will expire in <b>5 minutes</b>. If you didn’t request this, ignore this email.</p>
        <hr />
        <p style="font-size:12px; color:#666;">Secure Auth System © 2025</p>
      </div>
    `;
    await this.transporter.sendMail({
      from: `LuggegLinker <${process.env.MAIL_USER}>`,
      to,
      subject: 'Password Reset OTP',
      html,
    });
  }
}
