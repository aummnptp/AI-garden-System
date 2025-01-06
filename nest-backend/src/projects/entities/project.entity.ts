import { AIModel } from "src/ai/entities/ai-model.entity";
import { Workspace } from "src/workspaces/entities/workspace.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Project {
@PrimaryGeneratedColumn()
project_id: number;

@Column()
project_name: string;

@Column()
project_desc: string;

@Column()
input_type: string;

@Column({nullable: true})
image_path: string;

@Column({type: 'timestamp', default: ()  => 'CURRENT_TIMESTAMP'})
create_at: Date;

@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
update_at: Date;

@Column({default: false})
permission_only: boolean;


  @ManyToOne(() => Workspace, (workspace) => workspace.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace; // ความสัมพันธ์กับ Workspace

 @ManyToOne(()=> AIModel, (ai_model) => ai_model.projects, {onDelete: 'CASCADE'})
@JoinColumn({ name: 'ai_id' })
  ai_model: AIModel;
}
