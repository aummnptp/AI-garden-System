import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AISetting } from "./entities/ai-setting.entity";
import { UpdateAISettingDto } from "./dto/update-setting.dto";


@Injectable()
export class AISettingService {
  constructor(
    @InjectRepository(AISetting)
    private readonly aiUsageLimitSettingRepository: Repository<AISetting>,
  ) {}

  async getLimitSetting(): Promise<AISetting> {
    const setting = await this.aiUsageLimitSettingRepository.findOne({ where: {} });
    if (!setting) {
      throw new NotFoundException("AI usage limit setting not found");
    }
    return setting;
  }

  async updateLimitSetting(updateDto: UpdateAISettingDto): Promise<AISetting> {
  
    let setting = await this.aiUsageLimitSettingRepository.findOne({ where: {} });
    if (!setting) {
      setting = this.aiUsageLimitSettingRepository.create({
        maxUsagePerDay: updateDto.maxUsagePerDay,
        isLimitEnabled: updateDto.isLimitEnabled,
      });
    } else {
      setting.maxUsagePerDay = updateDto.maxUsagePerDay;
    }
    return this.aiUsageLimitSettingRepository.save(setting);
  }
}
