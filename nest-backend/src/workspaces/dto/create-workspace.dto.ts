import { IsString, IsOptional, IsArray, IsInt, IsEmail, IsNumber } from 'class-validator';

export class CreateWorkspaceDto {

    @IsString()
    readonly name: string;
    @IsOptional()
    @IsString()
    readonly description?: string;
    @IsNumber()
    readonly createById: number;

    // readonly member: string;
}
