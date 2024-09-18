
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

   @Entity()
   export class Workspace {
      
      @PrimaryGeneratedColumn()
      id: number;
   
      @Column()
      name: string;
   
      @Column()
      description: string;
   
      @Column()
      createByEmail: string;

      // @Column("text", { array: true, nullable: true })
      // members: string[]; // IDs of people in the workspace, can be null
      @Column("jsonb", { nullable: true })
      members: { email: string;  role: string }[]; 
   
      @Column("int", { array: true, nullable: true })
      projects: number[]; // IDs of projects in the workspace, can be null
   
      @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
      createdAt: Date;
   
      @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
      updatedAt: Date;

      // @OneToMany(() => Workspace, (workspace) => workspace.createByUserId) 
      // workspaces: Workspace[]; // ฟิลด์นี้เก็บข้อมูล Workspace หลายอันที่ผู้ใช้คนนี้สร้าง

   }
