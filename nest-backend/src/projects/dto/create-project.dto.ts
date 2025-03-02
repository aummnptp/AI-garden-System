import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, IsIn, IsUUID } from "class-validator";

export class CreateProjectDto {
  @IsNotEmpty({ message: "Project name is required" })
  @IsString()
  @MinLength(3, { message: "Project name must be at least 3 characters" })
  @MaxLength(50, { message: "Project name cannot exceed 50 characters" })
  name: string;

  @IsNotEmpty({ message: "Project description is required" })
  @IsString()
  @MinLength(5, { message: "Project description must be at least 5 characters" })
  @MaxLength(200, { message: "Project description cannot exceed 200 characters" })
  description: string;

  @IsNotEmpty({ message: "Input type is required" })
  @IsString()
  @IsIn(["รูปภาพ", "วิดีโอ", "รูปภาพและวิดีโอ"], { message: "Input type must be 'รูปภาพ', 'วิดีโอ', or 'รูปภาพและวิดีโอ'" })
  input_type: string;

  @IsOptional()
  @IsString()
  image_path?: string;

  @IsNotEmpty({ message: "Workspace ID is required" })
  @IsUUID()
  workspaceId: string;

  @IsNotEmpty({ message: "AI Model ID is required" })
  @IsUUID()
  ai_id: string;
}
