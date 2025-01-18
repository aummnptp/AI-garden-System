import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('document')
export class Document{
    @PrimaryColumn()
     @JoinColumn({ name: 'docs_id' })
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
  @PrimaryGeneratedColumn()
   @JoinColumn({ name: 'sub_id' })
  subDocsId: number;

  @Column()
  title: string; // หัวข้อย่อย

  @Column('text') 
  content: string; // เนื้อหา (Rich Text)

  @ManyToOne(() => Document, (document) => document.subDocuments, { onDelete: 'CASCADE' })
  document: Document; // ต้องตั้งชื่อให้ตรงกับ @OneToMany

}