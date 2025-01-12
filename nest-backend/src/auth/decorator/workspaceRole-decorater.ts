import { SetMetadata } from '@nestjs/common';

export const WorkspaceRole = (role: string) => SetMetadata('workspaceRole', role);