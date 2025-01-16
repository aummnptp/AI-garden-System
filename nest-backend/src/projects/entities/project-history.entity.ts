import { AIModel } from "src/ai/entities/ai-model.entity";
import { Workspace } from "src/workspaces/entities/workspace.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project.entity";

@Entity()
export class ProjectHistory {
@PrimaryGeneratedColumn()
hisotry_id: number;

// ภาพไม่ก็วิดีโอ
@Column({ nullable: true })
filePath: string;

@Column('jsonb')
result:{}[];

@Column('jsonb') // ใช้ jsonb สำหรับเก็บ Array ใน PostgreSQL
response_keys: { key: string; meaning: string ,displayFormat:string}[]; // รูปแบบ Array ของ JSON object


// ยังไม่ได้จัด
  @ManyToOne(() => Project, (project) => project.project_historys, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project; // ความสัมพันธ์กับ Workspace


}
