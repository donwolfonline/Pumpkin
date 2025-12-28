import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET')!,
    });
  }

  async validate(payload: { sub: string; organizationId: string }) {
    const { sub: userId, organizationId } = payload;
    const result = await this.authService.validateUser(userId, organizationId);

    if (!result) {
      throw new UnauthorizedException();
    }

    return {
      userId: result.user.id,
      organizationId: result.member.organizationId,
      role: result.member.role,
      user: result.user,
      member: result.member,
    };
  }
}
