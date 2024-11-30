import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIModel } from './entities/ai-model.entity';
import { AIModelService } from './ai-model.service';
import { AIModelController } from './ai-model.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AIModel])],
  controllers: [AIModelController],
  providers: [AIModelService],
})
export class AIModelModule {}
