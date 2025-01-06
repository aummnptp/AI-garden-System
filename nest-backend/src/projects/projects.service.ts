import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Workspace } from 'src/workspaces/entities/workspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { AIModel } from 'src/ai/entities/ai-model.entity';

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

    const project = this.projectRepository.create({ ...createProjectDto, workspace: { workspaceId },
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
      where: { project_id: projectId, workspace: { workspaceId } },
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
}