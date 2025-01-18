import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './entities/docs.entity';
import { CreateDocsDto } from './dto/create-document.dto';

@Injectable()
export class DocsService {
    constructor(
        @InjectRepository(Document)
        private readonly documentRepository: Repository<Document>,
    ){}

    async create(createDocumentDto:CreateDocsDto):Promise<Document>{
        const  document = this.documentRepository.create(createDocumentDto);
        return this.documentRepository.save(document);
    }
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


    async findOne(id:number):Promise<Document>{
        const document = await this.documentRepository.findOne({
            // where:{id},
            relations:['sub_document'],
        })
        if (!document) {
            throw new NotFoundException(`Document with ID ${id} not found`);
          }
          return document;
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
