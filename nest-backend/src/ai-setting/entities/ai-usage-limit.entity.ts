
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { AIModel } from "../../ai/entities/ai-model.entity";
@Entity('ai_usage_limit')
@Unique(['user', 'ai', 'date'])
export class AIUsageLimit {
  @PrimaryGeneratedColumn(`uuid`, { name: 'usage_id' })
  usageId: string;

  @ManyToOne(() => User, (user) => user.usageLimits)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  date: string;

  @Column({ default: 0 })
  usageCount: number;

  @ManyToOne(() => AIModel, (ai) => ai.usageLimits,{ onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ai_id' })
  ai: AIModel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
