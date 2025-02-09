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

    private readonly aiModelService: AIModelService, 
) {}
async validateWorkspace(workspaceId: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { workspaceId: workspaceId },
    });

    
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }
    return workspace;
  }


  async create(workspaceId:string ,createProjectDto: CreateProjectDto, file?: Express.Multer.File):Promise<Project> {    await this.validateWorkspace(workspaceId)
    // const aiModel = await this.aiModelService.findOne({ where: { id: createProjectDto.ai_id } });
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
      imagePath: filePath, // เพิ่มไฟล์พาธลงในโปรเจค
    });
    return this.projectRepository.save(project);
  }


  async   update(workspaceId: string, projectId: string, updateProjectDto: UpdateProjectDto , file?: Express.Multer.File): Promise<Project> {

    let filePath: string | undefined;
    if (file) {
      // บันทึกไฟล์ในตำแหน่งที่ต้องการ
      filePath = `/uploads/project/${file.filename}`;
    }
    await this.projectRepository.update(projectId, {
      ...updateProjectDto,
      imagePath: filePath, // เพิ่มไฟล์พาธลงในโปรเจค
    });
    const updatedProject = await this.projectRepository.findOne({ where: { projectId } });
    if (!updatedProject) {
      throw new NotFoundException('Project not found after update');
    }
    return updatedProject;
  }



  async findAll(@Param('workspaceId') workspaceId: string) {
    await this.validateWorkspace(workspaceId);
    const projects = await this.projectRepository.find({
      where:{workspace: {workspaceId}},
      relations: ['ai_model'], 
    });
     

   return projects.map((project) => ({
    ...project,  // ใช้ project ไม่ใช่ projects
    imagePath: project.imagePath
      ? `${process.env.NEST_APP_API_URL}${project.imagePath}`  // หรือ URL ที่เหมาะสมกับโปรเจค
      : null,
  }));

  }

  async findOne(workspaceId:string,projectId: string):Promise<Project> {
    await this.validateWorkspace(workspaceId);
    const project = await this.projectRepository.findOne({
      where: { projectId: projectId, workspace: { workspaceId } },
      relations: ['ai_model'],
    });
    

    if (!project) throw new NotFoundException('Project not found');
      // เพิ่มการตรวจสอบและสร้าง imagePath URL
  return {
    ...project,  // รวมข้อมูล project ทั้งหมด
    imagePath: project.imagePath
      ? `${process.env.NEST_APP_API_URL}${project.imagePath}`  // หรือ URL ที่เหมาะสมกับโปรเจค
      : null,
  };
  }

 

  // Delete a project from a specific workspace
  async remove(workspaceId: string, projectId: string): Promise<void> {
    await this.validateWorkspace(workspaceId); // ตรวจสอบว่า workspace มีอยู่

    const project = await this.findOne(workspaceId, projectId); // ตรวจสอบว่าโปรเจคมีอยู่
    await this.projectRepository.remove(project);
  }


  
  async predictInProject(userId: string,projectId: string, file: Express.Multer.File): Promise<ProjectHistory> {
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

      // ผลลัพธ์ของการทำนาย
      const predictionResult = {
        response_keys: model.response_keys,
        prediction: response.data,
      };

      let filePath: string ;
      if (file) {
        // บันทึกไฟล์ในตำแหน่งที่ต้องการ
        filePath = `/uploads/project/history/${file.filename}`;
      }
      // บันทึกประวัติลงในฐานข้อมูล
      const history = this.projectHistoryRepository.create({
        project: project,
        ai_model: model,
        filePath:filePath,
        response_keys: predictionResult.response_keys,
        prediction: predictionResult.prediction, // เก็บผลลัพธ์การทำนาย
        user:userProfile
      });
      await this.projectHistoryRepository.save(history);

      // ส่งผลลัพธ์ของการทำนายและประวัติที่บันทึกกลับไป
      return  history ;

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Error during prediction:', errorMessage,file);
      throw new InternalServerErrorException(`Prediction failed: ${errorMessage}`);
    }
  }


  async getAllHistory(projectId: string): Promise<ProjectHistory[]> {
    const allHistory = await this.projectHistoryRepository.find({
      where: { project: { projectId } },
      relations: ['ai_model', 'user'],
      order: { createdAt: 'DESC' },
    });

    return allHistory.map((history) => ({
      ...history,
      filePath: history.filePath
        ? `${process.env.NEST_APP_API_URL}${history.filePath}`
        : null,
    }));
  }

  async getHistory(historyId:string):Promise<ProjectHistory> {
    const history = await this.projectHistoryRepository.findOne({
      where: { historyId: historyId },
      relations: ['ai_model'],
    });

    if (!history) {
      throw new NotFoundException('History not found');
    }

    return {
      ...history,
      filePath: history.filePath
        ? `${process.env.NEST_APP_API_URL}${history.filePath}`
        : null,
        
    };
  }
}