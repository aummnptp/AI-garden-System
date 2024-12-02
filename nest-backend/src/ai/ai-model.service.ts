import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIModel } from './entities/ai-model.entity';
import axios from 'axios';
import * as FormData from 'form-data';
import { createReadStream } from 'fs'; // ใช้ในกรณีที่มีการอ่านไฟล์จากระบบ
import { CreateAIModelDto } from './dto/create-ai-model.dto';

@Injectable()
export class AIModelService {
  constructor(
    @InjectRepository(AIModel)
    private aiModelRepository: Repository<AIModel>,
  ) {}

  async addModel(createAIModelDto: CreateAIModelDto): Promise<string> {
    const newModel = this.aiModelRepository.create({
      ...createAIModelDto,
    });
  
    await this.aiModelRepository.save(newModel);
    return 'Model added successfully!';
  }

  
  async predict(modelId: number, file: Express.Multer.File): Promise<any> {
    const model = await this.aiModelRepository.findOne({ where: { id: modelId } });
    if (!model) {
      throw new NotFoundException('Model not found!');
    }
  
    // สร้าง FormData และเพิ่มข้อมูล
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname); // เพิ่มไฟล์
    // หากมีข้อมูลเพิ่มเติมสามารถเพิ่มได้
    // formData.append('other_field', 'value');
  
    try {
      // ใช้ formData และตั้งค่า headers
      const response = await axios.post(model.api_uri, formData, {
        headers: {
          ...formData.getHeaders(), // Headers ที่สร้างจาก FormData
        },
      });
  
      const responseKeysWithMeaning = model.responseKeys;
      const filteredResponse = this.filterResponse(response.data, responseKeysWithMeaning);
  
      return {
        prediction: filteredResponse,
        ai_type: model.ai_type,
        response_keys: responseKeysWithMeaning,
      };
    } catch (error) {
      console.error('Error during prediction:', error.response?.data || error.message);
      throw new Error('Failed to process prediction request.');
    }
  }

  private filterResponse(responseJson: any, responseKeysWithMeaning: any[]): any {
    const filteredResponse = {};
    responseKeysWithMeaning.forEach(({ key }) => {
      filteredResponse[key] = responseJson[key] || 'ไม่มีข้อมูล';
    });
    return filteredResponse;
  }
}
