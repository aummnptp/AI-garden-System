import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { WorkspaceInvitation } from './entities/workspace-invitation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace,User,WorkspaceMember,WorkspaceInvitation]),    ],
  controllers: [WorkspacesController],
  providers: [WorkspacesService,UserService],
  exports: [TypeOrmModule.forFeature([WorkspaceMember])] 
})
export class WorkspacesModule {}
