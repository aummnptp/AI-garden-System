import { PartialType } from '@nestjs/mapped-types';
import { CreateDocsDto, CreateSubDocsDto } from './create-document.dto';
import { IsNotEmpty, IsString, IsNumber, IsOptional, MinLength, MaxLength, IsUUID, IsBoolean } from 'class-validator';


export class UpdateDocumentDto extends PartialType(CreateDocsDto) { 
    @IsOptional()
    @IsUUID()
     docsId: string;
     @IsOptional()
     @IsNumber()
     order: number;
     @IsOptional()
     @IsString()
     @MinLength(3, { message: 'Title ต้องมีความยาวอย่างน้อย 3 ตัวอักษร' })
     @MaxLength(20, { message: 'Title ต้องมีความยาวไม่เกิน 20 ตัวอักษร' })
     title?: string;


     
     
     @IsOptional()
    content:string;

        
    @IsOptional()
    @IsBoolean()
    hidden:boolean;
}




export class UpdateSubDocumentDto extends PartialType(CreateSubDocsDto) {
    @IsOptional()
    @IsUUID()
    subDocsId: string;
    @IsOptional()
    @IsString()
    order: number; 
    
    @IsOptional()
    @IsString()
    @MinLength(3, { message: 'Title ต้องมีความยาวอย่างน้อย 3 ตัวอักษร' })
    @MaxLength(20, { message: 'Title ต้องมีความยาวไม่เกิน 20 ตัวอักษร' })
    title?: string;
    @IsOptional()
    content:string;

        
    @IsOptional()
    @IsBoolean()
    hidden:boolean;

}