import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Role } from '../database/prisma-client/enums.js';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy,'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET',
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL || 'YOUR_GOOGLE_CALLBACK_URL',
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }
  async validate(
    req: Request,
    access_token: string,
    refresh_token: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    let roleIntent : Role | null = null;
    if (req.query.state) {
      try {
        const parsed = JSON.parse(req.query.state as string);
        roleIntent = parsed.role as Role;
        console.log('Role Intent in Strategy:', roleIntent);
      } catch (error) {}
    }

    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      access_token,
      refresh_token,
      roleIntent
    };
    done(null, user);
  }
}
