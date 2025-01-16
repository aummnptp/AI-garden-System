import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Column } from 'typeorm';

class ResponseKeyDto {
    @IsString()
    key: string;
  
    @IsString()
    meaning: string;
  
    @IsString()
    displayFormat: string;
    
  }
  
export class CreateProjectHistoryDto {
  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @IsNumber()
  @IsNotEmpty()
  modelId: number;

  @IsString()
  @IsOptional()
  filePath?: string;

  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResponseKeyDto)
  readonly response_keys: ResponseKeyDto[];
    
  @IsArray()
  @IsNotEmpty()
  result:{}[];

// @Column('jsonb') // ใช้ jsonb สำหรับเก็บ Array ใน PostgreSQL
// response_keys: { key: string; meaning: string ,displayFormat:string}[];
}
