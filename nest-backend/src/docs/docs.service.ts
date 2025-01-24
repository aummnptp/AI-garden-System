import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateDocumentDto, UpdateSubDocumentDto } from './dto/update-document.dto';
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

async delete(docsId: number): Promise<void> {
  const document = await this.getDocs(docsId);
  if (!document) {
    throw new NotFoundException('Document not found');
  }
  
  // Remove all sub-documents associated with this document
  await this.subDocumentRepository.delete({ document: { docsId: docsId } });
  
  // Remove the document itself
  await this.documentRepository.remove(document);
}



async deleteSubDoc(subDocsId: number): Promise<void> {
  const subDocument = await this.getSubDocs(subDocsId);
  if (!subDocument) {
    throw new NotFoundException('SubDocument not found');
  }

  await this.subDocumentRepository.remove(subDocument);
}

    
    async findAll():Promise<Document[]>{
        try {
            return await this.documentRepository.find({ relations: ['subDocuments'] });
          } catch (error) {
            throw new Error(`Failed to fetch documents: ${error.message}`);
          }
    }


  async getDocs(docsId: number): Promise<Document> {
    return this.documentRepository.findOneBy({ docsId: docsId });
  }
  async updateDocs(docsId: number, updateDocumentDto: UpdateDocumentDto): Promise<Document> {
    const document = await this.getDocs(docsId);
    Object.assign(document, updateDocumentDto);
    return this.documentRepository.save(document);
  }




  async removeDocs(id: number): Promise<void> {
    const document = await this.getDocs(id);
    await this.documentRepository.remove(document);
  }


  async findByTitle(title: string): Promise<Document> {
    return this.documentRepository.findOneBy({ title: title });
  }



  async getSubDocs(subDocsId: number): Promise<SubDocument> {
    return this.subDocumentRepository.findOneBy({ subDocsId: subDocsId });
  }
  async updateSubDocs(subDocsId: number, updateSubDocumentDto: UpdateSubDocumentDto): Promise<SubDocument> {
    const subdocument = await this.getSubDocs(subDocsId);
    Object.assign(subdocument, updateSubDocumentDto);
    return this.subDocumentRepository.save(subdocument);
  }

  async removeSubDocs(subDocsId: number): Promise<void> {
    const subdocument = await this.getSubDocs(subDocsId);
    await this.subDocumentRepository.remove(subdocument);
  }




          
    

}
