import { AIModel } from "src/ai/entities/ai-model.entity";
import { Workspace } from "src/workspaces/entities/workspace.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProjectHistory } from "./project-history.entity";
import { ProjectPermission } from "./project-permission.entity";

@Entity()
export class Project {
@PrimaryGeneratedColumn('uuid',{name:"project_id"})
projectId: string;

@Column()
name: string;

@Column()
description: string;

@Column()
input_type: string;

@Column({nullable: true, name:"image_path"})
imagePath: string;

@Column({type: 'timestamp', default: ()  => 'CURRENT_TIMESTAMP'})
created_at: Date;

@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
updated_at: Date;

@Column({default: false})
permission_only: boolean;


  @ManyToOne(() => Workspace, (workspace) => workspace.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace; // ความสัมพันธ์กับ Workspace

 @ManyToOne(()=> AIModel, (ai_model) => ai_model.projects, {onDelete: 'CASCADE'})
@JoinColumn({ name: 'ai_id' })
  ai_model: AIModel;

  

  @OneToMany(() => ProjectHistory,(project_history) => project_history.project,)
  project_historys: ProjectHistory[];

  @OneToMany (()=>ProjectPermission,(projectPermission)=>projectPermission.project)
  project_permissions: ProjectPermission[];

}
