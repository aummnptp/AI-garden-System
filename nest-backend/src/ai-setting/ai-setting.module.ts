import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AISettingController } from "./ai-setting.controller";
import { AISettingService } from "./ai-setting.service";
import { AIUsageLimitGuard } from "./guards/ai-usage-limit.guard";
import { AISetting } from "./entities/ai-setting.entity";
import { AIUsageLimit } from "./entities/ai-usage-limit.entity";
import { User } from "src/user/entities/user.entity";
import { AIModel } from "src/ai/entities/ai-model.entity";


@Module({
  imports: [TypeOrmModule.forFeature([AISetting,AIUsageLimit,User,AIModel])],
  controllers: [AISettingController],
  providers: [AISettingService, AIUsageLimitGuard],
  exports: [AISettingService, AIUsageLimitGuard], 
})
export class AISettingModule {}