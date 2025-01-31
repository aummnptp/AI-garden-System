import { IsString, IsOptional, IsArray, IsInt, IsEmail, IsNumber, IsUUID } from 'class-validator';

export class CreateWorkspaceDto {

    @IsString()
    readonly name: string;
    @IsOptional()
    @IsString()
    readonly description?: string;
    // @IsUUID()
    readonly createdById: string;

    // readonly member: string;
}
