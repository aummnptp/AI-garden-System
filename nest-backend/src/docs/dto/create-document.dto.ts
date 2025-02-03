import { IsNotEmpty, IsString, IsArray, ValidateNested, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { Document } from '../entities/docs.entity';

export class CreateSubDocsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  // @IsNotEmpty()
  @IsString()
  content?: string;
  @IsInt()
  order: number;
  @IsNotEmpty() // บังคับให้ส่ง document มาด้วย
  document: Document;
  
}

export class  CreateDocsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  order: number;
  
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubDocsDto)
  subDocs: CreateSubDocsDto[];
  
}
