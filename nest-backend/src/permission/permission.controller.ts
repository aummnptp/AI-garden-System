import { Controller, Get, Req, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { AiPermissionService } from './permission.service';
import { Permission } from './entities/permission.entity';
import { CreateAiPermissionDto } from './dto/create-permission.dto';
import { UpdateAiPermissionDto } from './dto/update-permission.dto';
import { User } from 'src/user/entities/user.entity';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorator/roles-decoraters';

@Controller('ai-permission')
export class AiPermissionController {
  constructor(private readonly aiPermissionService: AiPermissionService) { }

  @UseGuards(JwtGuard)
  @Post('add')
  async addAiPermission(@Req() req, @Body() data: CreateAiPermissionDto) {
    console.log('Request User:', req.user); // Debug ดูว่า `req.user` มีข้อมูล `id` หรือไม่
    console.log('AI ID (from request body):', data.ai_id);
    if (!req.user || !req.user.userId) {
      throw new Error('User not authenticated or invalid token');
    }

    return this.aiPermissionService.create(data, req.user.userId);
  }

  @UseGuards(JwtGuard)
  @Post('add-bulk')
  async addBulkPermissions(@Req() req, @Body() data: CreateAiPermissionDto[]) {
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('User not authenticated');
    }
    return this.aiPermissionService.createBulk(data, req.user.userId);
  }



  @Get()
  findAll() {
    return this.aiPermissionService.findAll();
  }

  @Get('/detail')
  findAllWithDetails() {
    return this.aiPermissionService.findAllWithDetails();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.aiPermissionService.findOne(id);
  }



  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateAiPermissionDto: UpdateAiPermissionDto,
  ) {
    return this.aiPermissionService.update(id, updateAiPermissionDto);
  }

  @Patch(':id/approve')
  async approve(@Param('id') id: number) {
    return this.aiPermissionService.approvePermission(id);
  }



  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Delete('remove-bulk')
  async removeBulk(@Req() req, @Body() data: { ids: number[] }) {
    console.log('IDs to remove:', data.ids);  // ตรวจสอบค่าที่ส่งมา
    if (!req.user || !req.user.userId) {
      throw new Error('User not authenticated or invalid token');
    }

    return this.aiPermissionService.removeBulk(data.ids);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.aiPermissionService.delete(id);
  }


}
