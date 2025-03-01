import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "../entities/project.entity";
import { Repository } from "typeorm";
import { ProjectPermission } from "../entities/project-permission.entity";
import { WorkspaceRoleGuard } from "src/auth/guards/workspace-role.guard";
import { WorkspaceMember } from "src/workspaces/entities/workspace-member.entity";
import { Reflector } from "@nestjs/core";


@Injectable()
export class ProjectPermissionGuard extends WorkspaceRoleGuard {
  constructor(
    reflector: Reflector,
    @InjectRepository(WorkspaceMember)
    workspaceMemberRepository: Repository<WorkspaceMember>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectPermission)
    private readonly projectPermissionRepository: Repository<ProjectPermission>
  ) {
    super(reflector, workspaceMemberRepository);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req.user?.userId;
    const projectId = req.params.projectId;
    const workspaceId = req.params.workspaceId;

    if (!userId) throw new BadRequestException("Project Permission Guard: Undefined user request");
    if (!projectId) throw new BadRequestException("Project Permission Guard: Project ID is required");
    if (!workspaceId) throw new BadRequestException("Project Permission Guard: Workspace ID is required");

    const workspaceMember = await this.workspaceMemberRepository.findOne({
      where: { user: { userId }, workspace: { workspaceId } }
    });
    if (req.user.role === "admin") {
      return true;
    }
    if (!workspaceMember) {
      throw new ForbiddenException("Project Permission Guard: You are not a member of this workspace.");
    }
  
    if (workspaceMember.role === "owner") {
      return true;
    }

    const project = await this.projectRepository.findOne({
      where: { projectId },
      relations: ["project_permissions"]
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    if (!project.permission_only) {
      return true;
    }
    const hasPermission = await this.projectPermissionRepository.findOne({
      where: { project: { projectId }, user: { userId } }
    });

    if (!hasPermission) {
      throw new ForbiddenException("Project Permission Guard: You do not have permission to access this project.");
    }

    return true;
  }
}