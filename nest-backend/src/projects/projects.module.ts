import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Workspace } from 'src/workspaces/entities/workspace.entity';
import { AIModel } from 'src/ai/entities/ai-model.entity';
import { AIModelService } from 'src/ai/ai-model.service';
import { ProjectHistory } from './entities/project-history.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Workspace, AIModel,ProjectHistory,User])],
  controllers: [ProjectsController],
  providers: [ProjectsService,AIModelService],
})
export class ProjectsModule {}
