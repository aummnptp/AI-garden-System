import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid',{ name: 'user_id' })// ใช้ id เป็น Primary Key
    userId: string;
  
    @Column({ unique: true ,name:'google_id'})  // googleId ควรเป็นค่าที่ได้จาก Google และควรจะเป็น unique
    googleId: string;
  
    @Column({ unique: true })  // อีเมลควรจะเป็น unique เพื่อป้องกันการซ้ำกัน
    email: string;
    @Column()
    name: string;
    @Column()
    picture: string;

    @Column({ default: 'user' })
    role: string;
    

}