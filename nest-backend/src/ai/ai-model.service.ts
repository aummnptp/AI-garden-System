import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIModel } from './entities/ai-model.entity';
import axios from 'axios';
import * as FormData from 'form-data';
import { createReadStream } from 'fs'; // ใช้ในกรณีที่มีการอ่านไฟล์จากระบบ
import { CreateAIModelDto } from './dto/create-ai-model.dto';
import { UpdateAIModelDto } from './dto/update-ai-model.dto';
import { Permission } from '../permission/entities/permission.entity';

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
  
      const responseKeysWithMeaning = model.response_keys;
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

  private filterResponse(responseJson: any, responseKeysWithMeaning: any[]): any {
    const filteredResponse = {};
    responseKeysWithMeaning.forEach(({ key }) => {
      filteredResponse[key] = responseJson[key] || 'ไม่มีข้อมูล';
    });
    return filteredResponse;
  }

   async update(id: number, updateAIModelDto: UpdateAIModelDto):Promise<string> {
    const existingModel = await  this.aiModelRepository.findOne({where: {id}})
    if (!existingModel){
      throw new NotFoundException(`AI Model with Id ${id} not found`)
    }

      await this.aiModelRepository.update(id, updateAIModelDto);
      return 'Model updated successfully!';
    }

    async getApprovedAiModelsByUserId(userId: number): Promise<AIModel[]> {
      return this.aiModelRepository
        .createQueryBuilder('aiModel')
        .innerJoin('aiModel.permissions', 'permission') // Assumes a relation is defined
        .where('permission.user_id = :userId', { userId })
        .andWhere('permission.approve = :approve', { approve: true })
        .getMany();
    }
  
}
