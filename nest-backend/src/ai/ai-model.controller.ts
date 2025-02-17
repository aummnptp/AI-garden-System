import {
  Controller,
  Post,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  Get,
  Request,
  Delete,
  Patch,
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AIModelService } from './ai-model.service';
import { CreateAIModelDto } from './dto/create-ai-model.dto';
import { AIModel } from './entities/ai-model.entity';
import { UpdateAIModelDto } from './dto/update-ai-model.dto';
import * as multer from 'multer';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorator/roles-decoraters';
import { AIUsageLimitGuard } from 'src/ai-setting/guards/ai-usage-limit.guard';
import { AIVisibleGuard } from 'src/ai-setting/guards/ai-visible.guard';
import { AIEnableGuard } from 'src/ai-setting/guards/ai-enable.guard';



@Controller('ai-models')
export class AIModelController {
  constructor(private readonly aiModelService: AIModelService) { }


  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Post('add')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.diskStorage({
      destination: './uploads', // กำหนดโฟลเดอร์เก็บรูปภาพ
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      },
    }),
  }))
  async addModel(@UploadedFile() file: Express.Multer.File, @Body() createAIModelDto: CreateAIModelDto): Promise<any> {
    const message = await this.aiModelService.addModel(createAIModelDto, file);
    return { message };
  }


  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(':aiId/update-ai')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.diskStorage({
      destination: './uploads', // กำหนดโฟลเดอร์เก็บไฟล์
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      },
    }),
  }))
  async updateAI(
    @Param('aiId') aiId: string,
    @Body('modelData') modelData: string, // ดึง modelData เป็น string
    @UploadedFile() file: Express.Multer.File // ดึงไฟล์
  ): Promise<string> {
    // Parse JSON string ของ modelData
    const updateAIModelDto: UpdateAIModelDto = JSON.parse(modelData);

    // ส่งไปที่ service พร้อมกับไฟล์
    const message = await this.aiModelService.update(aiId, updateAIModelDto, file);
    return message;
  }

  @UseGuards(JwtGuard )
  @Get("/")
  findAll(
    @Request() req,
    @Query("search") search?: string,
    @Query("type") type?: string,
    @Query("tag") tag?: string,
    ) {
    const isAdmin = req.user?.role === "admin"
    return this.aiModelService.findAll({ search, type, tag }, isAdmin);
  }

  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Get('with_permission')
  findAllWithDetails() {
    return this.aiModelService.findAllWithDetails();
  }

  @UseGuards(JwtGuard)
  @Get('my_approved')
  async getMyApproved(@Request() req,) {
    const userId = req.user.userId;
    return this.aiModelService.getMyApproved(userId);
  }

  @UseGuards(JwtGuard)
  @Get(':aiId')
  findOne(@Param('aiId') aiId: string): Promise<AIModel> {
    return this.aiModelService.findOne(aiId);
  }

  
  @UseGuards(JwtGuard,
   AIEnableGuard,AIVisibleGuard, AIUsageLimitGuard
  )
  @Post('predict/:aiId')
  @UseInterceptors(FileInterceptor('file'))
  async predict(@Request() req,@Param('aiId') aiId: string, @UploadedFile() file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.aiModelService.predict(aiId, file);
  }

  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':aiId/remove-ai')
  async removeAI(@Param('aiId') aiId: string) {
    return this.aiModelService.remove(aiId);
  }



  // แสดงในหน้า user detail จัดการสิทธิ์
  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Get(':userId/models')
  async getAllAiModelsWithStatus(@Param('userId') userId: string) {
    const models = await this.aiModelService.findAllWithApprovalStatus(userId);
    return models;
  }

  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Get('approved/:userId')
  async getApprovedAiModels(@Param('userId') userId: string) {
    return this.aiModelService.getApprovedAiModelsByUserId(userId);
  }

  @Get('/tags/tag-in-system') 
  async getAITags(): Promise<string[]> {
    return this.aiModelService.getUniqueAITags();
  }
}




