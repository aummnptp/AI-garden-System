import { IsString, IsUUID, } from "class-validator";

export class ChangeRoleDto {
    @IsUUID()
    readonly memberId:string;
    @IsString()
    readonly role: 'owner' | 'member';

}