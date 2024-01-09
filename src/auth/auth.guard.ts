import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Permission } from '../role/enums/permission.enum';
import { User } from '../user/entities/user.entity';

export const IS_PUBLIC_KEY = 'public';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const PERMISSION_KEY = 'permission';
export const RequiredPermission = (permission: Permission) =>
  SetMetadata(PERMISSION_KEY, permission);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    let isValid = false;

    try {
      const token = this.extractToken(request);
      const user = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('jwt.secret'),
      });
      request['user'] = user;

      const permission = this.reflector.getAllAndOverride(PERMISSION_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      isValid = this.evaluatePermission(permission, user);
    } catch (error) {}

    return isValid;
  }

  evaluatePermission(permission: Permission, user: User) {
    if (!permission) return true;

    const allowedPermissions = [
      Permission.ManageAll,
      Math.round(permission / 100) * 100,
      permission,
    ];

    return allowedPermissions.some((item) =>
      user.role.permissions.includes(item),
    );
  }

  extractToken(request: Request) {
    const { authorization }: any = request.headers;
    const [type, token] = authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
