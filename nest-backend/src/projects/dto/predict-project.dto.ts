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

  @IsString()
  filePath: string;

}
