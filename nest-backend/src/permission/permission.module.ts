import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiPermissionService } from './permission.service';
import { AiPermissionController } from './permission.controller';
import { Permission } from './entities/permission.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), TypeOrmModule.forFeature([User]),],
  providers: [AiPermissionService],
  controllers: [AiPermissionController],
})
export class AiPermissionModule {}
