import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { In, Not, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { InviteWorkspaceDto } from './dto/InviteWorkspaceDto';
import { WorkspaceInvitation } from './entities/workspace-invitation.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: Repository<WorkspaceMember>,
    @InjectRepository(WorkspaceInvitation)
    private workspaceInvitationsRepository: Repository<WorkspaceInvitation>,
  ){}

  async create(createWorkspaceDto: CreateWorkspaceDto, userId: string): Promise<Workspace> {
    const userProfile = await this.userRepository.findOne({ where: { userId: userId } });
    if (!userProfile) {
      throw new NotFoundException('User not found');
    }
    const newWorkspace = this.workspaceRepository.create({
      ...createWorkspaceDto,
      createdById: userId,
      members: [
        {
          user: userProfile, // เชื่อมกับ User entity
          role: 'owner', // กำหนด role เริ่มต้นเป็น 'owner'
        },
      ],
    });
    return this.workspaceRepository.save(newWorkspace);
  }

  findAll(): Promise<Workspace[]> {
    return this.workspaceRepository.find();
  }

  findOne(workspaceId: string): Promise<Workspace | null> {
    return this.workspaceRepository.findOneBy({ workspaceId: workspaceId });
  }

  findWithUserId(userId: string): Promise<Workspace[]> {
    return this.workspaceRepository.find({ where: { createdById: userId } });
  }

  remove(workspaceId: string): Promise<void> {
    return this.workspaceRepository.delete(workspaceId).then(() => undefined);
  }

  update(workspaceId: string, updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.workspaceRepository.update(workspaceId, updateWorkspaceDto);
  }

  async addMember(workspaceId: string, userId: string, role: string): Promise<WorkspaceMember> {
    const workspace = await this.workspaceRepository.findOne({
      where: { workspaceId: workspaceId },
      relations: ['members'],
    });
  
    if (!workspace) throw new NotFoundException('Workspace not found');
  
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) throw new NotFoundException('User not found');
  
    if (workspace.members?.some((member) => member.user?.userId === user.userId)) {
      throw new ConflictException('User is already a member');
    }
  
    const newMember = this.workspaceMemberRepository.create({
      workspace,
      user,
      role,
    });
  
    return this.workspaceMemberRepository.save(newMember);
  }

  async removeMember(workspaceId: string, userId: string): Promise<void> {
    // ตรวจสอบว่ามี Workspace หรือไม่
    const workspace = await this.workspaceRepository.findOne({
      where: { workspaceId },
    });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }
    // ตรวจสอบว่าผู้ใช้ที่พยายามลบเป็นผู้สร้างหรือไม่
    if (workspace.createdById === userId) {
      throw new BadRequestException('Cannot remove the creator of the workspace');
    }
    // ตรวจสอบว่าสมาชิกอยู่ใน Workspace หรือไม่
    const member = await this.workspaceMemberRepository.findOne({
      where: {
        workspace: { workspaceId },
        user: { userId },
      },
      relations: ['workspace', 'user'],
    });

    if (!member) {
      throw new NotFoundException('User is not a member of this workspace');
    }
    await this.workspaceMemberRepository.remove(member);
  }

  async getMembersProfiles(workspaceId: string): Promise<WorkspaceMember[]> {
    const workspace = await this.workspaceRepository.findOne({
      where: { workspaceId: workspaceId },
      relations: ['members'], // โหลดสมาชิกด้วย
    });
    if (!workspace) throw new NotFoundException('Workspace not found');
    const creator = workspace.members.find(member => member.user.userId === workspace.createdById);
    if (creator) {
      // ลบ creator ออกจากสมาชิกแล้วเพิ่มเขากลับไปที่ตำแหน่งแรก
      const membersWithoutCreator = workspace.members.filter(member => member.user.userId !== workspace.createdById);
      return [creator, ...membersWithoutCreator];
    }
    return workspace.members;
  }

  async getNonMembersProfiles(workspaceId: string): Promise<User[]> {
    const allUsers = await this.userRepository.find();
    const members = await this.workspaceMemberRepository.find({
      where: { workspace: { workspaceId: workspaceId } },
      relations: ['user'],
    });
    const memberIds = members.map(member => member.user.userId);
    const pendingInvitations = await this.workspaceInvitationsRepository.find({
      where: {
        workspace: { workspaceId },
        status: In(['pending', 'rejected']),
      },
      relations: ['user'],
    });
    const pendingUserIds = pendingInvitations.map(invitation => invitation.user.userId);
    const nonMembers = allUsers.filter(user =>
      !memberIds.includes(user.userId) && !pendingUserIds.includes(user.userId)
    );
    return nonMembers;
  }

  async getPendingUserList(workspaceId: string): Promise<WorkspaceInvitation[]> {
    const invitations = await this.workspaceInvitationsRepository.find({
      where: {
        workspace: { workspaceId },
        status: "pending"// ตรวจสอบคำเชิญที่เชื่อมกับ workspaceId ที่กำหนด
      },
      relations: ['workspace', 'user', 'invitedBy'], // โหลดข้อมูล workspace, user และ invitedBy
    });
    return invitations;
  }

  async pendingInvite(workspaceId: string, userId: string, email: string,)
    : Promise<WorkspaceInvitation | { error: string }> {
    const userProfile = await this.userRepository.findOne({ where: { userId: userId } });
    const workspace = await this.workspaceRepository.findOne({ where: { workspaceId } });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    const invitedBy = await this.userRepository.findOne({ where: { userId: userId } });
    if (!invitedBy) {
      throw new NotFoundException('Inviter not found');
    }
    if (user.userId === userId) {
      throw new BadRequestException('Inviter and invitee cannot be the same user');
    }
    const existingInvitation = await this.workspaceInvitationsRepository.findOne({
      where: {
        workspace: { workspaceId },
        user: { userId: user.userId },
        status: 'pending', // ตรวจสอบเฉพาะสถานะคำเชิญที่ยังค้างอยู่
      },
    });
    if (existingInvitation) {
      throw new ConflictException('This user has already been invited to this workspace');
    }
    const invitation = this.workspaceInvitationsRepository.create({
      workspace,
      user,
      invitedBy,
      status: 'pending',
    });
    return this.workspaceInvitationsRepository.save(invitation);
  }

  async cancelPendingInvite(inviteId: string): Promise<void> {
    const invitation = await this.workspaceInvitationsRepository.findOne({
      where: { inviteId },
      relations: ['workspace'],
    });
    if (!invitation) {
      throw new NotFoundException(`Invitation with id ${inviteId} not found`);
    }
    await this.workspaceInvitationsRepository.remove(invitation);
  }

  async acceptInvitation(invitationId: string, userId: string): Promise<WorkspaceMember> {
    const invitation = await this.workspaceInvitationsRepository.findOne({
      where: { inviteId: invitationId },
      relations: ['workspace', 'user'],
    });
    if (invitation.user.userId !== userId) {
      throw new BadRequestException('User is not authorized to accept this invitation');
    }
    const newMember = this.workspaceMemberRepository.create({
      workspace: { workspaceId: invitation.workspace.workspaceId } as Workspace, // ใช้ id เท่านั้น
      user: { userId: invitation.user.userId } as User, // ใช้ id เท่านั้น
      role: 'member',
    });
    await this.workspaceMemberRepository.save(newMember);
    await this.workspaceInvitationsRepository.remove(invitation);
    return newMember
  }


  async rejectInvitation(invitationId: string, userId: string): Promise<void> {
    const invitation = await this.workspaceInvitationsRepository.findOne({
      where: { inviteId: invitationId },
      relations: ['workspace', 'user'],
    });
    if (invitation.user.userId !== userId) {
      throw new BadRequestException('User is not authorized to reject this invitation');
    }
    await this.workspaceInvitationsRepository.remove(invitation);
  }


  async getWorkspaceWithMembers(workspaceId: string) {
    return this.workspaceRepository.findOne({
      where: { workspaceId: workspaceId },
      relations: ['members', 'members.user', 'invitations'], // Join ตารางที่ต้องการ
    });
  }

  async getAllMembersInWorkspace(workspaceId: string) {
    return this.workspaceMemberRepository.find({
      where: { workspace: { workspaceId: workspaceId } },
      relations: ['user', 'workspace'], // Join ตาราง User และ Workspace
    });
  }

  async getAllWorkspaceWithMembers(userId: string): Promise<Workspace[]> {
    const workspaces = await this.workspaceRepository.find(
      {
        where: { createdById: userId },
        relations: ['members', 'members.user',], // Join ตารางที่ต้องการ
      });
    if (!workspaces) {
      throw new NotFoundException('Workspace not found');
    }
    return workspaces;
  }

  async getWorkspacesWhereUserIsMember(userId: string): Promise<Workspace[]> {
    const workspaces = await this.workspaceRepository.find({
      where: {
        createdById: Not(userId), // ผู้ใช้งานไม่ใช่คนสร้าง
      },
      relations: ['members', 'members.user'], // Join ตารางที่ต้องการ
    });
    const workspacesUserIsMember =
      workspaces.filter(workspace => workspace.members.some(member => member.user.userId === userId));
    return workspacesUserIsMember;
  }

  async getWorkspaceWithMembersByUserId(userId: string): Promise<Workspace[]> {
    const workspaces = await this.workspaceRepository.find(
      {
        where: { createdById: userId },
        relations: ['members', 'members.user',], // Join ตารางที่ต้องการ
      });
    if (!workspaces) {
      throw new NotFoundException('Workspace not found');
    }
    return workspaces;
  }

  async changeUserRole(
    workspaceId: string,
    memberId: string,
    role: 'owner' | 'member'
  ): Promise<WorkspaceMember> {
    const workspace = await this.workspaceRepository.findOne({ where: { workspaceId } });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }
    const member = await this.workspaceMemberRepository.findOne({
      where: { memberId, workspace: { workspaceId } },
      relations: ['user'],
    });
    if (!member) {
      throw new NotFoundException('Member not found in workspace');
    }
    if (member.role === 'owner' && role === 'member') {
      const ownersCount = await this.workspaceMemberRepository.count({
        where: { workspace: { workspaceId }, role: 'owner' }
      });
      if (ownersCount <= 1) {
        throw new ForbiddenException('Cannot remove the last owner.');
      }
    }
    member.role = role;
    return this.workspaceMemberRepository.save(member);
  }

  async getMyInvitation(userId: string) {
    return this.workspaceInvitationsRepository.find({
      where: {
        user: { userId: userId },
        status: 'pending',
      },
      relations: ['workspace', 'invitedBy'],
    });
  }

  async getWorkspaceMember(workspaceId: string, userId: string): Promise<WorkspaceMember | null> {
    return await this.workspaceMemberRepository.findOne({
      where: {
        workspace: { workspaceId: workspaceId },
        user: { userId: userId },
      },
      relations: ['workspace', 'user'],
    });
  }

  async generateInviteLink(workspaceId: string, inviterId: string): Promise<string> {
    const secret = process.env.INVITE_SECRET 
  
    const token = jwt.sign({ workspaceId, inviterId }, secret, { expiresIn: '7d' });
  
    return `${process.env.REACT_APP_API_URL}/invite?token=${token}`;
  }

  async validateInviteToken(token: string): Promise<{ workspaceId: string }> {
    const secret = process.env.INVITE_SECRET
    try {
      const payload = jwt.verify(token, secret) as { workspaceId: string };
      return { workspaceId: payload.workspaceId };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired invite link');
    }
  }

  async joinWorkspaceWithToken(token: string, userId: string): Promise<{ message: string }> {
    const secret = process.env.INVITE_SECRET 
    try {
      console.log("Joining workspace with token:", token);
      const { workspaceId } = jwt.verify(token, secret) as { workspaceId: string };
      const workspace = await this.workspaceRepository.findOne({ where: { workspaceId } });
      if (!workspace) throw new NotFoundException('Workspace not found');
      const existingMember = await this.workspaceMemberRepository.findOne({
        where: { workspace: { workspaceId }, user: { userId } }
      });
  
      if (existingMember) {
        return { message: 'You are already a member of this workspace.' };
      }
  
      await this.workspaceMemberRepository.save({
        workspace,
        user: await this.userRepository.findOne({ where: { userId } }),
        role: 'member',
      });
  
      return { message: 'Successfully joined the workspace' };
    } catch (error) {
      console.error("Join workspace failed:", error);
      throw new UnauthorizedException('Invalid or expired invite link');
    }
  }
}
