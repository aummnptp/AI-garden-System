import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIModel } from './entities/ai-model.entity';
import axios from 'axios';
import * as FormData from 'form-data';
import { createReadStream } from 'fs'; // ใช้ในกรณีที่มีการอ่านไฟล์จากระบบ
import { CreateAIModelDto } from './dto/create-ai-model.dto';
import { UpdateAIModelDto } from './dto/update-ai-model.dto';

@Injectable()
export class AIModelService {
  constructor(
    @InjectRepository(AIModel)
    private aiModelRepository: Repository<AIModel>,
  ) {}

  async addModel(createAIModelDto: CreateAIModelDto, file: Express.Multer.File): Promise<string> {
    let responseKeys = [];
  
    if (typeof createAIModelDto.response_keys === 'string') {
      try {
        responseKeys = JSON.parse(createAIModelDto.response_keys);
      } catch (error) {
        throw new Error('Invalid JSON format for response_keys');
      }
    } else if (Array.isArray(createAIModelDto.response_keys)) {
      responseKeys = createAIModelDto.response_keys;
    }
  
    const newModel = this.aiModelRepository.create({
      name: createAIModelDto.name,
      description: createAIModelDto.description,
      ai_type: createAIModelDto.ai_type,
      api_uri: createAIModelDto.api_uri,
      input_desc: createAIModelDto.input_desc,
      ai_tag: createAIModelDto.ai_tag || [],
      response_keys: responseKeys.map((key) => ({
        key: key.key,
        meaning: key.meaning,
        displayFormat: key.displayFormat,
      })),
      imagePath: file ? `/uploads/${file.filename}` : null,
    });
  
    await this.aiModelRepository.save(newModel);
    return 'Model added successfully!';
  }  

  async update(id: number, updateAIModelDto: UpdateAIModelDto, file?: Express.Multer.File): Promise<string> {
    const existingModel = await this.aiModelRepository.findOne({ where: { id } });
  
    if (!existingModel) {
      throw new NotFoundException(`AI Model with Id ${id} not found`);
    }
  
    // อัปเดตข้อมูลจาก DTO ที่ได้รับ
    const updatedModelData: Partial<AIModel> = { ...updateAIModelDto };
  
    // หากมีไฟล์ใหม่ให้เปลี่ยนแปลงไฟล์
    if (file) {
      const fileName = file.filename;  // เก็บชื่อไฟล์ที่ถูกอัปโหลด
      updatedModelData.imagePath = `/uploads/${fileName}`;  // เก็บเส้นทางไฟล์ใน imagePath
    }
  
    // อัปเดตข้อมูลในฐานข้อมูล
    await this.aiModelRepository.update(id, updatedModelData);
  
    return 'Model updated successfully!';
  }
  
  
  findAll(): Promise<AIModel[]> {
    return this.aiModelRepository.find();
  }

  // อ่าน AIModel ตาม id
  findOne(id: number): Promise<AIModel | null> {
    return this.aiModelRepository.findOneBy({ id });
  }
  
  remove(id: number): Promise<void> {
    return this.aiModelRepository.delete(id).then(() => undefined);
  }
  
  
  
  async predict(modelId: number, file: Express.Multer.File): Promise<any> {
    const model = await this.aiModelRepository.findOne({ where: { id: modelId } });
    if (!model) {
      throw new NotFoundException('Model not found!');
    }
  
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
  
    try {
      const response = await axios.post(model.api_uri, formData, {
        headers: { ...formData.getHeaders() },
      });
  
      if (!response.data) {
        throw new BadRequestException('No response from external API');
      }
  
      return {
        response_keys: model.response_keys,
        prediction: response.data,
        ai_type: model.ai_type,
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Error during prediction:', errorMessage);
      throw new InternalServerErrorException(`Prediction failed: ${errorMessage}`);
    }
  }
  
}
