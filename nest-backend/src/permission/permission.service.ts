import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreateAiPermissionDto } from './dto/create-permission.dto';
import { UpdateAiPermissionDto } from './dto/update-permission.dto';
import { User } from 'src/user/entities/user.entity'; // Import entity ของผู้ใช้

@Injectable()
export class AiPermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly aiPermissionRepository: Repository<Permission>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Inject repository ของผู้ใช้
  ) {}

  // ฟังก์ชันสร้าง Permission
  async create(data: CreateAiPermissionDto, id: string) {
    // ตรวจสอบว่าผู้ใช้มีอยู่ในระบบ
    const user = await this.userRepository.findOne({ where: { userId: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // สร้าง Permission ใหม่
    const newPermission = this.aiPermissionRepository.create({
      ...data,
      user_id: id,
      ai_id: data.ai_id,
      approve: false, // ใช้ user ID จากผู้ใช้ที่ตรวจสอบแล้ว
    });

    // บันทึกข้อมูลลงฐานข้อมูล
    return this.aiPermissionRepository.save(newPermission);
  }

  async createBulk(data: CreateAiPermissionDto[], userId: string) {
    const permissions = data.map((item) =>
      this.aiPermissionRepository.create({
        ...item,
        user_id: userId,
        approve: true,
      })
    );
    return this.aiPermissionRepository.save(permissions);
  }

  
  async findAll() {
    return this.aiPermissionRepository.find();
  }

  async findAllWithDetails() {
    return this.aiPermissionRepository.find({
      where: {
        approve: false, // เพิ่มเงื่อนไขเพื่อเลือกเฉพาะ approve ที่เป็น false
    },
      relations: ['user', 'aiModel'], // ระบุความสัมพันธ์กับ user และ ai
    });
  }

  async findOne(id: string) {
    return this.aiPermissionRepository.findOne({ where: { id } });
  }

  async findByUserId(userId: string) {
    return this.aiPermissionRepository.find({ where: { user_id: userId } });
  }


  async update(id: string, data: UpdateAiPermissionDto) {
    await this.aiPermissionRepository.update(id, data);
    return this.aiPermissionRepository.findOne({ where: { id } });
  }

  async approvePermission(id: string): Promise<Permission> {
    // อัปเดตฟิลด์ approve เป็น true
    const result = await this.aiPermissionRepository.update(id, { approve: true });
  
    // ตรวจสอบว่ามีเรคคอร์ดที่อัปเดตสำเร็จหรือไม่
    if (result.affected === 0) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
  
    // ดึงข้อมูลเรคคอร์ดที่อัปเดตกลับมา
    return this.aiPermissionRepository.findOne({ where: { id } });
  }

  async delete(id: string) {
    return this.aiPermissionRepository.delete(id);
  }

  async removeBulk(ids: string[]): Promise<{ deletedCount: number }> {
    
    // ใช้ query builder แทน delete เฉยๆ เพื่อให้แน่ใจว่า query ทำงานได้ถูกต้อง
    const deleteResult = await this.aiPermissionRepository
      .createQueryBuilder()
      .delete()
      .from(Permission)  // เช็คว่า AiPermission เป็น entity ที่ถูกต้อง
      .where('id IN (:...ids)', { ids })  // ใช้ IN เพื่อกรองโดย id
      .execute();
  
    if (deleteResult.affected === 0) {
      throw new NotFoundException('No permissions were deleted.');
    }
  
    return { deletedCount: deleteResult.affected };  // ส่งกลับจำนวนข้อมูลที่ถูกลบ
  }

  async countApprovedPermissionsByUserId(userId: string): Promise<number> {
    // นับจำนวน AI ที่ user มีสิทธิ์ใช้งาน (approve = true)
    const count = await this.aiPermissionRepository.count({
      where: { user_id: userId, approve: true },
    });
    return count;
  }

  async deleteByUserAndAiId(userId: string, aiId: string): Promise<void> {
    const permission = await this.aiPermissionRepository.findOne({
        where: { user_id: userId, ai_id: aiId },
    });

    if (!permission) {
        throw new NotFoundException("Permission not found");
    }

    await this.aiPermissionRepository.remove(permission);
}

  
}
