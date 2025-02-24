import { AIUsageLimit } from "src/ai-setting/entities/ai-usage-limit.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from '../../permission/entities/permission.entity';
import { Project } from "src/projects/entities/project.entity";
import { AIModel } from "src/ai/entities/ai-model.entity";

@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid',{ name: 'user_id' })
    userId: string;

  
    @Column({ unique: true ,name:'google_id'})
    googleId: string;
  
    @Column({ unique: true })
    email: string;
    @Column()
    name: string;
    @Column()
    picture: string;

    @Column({ nullable: true })

    googlePictureUrl: string; 
    @Column({ default: 'user' })
    role: string;

    @OneToMany(() => AIUsageLimit, (usageLimit) => usageLimit.user)
    usageLimits: AIUsageLimit[];
    
    
    @OneToMany(() => Permission, (permission) => permission.aiModel)
      permissions: Permission[];

      @OneToMany(() => Project, (project) => project.createdBy)
      projects: Project[];

      @OneToMany(() => AIModel, (aiModel) => aiModel.createdBy)
      aiModels: AIModel[];
}