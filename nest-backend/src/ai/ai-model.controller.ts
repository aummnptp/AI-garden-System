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
  @Patch(':id/update-ai')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.diskStorage({
      destination: './uploads', // กำหนดโฟลเดอร์เก็บรูปภาพ
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      },
    }),
  }))
  async updateAI(@Param('id') id: string, @Body() updateAIModelDto: UpdateAIModelDto, @UploadedFile() file: Express.Multer.File): Promise<string> {
    const message = await this.aiModelService.update(+id, updateAIModelDto, file);
    return message;
  }


  @Get()
  findAll() {
    return this.aiModelService.findAll();
  }

  @Get('/with_permission')
  findAllWithDetails() {
    return this.aiModelService.findAllWithDetails();
  }

  // แสดงในหน้า user detail จัดการสิทธิ์
  @Get(':userId/models')
  async getAllAiModelsWithStatus(@Param('userId') userId: number) {
    const models = await this.aiModelService.findAllWithApprovalStatus(userId);
    return models;
  }


  @UseGuards(JwtGuard)
  @Get('/my_approved')
  async getMyApproved(@Request() req,) {
    const userId = req.user.userId;
    return this.aiModelService.getMyApproved(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiModelService.findOne(+id);
  }


  // @UseGuards(JwtGuard) 
  @Post('predict/:id')
  @UseInterceptors(FileInterceptor('file'))
  async predict(@Param('id') id: number, @UploadedFile() file: Express.Multer.File,): Promise<any> {
    return this.aiModelService.predict(+id, file);
  }


  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id/remove-ai')
  async removeAI(@Param('id') id: string) {
    return this.aiModelService.remove(+id);
  }

  @Get('approved/:userId')
  async getApprovedAiModels(@Param('userId') userId: number) {
    return this.aiModelService.getApprovedAiModelsByUserId(userId);
  }




}

