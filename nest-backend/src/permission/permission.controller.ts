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

  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
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

  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/detail')
  findAllWithDetails() {
    return this.aiPermissionService.findAllWithDetails();
  }

  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiPermissionService.findOne(id);
  }

  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAiPermissionDto: UpdateAiPermissionDto,
  ) {
    return this.aiPermissionService.update(id, updateAiPermissionDto);
  }

  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(':id/approve')
  async approve(@Param('id') id: string) {
    return this.aiPermissionService.approvePermission(id);
  }



  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Delete('remove-bulk')
  async removeBulk(@Req() req, @Body() data: { ids: string[] }) {
    console.log('IDs to remove:', data.ids);
    if (!req.user || !req.user.userId) {
      throw new Error('User not authenticated or invalid token');
    }

    return this.aiPermissionService.removeBulk(data.ids);
  }

  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aiPermissionService.delete(id);
  }

  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Get('count-approved/:userId')
  async getApprovedCount(@Param('userId') userId: string) {
    const count = await this.aiPermissionService.countApprovedPermissionsByUserId(userId);
    return { userId, approvedCount: count };
  }

  @Role("admin") // ใช้ Guard เฉพาะ admin
  @UseGuards(JwtGuard, RolesGuard)
  @Delete('/user/:userId/ai/:aiId')
  async removePermissionByUserAndAi(
    @Param('userId') userId: string,
    @Param('aiId') aiId: string
  ) {
    return this.aiPermissionService.deleteByUserAndAiId(userId, aiId);
  }


}
