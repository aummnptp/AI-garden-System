import { PartialType } from '@nestjs/mapped-types';
import { CreateAiPermissionDto } from './create-permission.dto';

export class UpdateAiPermissionDto extends PartialType(CreateAiPermissionDto) {}
