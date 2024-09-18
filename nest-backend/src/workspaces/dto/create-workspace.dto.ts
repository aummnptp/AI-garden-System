import { IsString, IsOptional, IsArray, IsInt, IsEmail } from 'class-validator';

export class CreateWorkspaceDto {

    @IsString()
    readonly name: string;
    @IsOptional()
    @IsString()
    readonly description?: string;
    @IsEmail()
    readonly createByEmail: string;

    // readonly member: string;
}
