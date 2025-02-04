import { Entity, PrimaryGeneratedColumn,ManyToOne,JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AIModel } from '../../ai/entities/ai-model.entity';
import { User } from '../../user/entities/user.entity';

@Entity('ai_permission') // ระบุชื่อ table ใน database
export class Permission {
  @PrimaryGeneratedColumn(`uuid`,{name:"permission_id"})
  id: string;

  @Column()
  user_id: string;

  @Column()
  ai_id: string;

  @Column({ nullable: true })
  approve: boolean;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.permissions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => AIModel, (aiModel) => aiModel.permissions)
  @JoinColumn({ name: 'ai_id' })
  aiModel: AIModel;
}
