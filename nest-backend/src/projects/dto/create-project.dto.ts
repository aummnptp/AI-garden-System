import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  project_name: string;

  @IsString()
  project_desc: string;

  @IsString()
  input_type: string;

  @IsString()
  image_path: string;

  @IsBoolean()
  @IsOptional()
  permission_only?: boolean;

//   @IsNumber()
//   workspace_id: number;

//   @IsNumber()
//   ai_id: number;
}
