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
import { AIModel } from "src/ai/entities/ai-model.entity";  // Import AIModel

@Injectable()
export class AIUsageLimitGuard implements CanActivate {
  constructor(
    @InjectRepository(AIUsageLimit)
    private readonly aiUsageLimitRepository: Repository<AIUsageLimit>,
    @InjectRepository(AISetting)
    private readonly aiSettingRepository: Repository<AISetting>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AIModel)   // Inject repository สำหรับ AIModel
    private readonly aiModelRepository: Repository<AIModel>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req.user?.userId;
    if (!userId) {
      throw new BadRequestException('Unauthorized request');
    }
  
    const aiIdFromParams = req.params.aiId;
    if (!aiIdFromParams) {
      throw new BadRequestException('AI Id is required in parameters');
    }
  
    const today = new Date().toISOString().split('T')[0];
  
    // ดึงค่าการตั้งค่า AI (เช่น maxUsagePerDay, isLimitEnabled)
    const settings = await this.aiSettingRepository.find({ take: 1 });
    const limitSetting = settings[0];
    console.log("Limit Setting isLimitEnabled:", limitSetting?.isLimitEnabled);
    // ถ้า limit ถูกปิดใช้งาน ให้ผ่านทันที
    if (limitSetting && !limitSetting.isLimitEnabled) {
      return true;
    }
 
   
    const maxUsagePerDay = limitSetting ? limitSetting.maxUsagePerDay : 10;
  
    // ดึงข้อมูล usage record สำหรับ (user, ai, date)
    let usage = await this.aiUsageLimitRepository.findOne({
      where: {
        user: { userId: userId },
        ai: { aiId: aiIdFromParams },
        date: today,
      },
    });
  
    // หากมี record อยู่แล้ว ตรวจสอบค่า usageCount
    if (usage && usage.usageCount >= maxUsagePerDay) {
      throw new BadRequestException(`You have reached the daily limit of ${maxUsagePerDay} requests.`);
    }
  
    // ดึงข้อมูลผู้ใช้
    const user = await this.userRepository.findOne({ where: { userId: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // ดึงข้อมูล AI model
    const ai = await this.aiModelRepository.findOne({ where: { aiId: aiIdFromParams } });
    if (!ai) {
      throw new NotFoundException('AI model not found');
    }
  
    // ถ้าไม่มี recordใช้งานในวันนี้ ให้สร้างใหม่, ถ้ามีให้เพิ่ม usageCount
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
