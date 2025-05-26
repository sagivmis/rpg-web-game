import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole =
      this.reflector.get<string>('role', context.getHandler()) ??
      this.reflector.get<string>('role', context.getClass());

    if (!requiredRole) return true;

    const req = context.switchToHttp().getRequest();

    console.log('[RolesGuard]', req.user); // ✅ now this will show actual values
    return req.user?.role === requiredRole;
  }
}
