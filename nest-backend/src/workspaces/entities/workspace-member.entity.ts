import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Workspace } from './workspace.entity'; // Import Workspace
import { User } from '../../user/entities/user.entity'; // Import User

@Entity()
export class WorkspaceMember {
  @PrimaryGeneratedColumn('uuid',{ name: 'member_id' })
  memberId: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace; // ความสัมพันธ์กับ Workspace

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User; // ความสัมพันธ์กับ User entity
  
  @Column({ default: 'member' })
  role: string; // บทบาท เช่น 'owner', 'member'

  // @CreateDateColumn()
  // createdAt: Date; // วันที่เข้าร่วม

  // @UpdateDateColumn()
  // updatedAt: Date;
}


