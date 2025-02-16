import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ProjectPermissionGuard } from './guards/project-permission.guard';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProjectPermissionService } from './project-permission.service';
import { WorkspaceRole } from 'src/auth/decorator/workspaceRole-decorater';
import { WorkspaceRoleGuard } from 'src/auth/guards/workspace-role.guard';

@Controller('workspaces/:workspaceId/projects')
export class ProjectPermissionController {
  constructor(private readonly projectPermissionService: ProjectPermissionService) {}

  @WorkspaceRole("owner")
  @UseGuards(JwtGuard,WorkspaceRoleGuard)
  @Post("/permissions/grant/:projectId")
  async grantPermission(@Param("projectId") projectId: string, @Body("userId") userId: string) {
    return this.projectPermissionService.grantPermission(projectId, userId);
  }

  @WorkspaceRole("owner")
  @UseGuards(JwtGuard, WorkspaceRoleGuard)
  @Patch("/permissions/update/:projectId")
  async updatePermission(
    @Param("projectId") projectId: string,
    @Body("userId") userId: string,

  ) {
    return this.projectPermissionService.updatePermission(projectId, userId, );
  }

  @WorkspaceRole("owner")
  @UseGuards(JwtGuard, WorkspaceRoleGuard)
  @Delete("/permissions/revoke/:projectId")
  async revokePermission(@Param("projectId") projectId: string, @Body("userId") userId: string) {
    return this.projectPermissionService.revokePermission(projectId, userId);
  }

  @WorkspaceRole("owner")
  @UseGuards(JwtGuard, WorkspaceRoleGuard)
  @Get("/permissions/:projectId")
  async getProjectPermissions(@Param("projectId") projectId: string,@Req()req) {

      return this.projectPermissionService.getProjectPermissions(projectId);
  }
}
