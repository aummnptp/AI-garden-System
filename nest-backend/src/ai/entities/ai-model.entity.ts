import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ai_models')
export class AIModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ length: 200, nullable: true })
  description: string;

  @Column()
  ai_type: string;

  @Column()
  api_uri: string;

  @Column('jsonb') // ใช้ jsonb สำหรับเก็บ Array ใน PostgreSQL
  responseKeys: { key: string; meaning: string }[]; // รูปแบบ Array ของ JSON object
  // @Column()
  // response_keys: string[];

}