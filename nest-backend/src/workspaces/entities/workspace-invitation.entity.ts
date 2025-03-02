import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
    JoinColumn,
  } from 'typeorm';
  import { Workspace } from './workspace.entity';
  import { User } from '../../user/entities/user.entity';
  
  @Entity()
  export class WorkspaceInvitation {
    @PrimaryGeneratedColumn(`uuid`,{ name: 'invite_id' })
    inviteId: string;

    @ManyToOne(() => Workspace, (workspace) => workspace.invitations, {
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'workspace_id' })
    workspace: Workspace;
  
    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'invite_by' })
    invitedBy: User;
  
    @Column({ default: 'pending' })
    status: string; 
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  }
  