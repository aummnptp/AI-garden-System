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
  ) {}

  async create(createDocumentDto: CreateDocsDto): Promise<Document> {
    const document = this.documentRepository.create(createDocumentDto);
    return this.documentRepository.save(document);
  }

  async createSubTitle(docsId: string, createSubDocumentDto: CreateSubDocsDto): Promise<SubDocument> {
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

  async delete(docsId: string): Promise<void> {
    const document = await this.getDocs(docsId);
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    // Remove all sub-documents associated with this document
    await this.subDocumentRepository.delete({ document: { docsId: docsId } });
    // Remove the document itself
    await this.documentRepository.remove(document);
  }



  async deleteSubDoc(subDocsId: string): Promise<void> {
    const subDocument = await this.getSubDocs(subDocsId);
    if (!subDocument) {
      throw new NotFoundException('SubDocument not found');
    }
    await this.subDocumentRepository.remove(subDocument);
  }

  async findAllTitles(userRole: string): Promise<Document[]> {
    try {
      const query = this.documentRepository
        .createQueryBuilder('document')
        .leftJoinAndSelect('document.subDocuments', 'subDocument')
        .select([
          'document.docsId',
          'document.title',
          'document.order',
          'document.hidden',
          'subDocument.subDocsId',
          'subDocument.title',
          'subDocument.order',
          'subDocument.hidden',
        ])
        .orderBy('document.order', 'ASC')
        .addOrderBy('subDocument.order', 'ASC');
  
      if (userRole !== 'admin') {
        // ถ้าไม่ใช่ Admin ซ่อนหัวข้อที่ hidden
        query.where('document.hidden = false').andWhere('subDocument.hidden = false');
      }
  
      return await query.getMany();
    } catch (error) {
      throw new Error(`Failed to fetch document titles: ${error.message}`);
    }
  }
  async getDocs(docsId: string): Promise<Document> {
    return this.documentRepository.findOneBy({ docsId: docsId });
  }
  async updateDocs(docsId: string, updateDocumentDto: UpdateDocumentDto): Promise<Document> {
    const document = await this.getDocs(docsId);
    Object.assign(document, updateDocumentDto);
    return this.documentRepository.save(document);
  }

  async removeDocs(id: string): Promise<void> {
    const document = await this.getDocs(id);
    await this.documentRepository.remove(document);
  }

  async findByTitle(title: string): Promise<Document> {
    return this.documentRepository.findOneBy({ title: title });
  }

  async getSubDocs(subDocsId: string): Promise<SubDocument> {
    return this.subDocumentRepository.findOneBy({ subDocsId: subDocsId });
  }
  
  async removeSubDocs(subDocsId: string): Promise<void> {
    const subdocument = await this.getSubDocs(subDocsId);
    await this.subDocumentRepository.remove(subdocument);
  }
  
  
  async updateSubDocs(subDocsId: string, updateSubDocumentDto: UpdateSubDocumentDto): Promise<SubDocument> {
    const subdocument = await this.getSubDocs(subDocsId);
    Object.assign(subdocument, updateSubDocumentDto);
    return this.subDocumentRepository.save(subdocument);
  }
  
  async saveDocsOrder(documents: UpdateDocumentDto[]): Promise<Document[]> {
    const updatedDocuments = await Promise.all(
      documents.map(async (doc) => {
        const document = await this.getDocs(doc.docsId);
        document.order = doc.order;
        return document;
      })
    );
    return this.documentRepository.save(updatedDocuments);
  }


  async saveSubDocsOrder(subDocuments: UpdateSubDocumentDto[]): Promise<SubDocument[]> {
    const updatedSubDocuments = await Promise.all(
      subDocuments.map(async (subDoc) => {
        const subDocument = await this.getSubDocs(subDoc.subDocsId);
        subDocument.order = subDoc.order;
        return subDocument;
      })
    );
    return this.subDocumentRepository.save(updatedSubDocuments);
  }


}
