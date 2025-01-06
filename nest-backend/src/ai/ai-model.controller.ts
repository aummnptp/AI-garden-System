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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AIModelService } from './ai-model.service';
import { CreateAIModelDto } from './dto/create-ai-model.dto';
import { AIModel } from './entities/ai-model.entity';
import { UpdateAIModelDto } from './dto/update-ai-model.dto';

@Controller('ai-models')
export class AIModelController {
  constructor(private readonly aiModelService: AIModelService) { }


  @Post('add')
  @UseInterceptors(FileInterceptor('file'))
  async addModel(@UploadedFile() file: Express.Multer.File, @Body() createAIModelDto: CreateAIModelDto): Promise<any> {
    const message = await this.aiModelService.addModel(createAIModelDto, file);
    return { message };
  }

  @Patch(':id/update-ai')
  @UseInterceptors(FileInterceptor('file'))

  async updateAI(@UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Body() updateAIModelDto: UpdateAIModelDto): Promise<any> {
    const message = await this.aiModelService.update(+id, updateAIModelDto);
    return { message };
  }

  @Get()
  findAll() {
    return this.aiModelService.findAll();
  }

  @Get('approved/:userId')
  async getApprovedAiModels(@Param('userId') userId: number) {
    return this.aiModelService.getApprovedAiModelsByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiModelService.findOne(+id);
  }

  @Get()
  // async GetAi(@Body() data: any): Promise<{ message: string }> {
  async GetAi(): Promise<{ message: string }> {
    // const message = await this.aiModelService.addModel(data);
    // return { message };
    return { message: 'Hello world!' };
  }

  @Post('predict/:id')
  @UseInterceptors(FileInterceptor('file'))
  async predict(@Param('id') id: number, @UploadedFile() file: Express.Multer.File,): Promise<any> {
    return this.aiModelService.predict(+id, file);
  }

  @Delete(':id/remove-ai')
  async removeAI(@Param('id') id: string) {
    return this.aiModelService.remove(+id);
  }




}
