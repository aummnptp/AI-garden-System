
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkspaceMember} from './workspace-member.entity'
import { WorkspaceInvitations } from './workspace-invitation.entity';
   @Entity()
   export class Workspace {
      
      @PrimaryGeneratedColumn()
      id: number;
   
      @Column()
      name: string;
   
      @Column()
      description: string;
   
      @Column()
      createByEmail: string;

      @OneToMany(() => WorkspaceMember, (member) => member.workspace, { cascade: true })
      members: WorkspaceMember[]; // เชื่อมกับ WorkspaceMember
   
      @Column("int", { array: true, nullable: true })
      projects: number[]; // IDs of projects in the workspace, can be null
   
      @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
      createdAt: Date;
   
      @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
      updatedAt: Date;

      @OneToMany(
         () => WorkspaceInvitations,
         (invitation) => invitation.workspace,
       )
       invitations: WorkspaceInvitations[];
      // @OneToMany(() => Workspace, (workspace) => workspace.createByUserId) 
      // workspaces: Workspace[]; // ฟิลด์นี้เก็บข้อมูล Workspace หลายอันที่ผู้ใช้คนนี้สร้าง

   }
