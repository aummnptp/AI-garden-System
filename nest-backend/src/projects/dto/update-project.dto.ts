import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    // @isString()
    // @IsOptional()
    project_name?: string;
  
    // @IsString()
    // @IsOptional()
    project_desc?: string;
  
    // @IsString()
    // @IsOptional()
    input_type?: string;
  
    // @IsString()
    // @IsOptional()
    imagePath?: string;
  
    // @IsBoolean()
    // @IsOptional()
    permission_only?: boolean;
  
 
    // @IsNumber()
    // @IsOptional()
    // workspace_id?: number;
  
    // @IsNumber()
    // @IsOptional()
    // ai_id?: number;
}
