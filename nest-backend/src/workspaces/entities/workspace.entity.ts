import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export class Workspace {
    
    /**
    * this decorator will help to auto generate id for the table.
    */
   @PrimaryGeneratedColumn()
   id: number;
 
   @Column({ type: 'varchar', length: 30 })
   name: string;
 
   @Column({ type: 'varchar', length: 45 })
   description: string;
 
   
 
   gender: string;

}
