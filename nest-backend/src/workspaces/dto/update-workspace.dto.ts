import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkspaceDto } from './create-workspace.dto';
import { isString } from 'util';

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {

    readonly name?: string;

    readonly description?: string;

    // readonly members?: string[];
}

