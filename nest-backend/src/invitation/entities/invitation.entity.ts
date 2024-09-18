import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Invitation {
    
    @PrimaryGeneratedColumn()
    id: number;
    // @Column()
    // : number;
}
