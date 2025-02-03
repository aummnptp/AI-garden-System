import { Body, Controller, Get, Put } from "@nestjs/common";
import { UpdateAISettingDto } from "./dto/update-setting.dto";
import { AISettingService } from "./ai-setting.service";

@Controller("ai-usage-limit-setting")
export class AISettingController {
  constructor(private readonly aiSettingService: AISettingService) {}

  @Get()
  async getLimitSetting() {
    return this.aiSettingService.getLimitSetting();
  }

  @Put()
  async updateLimitSetting(@Body() updateDto: UpdateAISettingDto) {
    return this.aiSettingService.updateLimitSetting(updateDto);
  }
}