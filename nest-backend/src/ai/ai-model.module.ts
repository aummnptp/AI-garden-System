import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIModel } from './entities/ai-model.entity';
import { AIModelService } from './ai-model.service';
import { AIModelController } from './ai-model.controller';
import { AISettingModule } from 'src/ai-setting/ai-setting.module';
import { AIUsageLimitGuard } from 'src/ai-setting/guards/ai-usage-limit.guard';
import { AIUsageLimit } from 'src/ai-setting/entities/ai-usage-limit.entity';
import { AISetting } from 'src/ai-setting/entities/ai-setting.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AIModel,AIUsageLimit,AISetting,User]) ],
  controllers: [AIModelController],
  providers: [AIModelService, AIUsageLimitGuard],
})
export class AIModelModule {}
