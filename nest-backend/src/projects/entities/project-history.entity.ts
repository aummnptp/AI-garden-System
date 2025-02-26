import { AIModel } from "src/ai/entities/ai-model.entity";
import { Workspace } from "src/workspaces/entities/workspace.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project.entity";
import { User } from "src/user/entities/user.entity";
import { Note } from "src/note_history/entites/note.entity";

@Entity()
export class ProjectHistory {
@PrimaryGeneratedColumn('uuid',{name:"history_id"})
historyId: string;

// ภาพไม่ก็วิดีโอ
@Column({nullable: true })
filePath: string;

@Column('jsonb',
  //  { select: false }
  )
prediction:{}[];

@Column('jsonb',{name:"response_keys"}) // ใช้ jsonb สำหรับเก็บ Array ใน PostgreSQL
response_keys: { key: string; meaning: string ,displayFormat:string}[]; // รูปแบบ Array ของ JSON object


// ยังไม่ได้จัด
  @ManyToOne(() => Project, (project) => project.project_historys, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project; // ความสัมพันธ์กับ Workspace

  @ManyToOne(() => AIModel,{ onDelete: 'CASCADE' })
  ai_model: AIModel;


  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user:  User; // ความสัมพันธ์กับ User

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'create_at' })
  createdAt: Date;

  @OneToMany(() => Note, (note) => note.history)
  image_notes: Note[];
}



