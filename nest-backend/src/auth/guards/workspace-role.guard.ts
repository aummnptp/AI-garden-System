import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { WorkspaceMember } from "src/workspaces/entities/workspace-member.entity";
import { DataSource } from "typeorm";

@Injectable()
export class WorkspaceRoleGuard implements CanActivate{
    constructor(private reflector: Reflector, private dataSource: DataSource) {}

    async canActivate(context:ExecutionContext):Promise<boolean>{
        const requiredRole = this.reflector.get<string>('workspaceRole',context.getHandler())
        if (!requiredRole) {
            return true; // หากไม่มีการกำหนด workspaceRole
          }

          const request = context.switchToHttp().getRequest();
          const{user } =request;
          const workspaceId = request.params.workspaceId;

          if(!user ||!workspaceId){
            throw new ForbiddenException("Invalid user or workspace")
          }

          const member = await this.dataSource.getRepository(WorkspaceMember).findOne({
            where: { user: { userId: user.userId }, workspace: { workspaceId: workspaceId } }, })

            if (!member) {
                throw new ForbiddenException('You are not a member of this workspace');
              }
          
              // ตรวจสอบบทบาท
              if (member.role !== requiredRole) {
                throw new ForbiddenException(`Required workspace role: ${requiredRole}`);
              }
              return true;          
    }
}