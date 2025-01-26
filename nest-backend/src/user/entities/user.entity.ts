import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Permission } from '../../permission/entities/permission.entity';

@Entity()
export class User{
    @PrimaryGeneratedColumn({ name: 'user_id' })// ใช้ id เป็น Primary Key
    userId: number;
  
    @Column({ unique: true })  // googleId ควรเป็นค่าที่ได้จาก Google และควรจะเป็น unique
    googleId: string;
  
    @Column({ unique: true })  // อีเมลควรจะเป็น unique เพื่อป้องกันการซ้ำกัน
    email: string;
    @Column()
    name: string;
    @Column()
    picture: string;

    @Column({ default: 'user' })
    role: string;
    
    @OneToMany(() => Permission, (permission) => permission.aiModel)
      permissions: Permission[];

}