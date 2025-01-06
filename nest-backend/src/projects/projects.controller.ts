import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Controller('workspaces/:workspaceId/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('create')
  create(
    @Param('workspaceId') workspaceId: number,
    @Body() createProjectDto: CreateProjectDto):Promise<Project> {
      return this.projectsService.create(workspaceId, createProjectDto);
  }

  @Get()
  findAll(
    @Param('workspaceId') workspaceId: number):Promise<Project[]> {
    return this.projectsService.findAll(workspaceId);
  }

  @Get('/:projectId')
  findOne(
    @Param('workspaceId') workspaceId: number,
    @Param('projectId') projectId: number):Promise<Project> {
    return this.projectsService.findOne(workspaceId,projectId);
  }

  @Patch(':projectId')
  async update(
    @Param('workspaceId') workspaceId: number,
    @Param('projectId') projectId: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectsService.update(workspaceId, projectId, updateProjectDto);
  }

  @Delete('delete/:projectId')
  remove(
    @Param('workspaceId') workspaceId: number,
    @Param('projectId') projectId: number,
  ): Promise<void> {
    return this.projectsService.remove(workspaceId, projectId);
  }

  // 
  // 
  // 
}
