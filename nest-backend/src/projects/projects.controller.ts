import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('workspaces/:workspaceId/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Param('workspaceId') workspaceId: number,
    @Body() createProjectDto: CreateProjectDto):Promise<Project> {
      return this.projectsService.create(workspaceId, createProjectDto);
  }

  @Get()
  findAll(
    @Param('workspaceId') workspaceId: number):Promise<Project[]> {
    return this.projectsService.findAll(workspaceId);
  }

  @Get('detail/:projectId')
  findOne(
    @Param('workspaceId') workspaceId: number,
    @Param('projectId') projectId: number):Promise<Project> {
    return this.projectsService.findOne(workspaceId,projectId);
  }
// เพิ่มhandle รูป
  @Patch('update/:projectId')
  @UseInterceptors(FileInterceptor('file'))
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
