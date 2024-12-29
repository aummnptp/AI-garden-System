import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
  } from 'typeorm';
  import { Workspace } from './workspace.entity';
  import { User } from '../../user/entities/user.entity';
  
  @Entity()
  export class WorkspaceInvitations {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Workspace, (workspace) => workspace.invitations, {
      onDelete: 'CASCADE',
    })
    workspace: Workspace;
  
    @ManyToOne(() => User, { eager: true })
    user: User;
  
    @ManyToOne(() => User, { eager: true })
    invitedBy: User;
  
    @Column({ default: 'pending' })
    status: string; // pending | accepted | rejected
  
    @CreateDateColumn()
    createdAt: Date;
  }
  