import { PartialType } from '@nestjs/mapped-types';
import { CreateDocsDto } from './create-document.dto';


export class UpdateDocumentDto extends PartialType(CreateDocsDto) {}
