import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class InviteWorkspaceDto {
  @IsEmail()
  email: string; // Email ของผู้ที่ถูกเชิญ

  @IsNumber()
  invitedById: number; // ID ของผู้ส่งคำเชิญ
}
export class AcceptInvitationDto {
  @IsNumber()
  userId: number;
}