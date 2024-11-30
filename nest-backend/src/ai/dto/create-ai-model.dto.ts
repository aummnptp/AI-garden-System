import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ResponseKeyDto {
  @IsString()
  key: string;

  @IsString()
  meaning: string;
}

export class CreateAIModelDto {
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsString()
  readonly ai_type: string;

  @IsString()
  readonly api_uri: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResponseKeyDto)
  readonly responseKeys: ResponseKeyDto[];
}