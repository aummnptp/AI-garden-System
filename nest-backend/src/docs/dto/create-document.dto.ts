import { IsNotEmpty, IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubDocsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  // @IsNotEmpty()
  @IsString()
  content?: string;
}

export class  CreateDocsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
