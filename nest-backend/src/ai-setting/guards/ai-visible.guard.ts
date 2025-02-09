import { Injectable, CanActivate, ExecutionContext, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIModel } from '../../ai/entities/ai-model.entity';

@Injectable()
export class AIVisibleGuard implements CanActivate {
  constructor(
    @InjectRepository(AIModel)
    private readonly aiModelRepository: Repository<AIModel>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const aiId = req.params.aiId;
    if (!aiId) throw new BadRequestException("AI ID is required.");

    // ดึงข้อมูล AI
    const aiModel = await this.aiModelRepository.findOne({ where: { aiId } });
    if (!aiModel) throw new NotFoundException("AI Model not found");

    // ถ้า visible = false ห้ามใช้ใน Demo
    if (!aiModel.visible) {
      throw new BadRequestException("This AI is not available for demo.");
    }

    return true;
  }
}