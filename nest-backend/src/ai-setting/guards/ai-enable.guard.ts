import { Injectable, CanActivate, ExecutionContext, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIModel } from '../../ai/entities/ai-model.entity';
import { Project } from 'src/projects/entities/project.entity';

@Injectable()
export class AIEnableGuard implements CanActivate {
  constructor(
    @InjectRepository(AIModel)
    private readonly aiModelRepository: Repository<AIModel>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const projectId = req.params.projectId; 
    const aiId = req.params.aiId; // 🔹 เช็คว่า AI ID มีค่าหรือไม่

    let aiModel: AIModel | null = null;

    if (projectId) {
      // 🔹 ถ้ามี Project ID → ค้นหา AI จาก Project
      const project = await this.projectRepository.findOne({
        where: { projectId: projectId }, // 🔹 ใช้ `id` เพราะ `projectId` ใน Entity อาจเป็น `id`
        relations: ['ai_model'],
      });

      if (!project || !project.ai_model) {
        throw new NotFoundException("Project or associated AI Model not found");
      }

      aiModel = project.ai_model;
    } else if (aiId) {
      // 🔹 ถ้ามี AI ID → ค้นหา AI โดยตรง
      aiModel = await this.aiModelRepository.findOne({ where: { aiId } });

      if (!aiModel) {
        throw new NotFoundException("AI Model not found");
      }
    } else {
      // ❌ ถ้าไม่มี `projectId` หรือ `aiId` ส่ง Error
      throw new BadRequestException("Either Project ID or AI ID is required.");
    }

    // 🔴 ถ้า AI ปิดการใช้งาน `enable: false` → ห้ามใช้ AI
    if (!aiModel.enable) {
      throw new BadRequestException("This AI is currently disabled and cannot be used.");
    }

    return true;
  }
}