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
import { AIModel } from './ai/entities/ai-model.entity';
import { AIModelModule } from './ai/ai-model.module';




@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string> process.env.POSTGRES_PORT),
      password: process.env.POSTGRES_PASSWORD,
      username: process.env.POSTGRES_USER,
      entities:[User,Workspace,AIModel],
      // autoLoadEntities: true,
      database: process.env.POSTGRES_DATABASE,
      synchronize: true, // อย่าลืมปิดในการใช้งาน production
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