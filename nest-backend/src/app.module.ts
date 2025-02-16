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


import { Permission } from './permission/entities/permission.entity';
import { AiPermissionModule } from './permission/permission.module';
import { AIModel } from './ai/entities/ai-model.entity';
import { AIModelModule } from './ai/ai-model.module';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsModule } from './projects/projects.module';
import { WorkspaceMember } from './workspaces/entities/workspace-member.entity';
import typeorm from './config/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/role.guard';
import { DocsController } from './docs/docs.controller';

import { DocsService } from './docs/docs.service';
import { DocsModule } from './docs/docs.module';
import { AISettingModule } from './ai-setting/ai-setting.module';
import {  NoteModule } from './note_history/note.module';


//@Module({
  //imports: [
    //ConfigModule.forRoot({isGlobal:true}),
    //TypeOrmModule.forRoot({
      //type: 'postgres',
      //host: process.env.POSTGRES_HOST,
      //port: parseInt(<string>process.env.POSTGRES_PORT),
      //username: process.env.POSTGRES_USER,
      //password: process.env.POSTGRES_PASSWORD,
      //database: process.env.POSTGRES_DATABASE,
      //entities: [User, Workspace, AIModel, Permission], // เพิ่ม AIModel ที่นี่
      //synchronize: true, // ปิดในการใช้งาน production
      //logging: true,

// import { InvitationModule } from './invitation/invitation.module';

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
    WorkspacesModule,
    AuthModule,
    UserModule,
    AIModelModule,
    ProjectsModule,
    DocsModule,
    AISettingModule,
    AiPermissionModule,
    NoteModule,
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