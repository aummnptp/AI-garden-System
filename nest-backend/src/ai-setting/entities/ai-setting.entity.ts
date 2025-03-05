import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('ai_setting')
export class AISetting {
  @PrimaryGeneratedColumn('uuid', { name: 'limit_id' })
  limitId: string;

  @Column({ default: 10 })
  maxUsagePerDay: number;
  
  @Column({ default: true })
  isLimitEnabled: boolean;
}
