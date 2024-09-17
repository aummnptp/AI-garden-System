import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    
  ) {}

  create(createWorkspaceDto: CreateWorkspaceDto, userEmail: string): Promise<Workspace> {
    const newWorkspace = this.workspaceRepository.create({
      ...createWorkspaceDto,
      createByEmail: userEmail, // เพิ่มค่าผู้ใช้ที่สร้าง workspace
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

  // อัปเดต workspace
  update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.workspaceRepository.update(id, updateWorkspaceDto);
  }

  // ลบ workspace
  remove(id: number): Promise<void> {
    return this.workspaceRepository.delete(id).then(() => undefined);
  }
}
