import { PartialType } from "@nestjs/mapped-types";
import { CreateWorkspaceDto } from "./create-workspace.dto";
import { IsOptional, IsString, MinLength, MaxLength } from "class-validator";

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: "Workspace name must be at least 3 characters" })
  @MaxLength(50, { message: "Workspace name cannot exceed 50 characters" })
  readonly name?: string;

  @IsOptional()
  @IsString()
  @MinLength(5, { message: "Description must be at least 5 characters" })
  @MaxLength(200, { message: "Description cannot exceed 200 characters" })
  readonly description?: string;
}
