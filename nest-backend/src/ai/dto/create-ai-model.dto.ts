import { IsString, IsOptional, IsArray, ValidateNested, IsUUID, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class ResponseKeyDto {
  @IsString()
  key: string;

  @IsString()
  meaning: string;

  @IsString()
  displayFormat: string;
  
}

export class CreateAIModelDto {
  @IsUUID() 
  readonly id: string;

  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
  
  @IsOptional()
  @IsString()
  readonly ai_type: string;

  @IsOptional()
  @IsString()
  readonly api_uri: string;
  
  @IsOptional()
  @IsString()
  readonly input_desc: string;

  @IsOptional()
  @IsArray() 
  @IsString({ each: true })
  readonly ai_tag?: string[];
  
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResponseKeyDto)
  readonly response_keys: ResponseKeyDto[];

  @IsOptional()
  @IsString()
  readonly imagePath?: string; 

  @IsOptional()
  @IsBoolean()
  readonly enable?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly visible?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly color_set?: string[];

  @IsOptional()
  @IsString()
  readonly inputType?: string;


}