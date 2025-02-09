
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkspaceMember } from './workspace-member.entity'
import { WorkspaceInvitation } from './workspace-invitation.entity';
import { Project } from 'src/projects/entities/project.entity';
@Entity()
export class Workspace {

   @PrimaryGeneratedColumn(`uuid`, { name: 'workspace_id' })
   workspaceId: string;

   @Column()
   name: string;

   @Column()
   description: string;

   @Column({ name: 'created_by' })
   createdById: string;

   @OneToMany(() => WorkspaceMember, (member) => member.workspace, { cascade: true })
   members: WorkspaceMember[]; // เชื่อมกับ WorkspaceMember

   @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
   createdAt: Date;

   @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
   updatedAt: Date;

   @OneToMany(() => WorkspaceInvitation, (invitation) => invitation.workspace,)
   invitations: WorkspaceInvitation[];

   @OneToMany(() => Project, (project) => project.workspace,)
   projects: Project[];

}
