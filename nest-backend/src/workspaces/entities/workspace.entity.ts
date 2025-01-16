
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkspaceMember} from './workspace-member.entity'
import { WorkspaceInvitation } from './workspace-invitation.entity';
import { Project } from 'src/projects/entities/project.entity';
   @Entity()
   export class Workspace {
      
      @PrimaryGeneratedColumn({ name: 'workspace_id' })
      workspaceId: number;
   
      @Column()
      name: string;
   
      @Column()
      description: string;
   
      @Column()
      createById: number;

      @OneToMany(() => WorkspaceMember, (member) => member.workspace, { cascade: true })
      members: WorkspaceMember[]; // เชื่อมกับ WorkspaceMember
   
      // @Column("int", { array: true, nullable: true })
      // projects: number[]; // IDs of projects in the workspace, can be null
   
      @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
      createdAt: Date;
   
      @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
      updatedAt: Date;

      @OneToMany(() => WorkspaceInvitation,(invitation) => invitation.workspace,)
       invitations: WorkspaceInvitation[];

       @OneToMany(() => Project,(project) => project.workspace,)
       projects: Project[];

   }
