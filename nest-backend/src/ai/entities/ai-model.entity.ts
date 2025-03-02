
import { Permission } from '../../permission/entities/permission.entity';

import { Project } from 'src/projects/entities/project.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { AIUsageLimit } from '../../ai-setting/entities/ai-usage-limit.entity';
import { User } from 'src/user/entities/user.entity';


@Entity('ai_model')
export class AIModel {
  @PrimaryGeneratedColumn(`uuid`,{name:"ai_id"})
  aiId: string;

  @Column({ unique: true })
  name: string;

  @Column({ length: 200, nullable: true })
  description: string;

  @Column()
  ai_type: string;

  @Column("simple-array", { nullable: true })  
  ai_tag: string[];

  @Column("simple-array",{default:"#00ff00",name:"color_set"})
  colorSet: string[];

  @Column({type:'boolean',default:true})
  enable:boolean;

  @Column({type:'boolean',default:true})
  visible:boolean;

  @Column({ length: 200, nullable: true })
  input_desc: string;

  @Column()
  api_uri: string;


  @Column('jsonb') 
  response_keys: { key: string; meaning: string ,displayFormat: string}[]; 
  
  @Column({name:'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({name:'update_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => AIUsageLimit, (usageLimit) => usageLimit.ai)
  usageLimits: AIUsageLimit[];

  @OneToMany(() => Permission, (permission) => permission.aiModel, { onDelete: 'CASCADE' })
  permissions: Permission[];

  @OneToMany(() => Project,(project) => project.ai_model,)
  projects: Project[];
  
  @Column({name:'image_path', nullable: true })
  imagePath: string;

  @Column({name:'input_type', type: 'varchar', length: 50, default: 'รูปภาพ' })
  inputType: string;

  @ManyToOne(() => User, (user) => user.aiModels, { nullable: true })
  @JoinColumn({ name: "created_by" }) 
  createdBy: User;

}