import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  project_name: string;

  @IsString()
  project_desc: string;

  @IsString()
  input_type: string;

  @IsString()
  @IsOptional()
  image_path: string;

  @IsNumber()
  ai_id: number

}
