import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Workspace } from './workspaces/entities/workspace.entity';
import { AIModel } from './ai/entities/ai-model.entity';
import { WorkspaceMember } from './workspaces/entities/workspace-member.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),  // ใช้ Number() แทน parseInt(<string>)
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [User, Workspace, AIModel, WorkspaceMember],
  synchronize: true,
  logging: true,
});