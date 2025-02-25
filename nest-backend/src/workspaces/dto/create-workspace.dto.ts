import { IsString, IsOptional, IsArray, IsInt, IsEmail, IsNumber, IsUUID, MinLength, MaxLength } from 'class-validator';

export class CreateWorkspaceDto {

    @IsString()
    @MinLength(3, { message: "Workspace name must be at least 3 characters" })
    @MaxLength(20, { message: "Workspace name cannot exceed 20 characters" })
    name: string;
  
    @IsString()
    @MinLength(5, { message: "Description must be at least 5 characters" })
    @MaxLength(50, { message: "Description cannot exceed 50 characters" })
    description: string;
}
