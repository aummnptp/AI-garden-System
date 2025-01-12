import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
// import { Roles } from 'src/auth/guards/roles-decoraters';
import { Role } from 'src/auth/guards/Roles';

@Controller('workspaces/:workspaceId/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtGuard) 
  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Param('workspaceId') workspaceId: number,
    @Body() createProjectDto: CreateProjectDto):Promise<Project> {
      return this.projectsService.create(workspaceId, createProjectDto);
  }

  
  @UseGuards(JwtGuard) 
  @Get()
  findAll(
    @Param('workspaceId') workspaceId: number):Promise<Project[]> {
    return this.projectsService.findAll(workspaceId);
  }

  @UseGuards(JwtGuard) 
  @Get('detail/:projectId')
  findOne(
    @Param('workspaceId') workspaceId: number,
    @Param('projectId') projectId: number):Promise<Project> {
    return this.projectsService.findOne(workspaceId,projectId);
  }
// เพิ่มhandle รูป
  @UseGuards(JwtGuard)
  @Patch('update/:projectId')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('workspaceId') workspaceId: number,
    @Param('projectId') projectId: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectsService.update(workspaceId, projectId, updateProjectDto);
  }

  @UseGuards(JwtGuard) 
  @Delete('delete/:projectId')
  remove(
    @Param('workspaceId') workspaceId: number,
    @Param('projectId') projectId: number,
  ): Promise<void> {
    return this.projectsService.remove(workspaceId, projectId);
  }

   
   @UseGuards(JwtGuard) 
   @Post(':projectId/prediction')
   @UseInterceptors(FileInterceptor('file'))
   async predict(@Param('projectId') projectId: number,@UploadedFile() file: Express.Multer.File,): Promise<any> {
     //  return this.projectsService.predictInProject(+id, file);
  }

}
