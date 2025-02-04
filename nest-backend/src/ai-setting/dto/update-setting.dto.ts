import { IsBoolean, IsInt, Min } from "class-validator";

export class UpdateAISettingDto {
  @IsInt()
  @Min(1)
  maxUsagePerDay: number;

  @IsBoolean()
  isLimitEnabled: boolean;
}