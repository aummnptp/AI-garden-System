import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('document')
export class Document{

    @PrimaryGeneratedColumn({ name: 'docs_id' })
    docsId:number;

    @Column()
    title:string;

    @Column('text')
    content:string;
    
    @OneToMany(() => SubDocument, (subDocument) => subDocument.document, { cascade: true })
    subDocuments: SubDocument[]; // ต้องตั้งชื่อตรงกันใน @ManyToOne

}



@Entity('sub_document')
export class SubDocument {
  @PrimaryGeneratedColumn({ name: 'sub_id'} )
  subDocsId: number;
  
  @Column()
  title: string; // หัวข้อย่อย
  
  @Column() 
  content: string; // เนื้อหา (Rich Text)
  
  @ManyToOne(() => Document, (document) => document.subDocuments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'docs_id' })
  document: Document; // ต้องตั้งชื่อให้ตรงกับ @OneToMany

}