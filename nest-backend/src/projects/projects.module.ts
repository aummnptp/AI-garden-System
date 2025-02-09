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
import { ProjectPermission } from './entities/project-permission.entity';
import { WorkspacesModule } from 'src/workspaces/workspaces.module';
import { ProjectPermissionGuard } from 'src/projects/guards/project-permission.guard';
import { WorkspaceMember } from 'src/workspaces/entities/workspace-member.entity';
import { ProjectPermissionController } from './project-permission.controller';
import { ProjectPermissionService } from './project-permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Workspace, AIModel,ProjectHistory, WorkspaceMember, User,ProjectPermission])
,WorkspacesModule],
  controllers: [ProjectsController,ProjectPermissionController],
  providers: [ProjectsService,AIModelService,ProjectPermissionService,ProjectPermissionGuard],
})
export class ProjectsModule {}
