import {
    Controller,
    Post,
    Body,
    Param,
    UploadedFile,
    UseInterceptors,
    Get,
    Request,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { AIModelService } from './ai-model.service';
import { CreateAIModelDto } from './dto/create-ai-model.dto';
  
  @Controller('ai-models')
  export class AIModelController {
    constructor(private readonly aiModelService: AIModelService) {}
  
    
    @Post('add')
    @UseInterceptors(FileInterceptor('file'))
    async addModel(@UploadedFile() file: Express.Multer.File, @Body() createAIModelDto: CreateAIModelDto):Promise<any> {     
      const message = await this.aiModelService.addModel(createAIModelDto, file);
      return { message };
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
    async predict(@Param('id') id: number,@UploadedFile() file: Express.Multer.File,): Promise<any> {
      return this.aiModelService.predict(id, file);
    }
  }
  