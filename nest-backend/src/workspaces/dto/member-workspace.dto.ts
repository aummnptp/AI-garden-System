import { IsString, IsUUID } from "class-validator";

export class InviteWorkspaceDto {
// @IsUUID
    readonly name?: string;
        @IsString()
    readonly role?: string;

}
