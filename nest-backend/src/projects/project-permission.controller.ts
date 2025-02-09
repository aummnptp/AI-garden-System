import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ProjectPermissionGuard } from './guards/project-permission.guard';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProjectPermissionService } from './project-permission.service';

@Controller('workspaces/:workspaceId/projects')
export class ProjectPermissionController {
  constructor(private readonly projectPermissionService: ProjectPermissionService) {}

  @UseGuards(JwtGuard)
  @Post("/permissions/grant/:projectId")
  async grantPermission(@Param("projectId") projectId: string, @Body("userId") userId: string) {
    return this.projectPermissionService.grantPermission(projectId, userId);
  }

  @UseGuards(JwtGuard, ProjectPermissionGuard)
  @Patch("/permissions/update/:projectId")
  async updatePermission(
    @Param("projectId") projectId: string,
    @Body("userId") userId: string,
    @Body("role") role: string
  ) {
    return this.projectPermissionService.updatePermission(projectId, userId, role);
  }


  @UseGuards(JwtGuard, ProjectPermissionGuard)
  @Delete("/permissions/revoke/:projectId")
  async revokePermission(@Param("projectId") projectId: string, @Body("userId") userId: string) {
    return this.projectPermissionService.revokePermission(projectId, userId);
  }

  @UseGuards(JwtGuard, ProjectPermissionGuard)
  @Get("/permissions/:projectId")
  async getProjectPermissions(@Param("projectId") projectId: string,@Req()req) {

      return this.projectPermissionService.getProjectPermissions(projectId);
  }
}
