import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('ai_setting')
export class AISetting {
  @PrimaryGeneratedColumn('uuid', { name: 'limit_id' })
  limitId: string;

  @Column({ default: 10 }) // ค่า default คือ 10 ครั้งต่อวันสำหรับ AI ทั้งระบบ
  maxUsagePerDay: number;
}
