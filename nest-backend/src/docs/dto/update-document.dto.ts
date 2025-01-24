import { PartialType } from '@nestjs/mapped-types';
import { CreateDocsDto, CreateSubDocsDto } from './create-document.dto';


export class UpdateDocumentDto extends PartialType(CreateDocsDto) {}




export class UpdateSubDocumentDto extends PartialType(CreateSubDocsDto) {}