import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "./Roles";
// import { ROLES_KEY } from "./roles-decoraters";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>('role', context.getHandler()); // role เป็น string เดียว
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    
    if (!user?.role) {
      return false; // หากไม่มี role ใน user
    }
    
    if (!requiredRole) {
      return true; // ไม่มีการกำหนด role ก็อนุญาต
    }
    // อนุญาตทุก path สำหรับ admin
    if (user.role === 'admin') {
      return true;
    }

    return user.role === requiredRole; // ตรวจสอบ role ตรงกันหรือไม่
  }
}
