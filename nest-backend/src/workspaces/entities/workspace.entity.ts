
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

   // @OneToMany(() => Workspace, (workspace) => workspace.createByUserId) 
   // workspaces: Workspace[]; // ฟิลด์นี้เก็บข้อมูล Workspace หลายอันที่ผู้ใช้คนนี้สร้าง

}
