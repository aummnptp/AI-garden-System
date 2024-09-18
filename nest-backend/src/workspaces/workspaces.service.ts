import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createWorkspaceDto: CreateWorkspaceDto, userEmail: string): Promise<Workspace> {
    const userProfile = await this.userRepository.findOne({ where: { email: userEmail } });
    if (!userProfile) {
      throw new Error('User not found');
    }
    const newWorkspace = this.workspaceRepository.create({
      ...createWorkspaceDto,
      createByEmail: userEmail,
      members: [{
        email: userEmail,
        // profile: userProfile, // เก็บข้อมูลโปรไฟล์ทั้งหมดของผู้สร้าง
        role: 'owner', // กำหนด role เริ่มต้นเป็น 'owner'
      }],
    });
    return this.workspaceRepository.save(newWorkspace);
  }

  // อ่าน workspace ทั้งหมด
  findAll(): Promise<Workspace[]> {
    return this.workspaceRepository.find();
  }

  // อ่าน workspace ตาม id
  findOne(id: number): Promise<Workspace | null> {
    return this.workspaceRepository.findOneBy({ id });
  }

  
  // ลบ workspace
  remove(id: number): Promise<void> {
    return this.workspaceRepository.delete(id).then(() => undefined);
  }
  
  // อัปเดต workspace
  update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.workspaceRepository.update(id, updateWorkspaceDto);
  }



  async addMember(id: number, userEmail: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({ where: { id } });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }
    // ตรวจสอบว่าผู้ใช้อยู่ในระบบหรือไม่
    const userProfile = await this.userRepository.findOne({ where: { email: userEmail } });
    if (!userProfile) {
      throw new NotFoundException('User not found');
    }
    // ตรวจสอบว่าผู้ใช้ยังไม่เป็นสมาชิกอยู่แล้ว
    const isMember = workspace.members.some(member => member.email === userEmail);
    if (isMember) {
      throw new BadRequestException('User is already a member');
    }
    workspace.members.push({
      email: userEmail,
      // profile: userProfile, // เก็บข้อมูลโปรไฟล์ทั้งหมด
      role: 'member', // กำหนด role เริ่มต้นเป็น 'member'
    });
    return this.workspaceRepository.save(workspace); // บันทึกการเปลี่ยนแปลง
  }

  async removeMember(id: number, userEmail: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({ where: { id } });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }
    // ตรวจสอบว่าผู้ใช้อยู่ใน members
    const memberIndex = workspace.members.findIndex(member => member.email === userEmail);
    if (memberIndex === -1) {
      throw new Error('User is not a member of this workspace');
    }
    // ลบผู้ใช้จาก members
    workspace.members.splice(memberIndex, 1);
    return this.workspaceRepository.save(workspace); // บันทึกการเปลี่ยนแปลง
  }


  async getMembersProfiles(workspaceId: number): Promise<User[]> {
    const workspace = await this.workspaceRepository.findOne({ where: { id: workspaceId } });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // ดึงเฉพาะ email จาก members
    const memberEmails = workspace.members.map(member => member.email);

    // ดึงข้อมูลโปรไฟล์ของสมาชิกทั้งหมดที่มี email ใน memberEmails
    const membersProfiles = await this.userRepository.find({
      where: { email: In(memberEmails) },
    });

    // รวมข้อมูลโปรไฟล์กับ role
    const profilesWithRoles = membersProfiles.map(profile => {
      const memberData = workspace.members.find(member => member.email === profile.email);
      return {
        ...profile,
        role: memberData ? memberData.role : null, // เพิ่ม role ของสมาชิก
      };
    });

    return profilesWithRoles;
  }

}
