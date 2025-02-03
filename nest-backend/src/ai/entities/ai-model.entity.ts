import { Project } from 'src/projects/entities/project.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AIUsageLimit } from '../../ai-setting/entities/ai-usage-limit.entity';


@Entity('ai_model')
export class AIModel {
  @PrimaryGeneratedColumn(`uuid`,{name:"ai_id"})
  aiId: string;

  @Column()
  name: string;

  @Column({ length: 200, nullable: true })
  description: string;

  @Column()
  ai_type: string;

  @Column("simple-array",{nullable:true})
  ai_tag: string[];

  @Column("simple-array",{nullable:true})
  color_set: string[];

  @Column({type:'boolean',default:true})
  enable:boolean;

  @Column({type:'boolean',default:true})
  visible:boolean;

  @Column({ length: 200, nullable: true })
  input_desc: string;

  @Column()
  api_uri: string;

  @Column('jsonb') // ใช้ jsonb สำหรับเก็บ Array ใน PostgreSQL
  response_keys: { key: string; meaning: string ,displayFormat: string}[]; // รูปแบบ Array ของ JSON object
  
  @Column({name:'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({name:'update_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => AIUsageLimit, (usageLimit) => usageLimit.ai)
  usageLimits: AIUsageLimit[];

  @OneToMany(() => Project,(project) => project.ai_model,)
  projects: Project[];

  // @Column()
  // create_by: string[];
  
  @Column({name:'image_path', nullable: true }) // เพิ่มฟิลด์ imagePath
  imagePath: string;
}