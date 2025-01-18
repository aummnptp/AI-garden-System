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
import { DocsController } from './docs/docs.controller';

import { DocsService } from './docs/docs.service';
import { DocsModule } from './docs/docs.module';





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