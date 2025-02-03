import { PartialType } from '@nestjs/mapped-types';
import { CreateDocsDto, CreateSubDocsDto } from './create-document.dto';


export class UpdateDocumentDto extends PartialType(CreateDocsDto) { 
     docsId: string; // เพิ่ม field docsId
     order: number;  // ลำดับใหม่ของเอกสาร
}




export class UpdateSubDocumentDto extends PartialType(CreateSubDocsDto) {
    subDocsId: string; // เพิ่ม field subDocsId
    order: number;     // ลำดับใหม่ของ sub-document


}