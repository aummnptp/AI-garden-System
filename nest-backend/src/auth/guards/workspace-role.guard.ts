import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { ProjectPermission } from "src/projects/entities/project-permission.entity";
import { Project } from "src/projects/entities/project.entity";
import { WorkspaceMember } from "src/workspaces/entities/workspace-member.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class WorkspaceRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(WorkspaceMember)
    protected readonly workspaceMemberRepository: Repository<WorkspaceMember>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.get<string>("workspaceRole", context.getHandler());
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const workspaceId = request.params.workspaceId;

    if (!user || !workspaceId) {
      throw new ForbiddenException("Workspace Role Guard: Invalid user or workspace");
    }

    const member = await this.workspaceMemberRepository.findOne({
      where: { user: { userId: user.userId }, workspace: { workspaceId } }
    });

    if (!member) {
      throw new ForbiddenException("Role Guard: You are not a member of this workspace");
    }

    if (!requiredRole) {
      return true;
    }

    if (member.role === "owner" || member.user.role === "admin") {
      return true;
    }

    if (member.role !== requiredRole) {
      throw new ForbiddenException(`Role Guard: Required workspace role: ${requiredRole}`);
    }

    return true;
  }
}