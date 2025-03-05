import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>('role', context.getHandler()); // role เป็น string เดียว
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    
    if (!user?.role) {
      return false; 
    }
    
    if (!requiredRole) {
      return true; 
    }

    if (user.role === 'admin') {
      return true;
    }

    return user.role === requiredRole; 
  }
}
