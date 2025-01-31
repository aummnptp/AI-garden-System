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
    constructor(private readonly aiModelService: AIModelService) {}
  
    
    @Role("admin")
    @UseGuards(JwtGuard,RolesGuard)
    @Post('add')
    @UseInterceptors(FileInterceptor('file',{
      storage: multer.diskStorage({
        destination: './uploads', // กำหนดโฟลเดอร์เก็บรูปภาพ
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }))
    async addModel(@UploadedFile() file: Express.Multer.File, @Body() createAIModelDto: CreateAIModelDto):Promise<any> {     
      const message = await this.aiModelService.addModel(createAIModelDto, file);
      return { message };
    } 
    
    // @Role("admin")
    // @UseGuards(JwtGuard,RolesGuard)
    // @Patch(':id/update-ai') 
    // @UseInterceptors(FileInterceptor('file',{
    //   storage: multer.diskStorage({
    //   destination: './uploads', // กำหนดโฟลเดอร์เก็บรูปภาพ
    //   filename: (req, file, cb) => {
    //       const uniqueName = `${Date.now()}-${file.originalname}`;
    //       cb(null, uniqueName);
    //     },
    //   }),
    // }))
    // async updateAI( @Param('id') id:string,@Body() updateAIModelDto: UpdateAIModelDto,@UploadedFile() file: Express.Multer.File):Promise<string>{
    //   const message = await this.aiModelService.update(+id, updateAIModelDto, file );
    //   return message;
    // }
    @Role("admin")
@UseGuards(JwtGuard, RolesGuard)
@Patch(':id/update-ai') 
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
  @Param('id') id: string,
  @Body('modelData') modelData: string, // ดึง modelData เป็น string
  @UploadedFile() file: Express.Multer.File // ดึงไฟล์
): Promise<string> {
  // Parse JSON string ของ modelData
  const updateAIModelDto: UpdateAIModelDto = JSON.parse(modelData);

  // ส่งไปที่ service พร้อมกับไฟล์
  const message = await this.aiModelService.update(+id, updateAIModelDto, file);
  return message;
}


    @Get()
    findAll() {
      return this.aiModelService.findAll();
    }

    
    @Get(':aiId')
    findOne(@Param('aiId') aiId: number):Promise<AIModel> {
      return this.aiModelService.findOne(+aiId);
    }
  
  
    // @UseGuards(JwtGuard) 
    @Post('predict/:id')
    @UseInterceptors(FileInterceptor('file'))
    async predict(@Param('id') aiId: number,@UploadedFile() file: Express.Multer.File,): Promise<AIModel> {
      return this.aiModelService.predict(+aiId, file);
    }


    @Role("admin")
    @UseGuards(JwtGuard,RolesGuard)
    @Delete(':id/remove-ai')
    async removeAI(@Param('id') id:string ){
      return this.aiModelService.remove(+id);
    }



  



  }
  