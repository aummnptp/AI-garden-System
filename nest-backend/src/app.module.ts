import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Workspace } from './workspaces/entities/workspace.entity';
import { InvitationModule } from './invitation/invitation.module';
import { AIModelModule } from './ai/ai-model.module';
import { AIModel } from './ai/entities/ai-model.entity';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [User, Workspace, AIModel], // เพิ่ม AIModel ที่นี่
      synchronize: true, // ปิดในการใช้งาน production
      logging: true,
    }),
    WorkspacesModule,
    AuthModule,
    UserModule,
    InvitationModule,
    AIModelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}