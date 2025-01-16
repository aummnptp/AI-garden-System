import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Workspace } from 'src/workspaces/entities/workspace.entity';
import { AIModel } from 'src/ai/entities/ai-model.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Workspace, AIModel])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
