import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsOptional } from "class-validator";

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    @IsOptional()
    name?: string;
  
    @IsOptional()
    description?: string;
  
    @IsOptional()
    input_type?: string;
  
    @IsOptional()
    image_path?: string;
  }
