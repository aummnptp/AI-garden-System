import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Workspace {
    
   @PrimaryGeneratedColumn()
   id: number;
 
   @Column()
   name: string;
 
   @Column()
   description: string;


}
