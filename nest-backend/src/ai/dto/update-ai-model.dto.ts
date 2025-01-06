import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ResponseKeyDto {
  @IsString()
  key: string;

  @IsString()
  meaning: string;

  @IsString()
  displayFormat: string;
  
}

export class UpdateAIModelDto {
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsString()
  readonly ai_type: string;

  @IsString()
  readonly api_uri: string;
  
  @IsOptional()
  @IsString()
  readonly input_desc: string;

  @IsOptional()
  @IsArray() 
  @IsString({ each: true })
  readonly ai_tag?: string[];
  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResponseKeyDto)
  readonly response_keys: ResponseKeyDto[];
  
  @IsOptional()
  @IsString()
  readonly imagePath?: string; // เพิ่มฟิลด์ imagePath
}