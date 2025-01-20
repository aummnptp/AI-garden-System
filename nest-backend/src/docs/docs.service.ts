import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document, SubDocument } from './entities/docs.entity';
import { CreateDocsDto, CreateSubDocsDto } from './dto/create-document.dto';

@Injectable()
export class DocsService {
    constructor(
        @InjectRepository(Document)
        private readonly documentRepository: Repository<Document>,
        @InjectRepository(SubDocument)
        private readonly subDocumentRepository: Repository<SubDocument>,
    ){}

    async create(createDocumentDto:CreateDocsDto):Promise<Document>{
        const  document = this.documentRepository.create(createDocumentDto);
        return this.documentRepository.save(document);
    }

    // ***************************** เพิ่ม Docs_id (เป็นSubของหัวข้อใหญ่ใด)***************************************
    async createSubTitle(docsId: number, createSubDocumentDto: CreateSubDocsDto): Promise<SubDocument> {
      const parentDocument = await this.documentRepository.findOne({
        where: { docsId: docsId },
      });
    
      if (!parentDocument) {
        throw new NotFoundException('Parent Document not found');
      }
    
      const subDocument = this.subDocumentRepository.create({
        ...createSubDocumentDto,
        document: parentDocument,
      });
    
      return this.subDocumentRepository.save(subDocument);
    }
    
// async getDocs(docsId: number):Promise<Document>{
  
// }


    delete(id: number): Promise<void> {
        return this.documentRepository.delete(id).then(() => undefined);
      }
      

    
    async findAll():Promise<Document[]>{
        try {
            return await this.documentRepository.find({ relations: ['subDocuments'] });
          } catch (error) {
            throw new Error(`Failed to fetch documents: ${error.message}`);
          }
    }


    async findOne(docsId:number):Promise<Document>{
      return this.documentRepository.findOneBy({ docsId: docsId });
        }

        async findByTitle(title: string): Promise<Document> {
          return this.documentRepository.findOneBy({ title: title });
        }

        async update(id: number, updateDocumentDto: UpdateDocumentDto): Promise<Document> {
            const document = await this.findOne(id);
            Object.assign(document, updateDocumentDto);
            return this.documentRepository.save(document);
          }
        
          async remove(id: number): Promise<void> {
            const document = await this.findOne(id);
            await this.documentRepository.remove(document);
          }
        
    

}
