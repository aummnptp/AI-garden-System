import { BadRequestException, CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Observable } from "rxjs";
import { AIUsageLimit } from "src/ai-setting/entities/ai-usage-limit.entity";
import { AISetting } from "src/ai-setting/entities/ai-setting.entity";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";


@Injectable()
export class AIUsageLimitGuard implements CanActivate {
 constructor(
        @InjectRepository(AIUsageLimit)
        private readonly aiUsageLimitRepository: Repository<AIUsageLimit>,
        @InjectRepository(AISetting)
        private readonly aiSettingRepository: Repository<AISetting>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const userId = req.user?.id;

        if (!userId) {
            throw new BadRequestException('Unauthorized request');
        }

        const today = new Date().toISOString().split('T')[0];

        // ดึงค่าจำนวน limit ที่ตั้งไว้
        const limitSetting = await this.aiSettingRepository.findOne({});
        const maxUsagePerDay = limitSetting ? limitSetting.maxUsagePerDay : 10;

        // ตรวจสอบจำนวนที่ใช้งานไปแล้ววันนี้
        const totalUsageToday = await this.aiUsageLimitRepository.count({
            where: { user: { userId: userId }, date: today },
        });

        if (totalUsageToday >= maxUsagePerDay) {
            throw new BadRequestException(`You have reached the daily limit of ${maxUsagePerDay} requests.`);
        }

        // ดึงข้อมูลผู้ใช้
        const user = await this.userRepository.findOne({ where: { userId: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // ตรวจสอบว่ามี record ในวันนี้หรือยัง
        let usage = await this.aiUsageLimitRepository.findOne({ 
            where: { user: { userId: userId }, date: today } 
        });

        if (usage) {
            usage.usageCount += 1;
        } else {
            usage = this.aiUsageLimitRepository.create({
                user: user, 
                date: today,
                usageCount: 1,
            });
        }

        await this.aiUsageLimitRepository.save(usage);

        return true;
    }
}
