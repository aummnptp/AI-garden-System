import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Workspace } from './workspace.entity'; 
import { User } from '../../user/entities/user.entity';

@Entity()
export class WorkspaceMember {
  @PrimaryGeneratedColumn('uuid',{ name: 'member_id' })
  memberId: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace; 

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User; 
  
  @Column({ default: 'member' })
  role: string; 

}


