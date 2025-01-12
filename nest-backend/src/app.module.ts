import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Workspace } from './workspaces/entities/workspace.entity';
// import { InvitationModule } from './invitation/invitation.module';
import { AIModel } from './ai/entities/ai-model.entity';
import { AIModelModule } from './ai/ai-model.module';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsModule } from './projects/projects.module';
import { WorkspaceMember } from './workspaces/entities/workspace-member.entity';
import typeorm from './config/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/role.guard';




@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (configService.get('typeorm'))
      
    }),

    // ConfigModule.forRoot({isGlobal:true}),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.POSTGRES_HOST,
    //   port: parseInt(<string> process.env.POSTGRES_PORT),
    //   password: process.env.POSTGRES_PASSWORD,
    //   username: process.env.POSTGRES_USER,
    //   // entities:[User,Workspace,AIModel,WorkspaceMember],
    //   autoLoadEntities: true,
    //   database: process.env.POSTGRES_DATABASE,
    //   synchronize: true, // อย่าลืมปิดในการใช้งาน production
    //   logging: true,
    // }),
    WorkspacesModule,
    AuthModule,
    UserModule,
    // InvitationModule
    AIModelModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService
    // , {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // }
  ],
})
export class AppModule {}