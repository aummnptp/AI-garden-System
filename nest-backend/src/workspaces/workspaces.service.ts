import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { InviteWorkspaceDto } from './dto/InviteWorkspaceDto';
import { WorkspaceInvitations } from './entities/workspace-invitation.entity';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: Repository<WorkspaceMember>,
    @InjectRepository(WorkspaceInvitations)
    private workspaceInvitationsRepository: Repository<WorkspaceInvitations>,
  ) {}

  async create(createWorkspaceDto: CreateWorkspaceDto, userEmail: string): Promise<Workspace> {
    const userProfile = await this.userRepository.findOne({ where: { email: userEmail } });
    if (!userProfile) {
      throw new NotFoundException('User not found');
    }
  
    const newWorkspace = this.workspaceRepository.create({
      ...createWorkspaceDto,
      createByEmail: userEmail,
      members: [
        {
          user: userProfile, // เชื่อมกับ User entity
          role: 'owner', // กำหนด role เริ่มต้นเป็น 'owner'
        },
      ],
    });
  
    return this.workspaceRepository.save(newWorkspace);
  }
  // อ่าน workspace ทั้งหมด
  findAll(): Promise<Workspace[]> {
    return this.workspaceRepository.find();
  }

  // อ่าน workspace ตาม id
  findOne(workspaceId: number): Promise<Workspace | null> {
    return this.workspaceRepository.findOneBy({ id:workspaceId });
  }

  
  // ลบ workspace
  remove(workspaceId: number): Promise<void> {
    return this.workspaceRepository.delete(workspaceId).then(() => undefined);
  }
  
  // อัปเดต workspace
  update(workspaceId: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.workspaceRepository.update(workspaceId, updateWorkspaceDto);
  }


  async addMember(workspaceId: number, email: string, role: string): Promise<WorkspaceMember> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
      relations: ['members'],
    });
    if (!workspace) throw new NotFoundException('Workspace not found');
  
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
  
    if (!workspace.members) {
      workspace.members = [];
    }

    const isAlreadyMember = workspace.members.some((member) =>member.user && member.user.id === user.id);
    if (isAlreadyMember) throw new ConflictException('User is already a member');
  
    const newMember = this.workspaceMemberRepository.create({
      workspace,
      user, // เชื่อมกับ User entity
      role,
    });
  
    return this.workspaceMemberRepository.save(newMember);
  }

  async removeMember(workspaceId: number, email: string): Promise<WorkspaceMember> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
  
    const member = await this.workspaceMemberRepository.findOne({
      where: { workspace: { id: workspaceId }, user: { id: user.id } },
      relations: ['workspace', 'user'],
    });
    if (!member) throw new NotFoundException('Member not found in the workspace');
  
    return this.workspaceMemberRepository.remove(member);
  }



  // async getMembersProfiles(workspaceId: number): Promise<User[]> {
  //   const workspace = await this.workspaceRepository.findOne({ where: { id: workspaceId } });

  //   if (!workspace) {
  //     throw new NotFoundException('Workspace not found');
  //   }

  //   // ดึงเฉพาะ email จาก members
  //   const memberEmails = workspace.members.map(member => member.email);

  //   // ดึงข้อมูลโปรไฟล์ของสมาชิกทั้งหมดที่มี email ใน memberEmails
  //   const membersProfiles = await this.userRepository.find({
  //     where: { email: In(memberEmails) },
  //   });

  //   // รวมข้อมูลโปรไฟล์กับ role
  //   const profilesWithRoles = membersProfiles.map(profile => {
  //     const memberData = workspace.members.find(member => member.email === profile.email);
  //     return {
  //       ...profile,
  //       role: memberData ? memberData.role : null, // เพิ่ม role ของสมาชิก
  //     };
  //   });

  //   return profilesWithRoles;
  // }


  async getMembersProfiles(workspaceId: number): Promise<WorkspaceMember[]> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
      relations: ['members'], // โหลดสมาชิกด้วย
    });
  
    if (!workspace) throw new NotFoundException('Workspace not found');
    return workspace.members;
  }


  async pendingInvite(workspaceId: number, inviteWorkspaceDto: InviteWorkspaceDto): Promise<WorkspaceInvitations> {
    const { email, invitedById } = inviteWorkspaceDto;

    // ตรวจสอบว่า Workspace มีอยู่
    const workspace = await this.workspaceRepository.findOne({ where: { id: workspaceId } });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // ตรวจสอบว่า User ที่ถูกเชิญมีอยู่
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // ตรวจสอบว่า User ที่ส่งคำเชิญมีอยู่
    const invitedBy = await this.userRepository.findOne({ where: { id: invitedById } });
    if (!invitedBy) {
      throw new NotFoundException('Inviter not found');
    }

    // สร้างคำเชิญ
    const invitation = this.workspaceInvitationsRepository.create({
      workspace,
      user,
      invitedBy,
      status: 'pending',
    });

    return this.workspaceInvitationsRepository.save(invitation);
  }



  async acceptInvitation(invitationId: number, userId: number): Promise<WorkspaceMember> {
    // ตรวจสอบคำเชิญ
    const invitation = await this.workspaceInvitationsRepository.findOne({
      where: { id: invitationId },
      relations: ['workspace', 'user'],
    });
  
    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }
  
    if (invitation.status !== 'pending') {
      throw new BadRequestException('Invitation is not pending');
    }
  
    if (invitation.user.id !== userId) {
      throw new BadRequestException('User is not authorized to accept this invitation');
    }
  
    // อัปเดตสถานะคำเชิญเป็น accepted
    invitation.status = 'accepted';
    await this.workspaceInvitationsRepository.save(invitation);
  
    // เพิ่มสมาชิกเข้า Workspace
    const newMember = this.workspaceMemberRepository.create({
      workspace: { id: invitation.workspace.id } as Workspace, // ใช้ id เท่านั้น
      user: { id: invitation.user.id } as User, // ใช้ id เท่านั้น
      role: 'member',
    });
  
    return this.workspaceMemberRepository.save(newMember);
  }
  
}
