import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Param } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Workspace } from 'src/workspaces/entities/workspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { AIModel } from 'src/ai/entities/ai-model.entity';
import axios from 'axios';
import * as FormData from 'form-data';
import { CreateProjectHistoryDto } from './dto/predict-project.dto';
import { AIModelService } from 'src/ai/ai-model.service';
import { ProjectHistory } from './entities/project-history.entity';
import * as fs from 'fs';
import { User } from 'src/user/entities/user.entity';
import { WorkspaceMember } from 'src/workspaces/entities/workspace-member.entity';
import { ProjectPermission } from './entities/project-permission.entity';
import { RankingData } from './interfaces/ranking-data.interface';


@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,

    @InjectRepository(ProjectHistory)
    private projectHistoryRepository: Repository<ProjectHistory>,

    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,

    @InjectRepository(AIModel)
    private aiModelRepository: Repository<AIModel>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: Repository<WorkspaceMember>,
    @InjectRepository(ProjectPermission)
    private projectPermissionRepository: Repository<ProjectPermission>,

    private readonly aiModelService: AIModelService,
  ) { }
  async validateWorkspace(workspaceId: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { workspaceId: workspaceId },
    });


    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }
    return workspace;
  }


  async create(workspaceId: string, createProjectDto: CreateProjectDto, file?: Express.Multer.File, userId?: string,): Promise<Project> {
    await this.validateWorkspace(workspaceId)
    // const aiModel = await this.aiModelService.findOne({ where: { id: createProjectDto.ai_id } });

    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const aiModel = await this.aiModelService.findOne(createProjectDto.ai_id);
    if (!aiModel) {
      throw new NotFoundException('AI Model not found');
    }
    let filePath: string | undefined;
    if (file) {
      // บันทึกไฟล์ในตำแหน่งที่ต้องการ
      filePath = `/uploads/project/${file.filename}`;
    }
    const project = this.projectRepository.create({
      ...createProjectDto,
      workspace: { workspaceId },
      ai_model: aiModel,
      imagePath: filePath,
      createdBy: user,
    });
    return this.projectRepository.save(project);
  }


  async update(workspaceId: string, projectId: string, updateProjectDto: UpdateProjectDto, file?: Express.Multer.File): Promise<Project> {

    let filePath: string | undefined;
    if (file) {
      // บันทึกไฟล์ในตำแหน่งที่ต้องการ
      filePath = `/uploads/project/${file.filename}`;
    }
    await this.projectRepository.update(projectId, {
      ...updateProjectDto,
      imagePath: filePath,
    });
    const updatedProject = await this.projectRepository.findOne({ where: { projectId } });
    if (!updatedProject) {
      throw new NotFoundException('Project not found after update');
    }
    return updatedProject;
  }



  async findAll(workspaceId: string, userId: string): Promise<Project[]> {
    await this.validateWorkspace(workspaceId);
    const workspaceMember = await this.workspaceMemberRepository.findOne({
      where: { user: { userId }, workspace: { workspaceId } },
    });
    const isOwnerOrAdmin = workspaceMember?.role === "owner" || workspaceMember?.role === "admin";
    const projects = await this.projectRepository.find({
      where: { workspace: { workspaceId } },
      relations: ['ai_model', 'project_permissions'],
    });
    const filteredProjects = await Promise.all(
      projects.map(async (project) => {
        if (isOwnerOrAdmin) return project;
        if (!project.permission_only) return project;
        const hasPermission = await this.projectPermissionRepository.findOne({
          where: { project: { projectId: project.projectId }, user: { userId } },
        });
        return hasPermission ? project : null;
      })
    );
    return filteredProjects.filter((p) => p !== null);
  }

  async findOne(workspaceId: string, projectId: string): Promise<Project> {
    await this.validateWorkspace(workspaceId);
    const project = await this.projectRepository.findOne({
      where: { projectId: projectId, workspace: { workspaceId } },
      relations: ['ai_model', 'createdBy'],
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;

  }

  async remove(workspaceId: string, projectId: string): Promise<void> {
    await this.validateWorkspace(workspaceId);

    const project = await this.findOne(workspaceId, projectId);
    await this.projectRepository.remove(project);
  }



  async predictInProject(userId: string, projectId: string, file: Express.Multer.File): Promise<ProjectHistory> {
    const userProfile = await this.userRepository.findOne({ where: { userId: userId } });
    if (!userProfile) {
      throw new NotFoundException('User not found');
    }
    const project = await this.projectRepository.findOne({
      where: { projectId },
      relations: ['ai_model'],
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    // ดึงข้อมูลโมเดลที่เกี่ยวข้องกับโปรเจกต์นี้
    const model = await this.aiModelRepository.findOne({
      where: { aiId: project.ai_model.aiId },
    });
    if (!model) {
      throw new NotFoundException('Model not found!');
    }
    // ตรวจสอบว่า file หรือ file.originalname เป็น undefined หรือไม่
    if (!file || !file.originalname) {
      throw new BadRequestException('File is required and must have a valid name');
    }

    // สร้าง FormData เพื่อส่งไฟล์ไปยัง API
    const formData = new FormData();
    formData.append('file', fs.createReadStream(file.path), file.originalname);
    try {
      // ส่งคำขอไปยัง API ของโมเดลเพื่อทำการทำนาย
      const response = await axios.post(model.api_uri, formData, {
        headers: { ...formData.getHeaders() },
      });

      if (!response.data) {
        throw new BadRequestException('No response from external API');
      }
      const predictionResult = {
        response_keys: model.response_keys,
        prediction: response.data,
      };
      let filePath: string;
      if (file) {
        filePath = `/uploads/project/history/${file.filename}`;
      }
      const history = this.projectHistoryRepository.create({
        project: project,
        ai_model: model,
        filePath: filePath,
        response_keys: predictionResult.response_keys,
        prediction: predictionResult.prediction,
        user: userProfile
      });
      await this.projectHistoryRepository.save(history);

      return history;

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new InternalServerErrorException(`Prediction failed: ${errorMessage}`);
    }
  }

  async getAllHistory(projectId: string, userId: string): Promise<ProjectHistory[]> {
    const project = await this.projectRepository.findOne({
      
      where: { projectId },
      relations: ['workspace'],
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    const workspaceId = project.workspace.workspaceId;
    const workspaceMember = await this.workspaceMemberRepository.findOne({
      where: { user: { userId }, workspace: { workspaceId } },
    });
    const isOwnerOrAdmin = workspaceMember?.role === 'owner' || workspaceMember?.role === 'admin';
    if (isOwnerOrAdmin) {
      return this.projectHistoryRepository.find({
        where: { project: { projectId } },
        relations: ['ai_model', 'user'],
        order: { createdAt: 'DESC' },
      });
    }
    return this.projectHistoryRepository.find({
      where: { project: { projectId }, user: { userId } },
      relations: ['ai_model', 'user'],
      order: { createdAt: 'DESC' },
    });
  }


  async getHistory(historyId: string): Promise<ProjectHistory> {
    const history = await this.projectHistoryRepository.findOne({
      where: { historyId: historyId },
      select: {
        prediction: true,
      },
      relations: ['ai_model'],
    });
    if (!history) {
      throw new NotFoundException('History not found');
    }
    return history;
  }

  async deleteHistory(workspaceId: string, projectId: string, historyId: string): Promise<{ message: string }> {
    const history = await this.projectHistoryRepository.findOne({
      where: { historyId, project: { projectId } },
      relations: ['project'],
    });
    if (!history) {
      throw new NotFoundException(`History ID: ${historyId} not found`);
    }
    if (history.filePath) {
      const filePath = `./uploads/project/history/${history.filePath.split('/').pop()}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    await this.projectHistoryRepository.remove(history);
    return { message: 'History deleted successfully' };
  }

  async getUploadStatistics(projectId: string) {
    const history = await this.projectHistoryRepository.find({
      where: { project: { projectId } },
      select: {
        prediction: true,
      },
      relations: ['user'],
    });

    const imageExtensions = ['.jpg', '.jpeg', '.png'];
    const videoExtensions = ['.mp4', '.mov', '.avi'];

    // ใช้ Set เพื่อนับ userId ที่ไม่ซ้ำ
    const uniqueUsers = new Set<string>();
    let imageCount = 0;
    let videoCount = 0;

    // จัดอันดับการอัปโหลด
    const ranking: Record<string, { userId: string; submitNumber: number; name: string; picture: string }> = {};

    history.forEach(item => {
      const user = item.user;
      if (user) {
        uniqueUsers.add(user.userId);

        if (!ranking[user.userId]) {
          ranking[user.userId] = {
            userId: user.userId,
            submitNumber: 0,
            name: user.name,
            picture: user.picture,
          };
        }
        ranking[user.userId].submitNumber += 1;
      }

      const filePath = item.filePath?.toLowerCase();
      if (filePath) {
        if (imageExtensions.some(ext => filePath.endsWith(ext))) {
          imageCount++;
        } else if (videoExtensions.some(ext => filePath.endsWith(ext))) {
          videoCount++;
        }
      }
    });

    return {
      userCount: uniqueUsers.size,
      imageCount,
      videoCount,
      ranking: Object.values(ranking).sort((a, b) => b.submitNumber - a.submitNumber),
    };
  }



  async getAllHistoryFromAllProject(): Promise<ProjectHistory[]> {
    try {
      // ดึงประวัติทั้งหมดจากทุกโปรเจค
      const allHistory = await this.projectHistoryRepository.find({
        relations: ['ai_model', 'user', 'project'], // ดึงข้อมูลที่เกี่ยวข้องทั้งหมด
        order: { createdAt: 'DESC' },
      });
      return allHistory
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch all project history');
    }
  }

}