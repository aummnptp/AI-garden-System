import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { UpdateAISettingDto } from "./dto/update-setting.dto";
import { AISettingService } from "./ai-setting.service";
import { RolesGuard } from "src/auth/guards/role.guard";
import { JwtGuard } from "src/auth/guards/jwt-auth.guard";
import { Role } from "src/auth/decorator/roles-decoraters";

@Controller("ai-usage-limit-setting")
export class AISettingController {
  constructor(private readonly aiSettingService: AISettingService) {}


  @Role("admin")
  @UseGuards(JwtGuard,RolesGuard)
  @Get()
  async getLimitSetting() {
    return this.aiSettingService.getLimitSetting();
  }


  @Role("admin")
  @UseGuards(JwtGuard,RolesGuard)
  @Put()
  async updateLimitSetting(@Body() updateDto: UpdateAISettingDto) {
    return this.aiSettingService.updateLimitSetting(updateDto);
  }
}