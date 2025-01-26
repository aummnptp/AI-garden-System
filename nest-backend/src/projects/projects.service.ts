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

@Injectable()
export class ProjectsService {
constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,

    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,


    @InjectRepository(Workspace)
    private aiModelRepository: Repository<AIModel>,
) {}
  async validateWorkspace(workspaceId: number): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { workspaceId: workspaceId },
    });

    
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }
    return workspace;
  }


  async create(workspaceId:number ,createProjectDto: CreateProjectDto) {
    await this.validateWorkspace(workspaceId)

    const aiModel = await this.projectRepository.manager.findOne(AIModel, {
      where: { id: createProjectDto.ai_id },
    });

    if (!aiModel) {
      throw new NotFoundException('AI Model not found');
    }

    const project = this.projectRepository.create({ ...createProjectDto, 
      workspace: { workspaceId },
      ai_model: aiModel,  
    });
    return this.projectRepository.save(project);
  }

  async findAll(@Param('workspaceId') workspaceId: number) {
    await this.validateWorkspace(workspaceId);
    return this.projectRepository.find({
      where:{workspace: {workspaceId}},
      relations: ['ai_model'], 
    });
  }

  async findOne(workspaceId:number,projectId: number):Promise<Project> {
    await this.validateWorkspace(workspaceId);
    const project = await this.projectRepository.findOne({
      where: { projectId: projectId, workspace: { workspaceId } },
      relations: ['ai_model'],
    });

    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(workspaceId: number, projectId: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    await this.validateWorkspace(workspaceId); // ตรวจสอบว่า workspace มีอยู่

    const project = await this.findOne(workspaceId, projectId); // ตรวจสอบว่าโปรเจคมีอยู่
    await this.projectRepository.update(projectId, updateProjectDto);
    return this.findOne(workspaceId, projectId);
  }

  // Delete a project from a specific workspace
  async remove(workspaceId: number, projectId: number): Promise<void> {
    await this.validateWorkspace(workspaceId); // ตรวจสอบว่า workspace มีอยู่

    const project = await this.findOne(workspaceId, projectId); // ตรวจสอบว่าโปรเจคมีอยู่
    await this.projectRepository.remove(project);
  }


  async predictInProject (projectId: number, file: Express.Multer.File): Promise<any>{

    const project = await this.projectRepository.findOne({ where: { projectId: projectId } });
    if (!project) {
      throw new NotFoundException('project not found!');
    }
  
     const model = await this.aiModelRepository.findOne({ where: { id: project.projectId } });
        if (!model) {
          throw new NotFoundException('Model not found!');
        }
      
        const formData = new FormData();
        formData.append('file', file.buffer, file.originalname);
      
        try {
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

          // const historyDto: CreateProjectHistoryDto = {
          //   projectId,
          //   modelId,
          //   filePath: file.path || null, // Save file path if available
          //   result: JSON.stringify(predictionResult.prediction), // Save result as JSON string
          //   aiType: model.ai_type,
          // };
          //     await this.projectHistoryService.createHistory(historyDto);
          return predictionResult;
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message;
          console.error('Error during prediction:', errorMessage);
          throw new InternalServerErrorException(`Prediction failed: ${errorMessage}`);
        }
  }
}