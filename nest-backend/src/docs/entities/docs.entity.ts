import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('document')
export class Document{

    @PrimaryGeneratedColumn('uuid',{ name: 'docs_id' })
    docsId:string;

    @Column()
    title:string;

    @Column('text')
    content:string;
    
    @Column({type:'int',default:0})
    order:number;

    @Column({type:'boolean',default:false})
    hidden:boolean;
    @OneToMany(() => SubDocument, (subDocument) => subDocument.document, { cascade: true })
    subDocuments: SubDocument[]; // ต้องตั้งชื่อตรงกันใน @ManyToOne
}



@Entity('sub_document')
export class SubDocument {
  @PrimaryGeneratedColumn('uuid', { name: 'sub_id'} )
  subDocsId: string;
  
  @Column()
  title: string; // หัวข้อย่อย
  
  @Column() 
  content: string; // เนื้อหา (Rich Text)

  @Column({type:'boolean',default:false})
  hidden:boolean;
  @Column({ type: 'int', default: 0 })
  order: number;
  @ManyToOne(() => Document, (document) => document.subDocuments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'docs_id' })
  document: Document; // ต้องตั้งชื่อให้ตรงกับ @OneToMany

}