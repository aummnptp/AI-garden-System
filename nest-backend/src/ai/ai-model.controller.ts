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
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      },
    }),
  }))
  async addModel(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body('modelData') modelData: string
  ): Promise<any> {
    try {
      const userId = req.user.userId;
      const parsedModelData = JSON.parse(modelData); 
      const message = await this.aiModelService.addModel(parsedModelData, file, userId);
      return { message };
    } catch (error) {
      console.error("Error parsing modelData:", error);
      throw new BadRequestException("Invalid modelData format");
    }
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
    @Body('modelData') modelData: string,
    @UploadedFile() file: Express.Multer.File 
  ): Promise<string> {
    const updateAIModelDto: UpdateAIModelDto = JSON.parse(modelData);

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
    @Query("approvedOnly") approvedOnly?: boolean,
    ) {
    const isAdmin = req.user?.role === "admin"
    const userId = req.user?.userId; 
    return this.aiModelService.findAll({ search, type, tag }, isAdmin, userId, approvedOnly);
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
    const isAdmin = req.user.role === 'admin'; 
    return this.aiModelService.getMyApproved(userId, isAdmin);
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




