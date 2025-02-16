import { AIUsageLimit } from "src/ai-setting/entities/ai-usage-limit.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from '../../permission/entities/permission.entity';
import { Project } from "src/projects/entities/project.entity";

@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid',{ name: 'user_id' })// ใช้ id เป็น Primary Key
    userId: string;

  
    @Column({ unique: true ,name:'google_id'})  // googleId ควรเป็นค่าที่ได้จาก Google และควรจะเป็น unique
    googleId: string;
  
    @Column({ unique: true }) // อีเมลควรจะเป็น unique เพื่อป้องกันการซ้ำกัน
    email: string;
    @Column()
    name: string;
    @Column()
    picture: string;

    @Column({ default: 'user' })
    role: string;

    @OneToMany(() => AIUsageLimit, (usageLimit) => usageLimit.user)
    usageLimits: AIUsageLimit[];
    
    
    @OneToMany(() => Permission, (permission) => permission.aiModel)
      permissions: Permission[];

      @OneToMany(() => Project, (project) => project.createdBy)
      projects: Project[];
}