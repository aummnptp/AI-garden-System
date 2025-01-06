import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAiPermissionDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  ai_id: number;

  @IsBoolean()
  @IsOptional() // สามารถเป็น null หรือไม่ต้องใส่ค่าก็ได้
  approve?: boolean;
}
