import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AISettingController } from "./ai-setting.controller";
import { AISettingService } from "./ai-setting.service";
import { AIUsageLimitGuard } from "./guards/ai-usage-limit.guard";
import { AISetting } from "./entities/ai-setting.entity";
import { AIUsageLimit } from "./entities/ai-usage-limit.entity";
import { User } from "src/user/entities/user.entity";
import { AIModel } from "src/ai/entities/ai-model.entity";
import { AIVisibleGuard } from "./guards/ai-visible.guard";
import { AIEnableGuard } from "./guards/ai-enable.guard";
import { Project } from "src/projects/entities/project.entity";


@Module({
  imports: [TypeOrmModule.forFeature([AISetting,AIUsageLimit,User,AIModel,Project])],
  controllers: [AISettingController],
  providers: [AISettingService, AIUsageLimitGuard,AIEnableGuard, AIVisibleGuard],
  exports: [AISettingService, AIUsageLimitGuard,AIEnableGuard, AIVisibleGuard,TypeOrmModule], 
})
export class AISettingModule {}