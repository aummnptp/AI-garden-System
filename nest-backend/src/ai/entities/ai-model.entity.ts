import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ai_models')
export class AIModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ length: 200, nullable: true })
  description: string;

  // @Column({ length: 200, nullable: true })
  // image_path: string;
  @Column()
  ai_type: string;

  @Column("simple-array")
  ai_tag: string[];

  @Column()
  input_desc: string;

  @Column()
  api_uri: string;

  @Column('jsonb') // ใช้ jsonb สำหรับเก็บ Array ใน PostgreSQL
  response_keys: { key: string; meaning: string }[]; // รูปแบบ Array ของ JSON object
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;


  // @Column()
  // create_by: string[];

}