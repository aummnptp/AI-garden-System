import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

// export class InviteWorkspaceDto {
//   @IsEmail()
//   email: string; // Email ของผู้ที่ถูกเชิญ

//   // @IsNotEmpty()
//   // status: string; // pending | accepted | rejected
//   // @IsNumber()
//   // invitedById: number; // ID ของผู้ส่งคำเชิญ
// }
export class InviteWorkspaceDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsEmail({}, { each: true })
  emails: string[];
}

export class AcceptInvitationDto {
  @IsUUID()
  userId: string;
}