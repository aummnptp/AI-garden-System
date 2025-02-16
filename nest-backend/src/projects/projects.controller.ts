import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, BadRequestException, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import * as multer from 'multer';
import { CreateProjectHistoryDto } from './dto/predict-project.dto';
import { ProjectHistory } from './entities/project-history.entity';
// import { Roles } from 'src/auth/guards/roles-decoraters';
import { RankingData } from './interfaces/ranking-data.interface';

@Controller('workspaces/:workspaceId/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }
  @UseGuards(JwtGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.diskStorage({
      destination: './uploads/project', // กำหนดโฟลเดอร์เก็บไฟล์
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      },
    }),
  }))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Param('workspaceId') workspaceId: string,
    @Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.create(workspaceId, createProjectDto, file);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(
    @Param('workspaceId') workspaceId: string): Promise<Project[]> {
    return this.projectsService.findAll(workspaceId);
  }

  @UseGuards(JwtGuard)
  @Get('detail/:projectId')
  findOne(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string): Promise<Project> {
    return this.projectsService.findOne(workspaceId, projectId);
  }

  @UseGuards(JwtGuard)
  @Patch('update/:projectId')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.diskStorage({
      destination: './uploads/project', // กำหนดโฟลเดอร์เก็บไฟล์
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      },
    }),
  }))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectsService.update(workspaceId, projectId, updateProjectDto, file);
  }

  @UseGuards(JwtGuard)
  @Delete('delete/:projectId')
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
  ): Promise<void> {
    return this.projectsService.remove(workspaceId, projectId);
  }

  @UseGuards(JwtGuard)
  @Post('predict/:projectId')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.diskStorage({
      destination: './uploads/project/history/',
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      },
    }),
  }))
  async predictInProject(
    @Request() req,
    @Param('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    // @Body() createProjectHistoryDto:CreateProjectHistoryDto
  ): Promise<ProjectHistory> {
    const userId = req.user.userId;
    return this.projectsService.predictInProject(userId, projectId, file);
  }

  @UseGuards(JwtGuard)
  @Get('all-history/:projectId')
  getAllHistory(
    @Param('projectId') projectId: string): Promise<ProjectHistory[]> {
    return this.projectsService.getAllHistory(projectId);
  }

  @UseGuards(JwtGuard)
  @Get('history/:historyId')
  getHistory(
    @Param('historyId') historyId: string,): Promise<ProjectHistory> {
    return this.projectsService.getHistory(historyId);
  }

  @Get(':projectId/ranking')
  async getUploadRanking(@Param('projectId') projectId: string): Promise<RankingData[]> {
    return this.projectsService.getUploadRanking(projectId);
  }

  @Get('/count-media/:projectId')
  async getMediaCount(@Param('projectId') projectId: string) {
    return await this.projectsService.countMedia(projectId);
  }

}
