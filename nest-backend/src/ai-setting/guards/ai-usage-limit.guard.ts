import { 
  BadRequestException, 
  CanActivate, 
  ExecutionContext, 
  Injectable, 
  NotFoundException, 
  InternalServerErrorException 
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AIUsageLimit } from "src/ai-setting/entities/ai-usage-limit.entity";
import { AISetting } from "src/ai-setting/entities/ai-setting.entity";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { AIModel } from "src/ai/entities/ai-model.entity"; 

@Injectable()
export class AIUsageLimitGuard implements CanActivate {
  constructor(
    @InjectRepository(AIUsageLimit)
    private readonly aiUsageLimitRepository: Repository<AIUsageLimit>,
    @InjectRepository(AISetting)
    private readonly aiSettingRepository: Repository<AISetting>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AIModel)  
    private readonly aiModelRepository: Repository<AIModel>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req.user?.userId;
    if (!userId) {
      throw new BadRequestException('AIUsageLimitGuard: undefine user request');
    }
  
    const aiIdFromParams = req.params.aiId;
    if (!aiIdFromParams) {
      throw new BadRequestException('AI Id is required in parameters');
    }
  
    const today = new Date().toISOString().split('T')[0];
  
    const settings = await this.aiSettingRepository.find({ take: 1 });
    const limitSetting = settings[0];
    if (limitSetting && !limitSetting.isLimitEnabled) {
      return true;
    }
 
   
    const maxUsagePerDay = limitSetting ? limitSetting.maxUsagePerDay : 10;
  
    let usage = await this.aiUsageLimitRepository.findOne({
      where: {
        user: { userId: userId },
        ai: { aiId: aiIdFromParams },
        date: today,
      },
    });
  
    if (usage && usage.usageCount >= maxUsagePerDay) {
      throw new BadRequestException(`You have reached the daily limit of ${maxUsagePerDay} requests.`);
    }
  
    const user = await this.userRepository.findOne({ where: { userId: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const ai = await this.aiModelRepository.findOne({ where: { aiId: aiIdFromParams } });
    if (!ai) {
      throw new NotFoundException('AI model not found');
    }
  
    if (usage) {
      usage.usageCount += 1;
    } else {
      usage = this.aiUsageLimitRepository.create({
        user: user,
        ai: ai,
        date: today,
        usageCount: 1,
      });
    }
  
    await this.aiUsageLimitRepository.save(usage);
  
    return true;
  }
  
}
