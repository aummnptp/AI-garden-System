import { Controller, Get, Req, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AiPermissionService } from './permission.service';
import { Permission } from './entities/permission.entity';
import { CreateAiPermissionDto } from './dto/create-permission.dto';
import { UpdateAiPermissionDto } from './dto/update-permission.dto';
import { User } from 'src/user/entities/user.entity';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('ai-permission')
export class AiPermissionController {
  constructor(private readonly aiPermissionService: AiPermissionService) {}

  @UseGuards(JwtGuard)
  @Post('add')
  async addAiPermission(@Req() req, @Body() data: CreateAiPermissionDto) {
    console.log('Request User:', req.user); // Debug ดูว่า `req.user` มีข้อมูล `id` หรือไม่
    console.log('AI ID (from request body):', data.ai_id);
    if (!req.user || !req.user.id) {
      throw new Error('User not authenticated or invalid token');
    }
  
    return this.aiPermissionService.create(data, req.user.id);
  }
  

  @Get()
  findAll() {
    return this.aiPermissionService.findAll();
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

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.aiPermissionService.delete(id);
  }
}
