import { IsString, IsUUID } from "class-validator";

export class ProjectPermissionDto {
  @IsUUID()
  userId: string;

  @IsString()
  role: string;
}
