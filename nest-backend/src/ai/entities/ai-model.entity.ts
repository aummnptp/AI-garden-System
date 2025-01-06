import { Project } from 'src/projects/entities/project.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('ai_models')
export class AIModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ length: 200, nullable: true })
  description: string;


        // @OneToMany(() => AIModel, () => , { cascade: true })
        // members: WorkspaceMember[];
  // @Column({ length: 200, nullable: true })
  // image_path: string;
  @Column()
  ai_type: string;

  @Column("simple-array")
  ai_tag: string[];

  @Column({ length: 200, nullable: true })
  input_desc: string;

  @Column()
  api_uri: string;

  @Column('jsonb') // ใช้ jsonb สำหรับเก็บ Array ใน PostgreSQL
  response_keys: { key: string; meaning: string ,displayFormat:string}[]; // รูปแบบ Array ของ JSON object
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;


  @OneToMany(() => Project,(project) => project.ai_model,)
       projects: Project[];

  // @Column()
  // create_by: string[];

}