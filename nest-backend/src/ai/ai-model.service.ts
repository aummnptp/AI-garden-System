import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIModel } from './entities/ai-model.entity';
import axios from 'axios';
import * as FormData from 'form-data';
import { createReadStream } from 'fs'; // ใช้ในกรณีที่มีการอ่านไฟล์จากระบบ
import { CreateAIModelDto } from './dto/create-ai-model.dto';
import { UpdateAIModelDto } from './dto/update-ai-model.dto';
import { Permission } from '../permission/entities/permission.entity';
import { User } from 'src/user/entities/user.entity';
import { convertDetectionsToPolygons } from '../common/utils/polygon.util';


@Injectable()
export class AIModelService {
  constructor(
    @InjectRepository(AIModel)
    private aiModelRepository: Repository<AIModel>,
       @InjectRepository(User)
        private userRepository: Repository<User>,
  ) { }

  async addModel(
    createAIModelDto: CreateAIModelDto,
    file: Express.Multer.File,
     userId: string
  ): Promise<string> {
    let responseKeys = [];
    const userProfile = await this.userRepository.findOne({ where: { userId: userId } });
    if (!userProfile) {
      throw new NotFoundException('User not found');
    }
    // Parse response_keys to ensure it's an array
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
      inputType: createAIModelDto.inputType,
      createdBy: userProfile, 
    });

    await this.aiModelRepository.save(newModel);
    return 'Model added successfully!';
  }  

  async update(aiId: string, updateAIModelDto: UpdateAIModelDto, file?: Express.Multer.File): Promise<string> {
    const existingModel = await this.aiModelRepository.findOne({ where: { aiId: aiId } });
    if (!existingModel) {
      throw new NotFoundException(`AI Model with Id ${aiId} not found`);
    }
  
    const updatedModelData: Partial<AIModel> = { ...updateAIModelDto };
  
    // หากมีไฟล์ใหม่ให้เปลี่ยนแปลงไฟล์และอัปเดต imagePath
    if (file) {
      const fileName = file.filename;
      updatedModelData.imagePath = `/uploads/${fileName}`;
    }
  
    // อัปเดตข้อมูลในฐานข้อมูล
    await this.aiModelRepository.update(aiId, updatedModelData);
  
    return 'Model updated successfully!';
  }
  
  async findAll(filters?:{search:string;type?:string;tag?:string},isAdmin: boolean = false,
    userId?: string,
    approvedOnly?: boolean 
  ): Promise<AIModel[]> {
    const queryBuilder = this.aiModelRepository.createQueryBuilder("aiModel");
    if (filters?.search) {
      queryBuilder.andWhere(
        "(aiModel.name ILIKE :search OR aiModel.description ILIKE :search)",
        { search: `%${filters.search}%` }
      );
    }
    if (filters?.type) {
      queryBuilder.andWhere("aiModel.ai_type = :type", { type: filters.type });
    }
    if (filters?.tag) {
      queryBuilder.andWhere("aiModel.ai_tag LIKE :tag", { tag: `%${filters.tag}%` });
    }
    if (!isAdmin) {
      queryBuilder.andWhere("aiModel.enable = :enable", { enable: true });
      queryBuilder.andWhere("aiModel.visible = :visible", { visible: true });
    }
    if (approvedOnly && userId) {
      queryBuilder.innerJoin("aiModel.permissions", "permission")
        .andWhere("permission.user_id = :userId", { userId })
        .andWhere("permission.approve = :approve", { approve: true });
    }
    return await queryBuilder.getMany();
  }

  async findOne(aiId: string): Promise<AIModel> {
    const aiModel = await this.aiModelRepository.findOneBy({ aiId:aiId  });
    if (!aiModel) {
      throw new NotFoundException(`AI Model with id ${aiId} not found`);
    }
    return aiModel
  }
  
  remove(aiId: string): Promise<void> {
    return this.aiModelRepository.delete(aiId).then(() => undefined);
  }
  
  
  
  async predict(aiId: string, file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const model = await this.aiModelRepository.findOne({ where: { aiId: aiId } });
    if (!model) {
      throw new NotFoundException('Model not found!');
    }
    
    const formData = new FormData();
    // เมื่อ file มีค่าแล้ว เราจะเข้าถึง file.buffer
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
    ai_model: model,
  };
    } catch (error: any) {
      if (error.code === 'ECONNRESET') {
        console.error('Connection Reset Error: The connection was forcibly closed by the remote host');
        throw new InternalServerErrorException('Connection reset by the remote server');
      } else if (error.response) {
        console.error('API error:', error.response.data);
        throw new InternalServerErrorException(`Prediction failed: ${error.response.data}`);
      } else if (error.request) {
        console.error('No response from API:', error.request);
        throw new InternalServerErrorException('Prediction failed: No response from API');
      } else {
        console.error('Error message:', error.message);
        throw new InternalServerErrorException(`Prediction failed: ${error.message}`);
      }
    }
  }




  async findAllWithDetails() {
    return this.aiModelRepository.find({
      relations: ['permissions'], // ระบุความสัมพันธ์กับ user และ ai
    });
  }

  async findAllWithApprovalStatus(userId: string): Promise<any[]> {
    const models = await this.aiModelRepository
      .createQueryBuilder('aiModel')
      .leftJoinAndSelect('aiModel.permissions', 'permission', 'permission.user_id = :userId', { userId })
      .getMany();
  
    return models;
  }
  
  




  async getApprovedAiModelsByUserId(userId: string): Promise<AIModel[]> {
    return this.aiModelRepository
      .createQueryBuilder('aiModel')
      .innerJoin('aiModel.permissions', 'permission') // Assumes a relation is defined
      .where('permission.user_id = :userId', { userId })
      .andWhere('permission.approve = :approve', { approve: true })
      .getMany();
  }

  async getMyApproved(userId: string, isAdmin: boolean): Promise<AIModel[]> {
    const queryBuilder = this.aiModelRepository.createQueryBuilder('aiModel');
  
    if (isAdmin) {
      // ✅ Admin ได้รับทุก AI Model
      return queryBuilder.getMany();
    }
  
    // ✅ User ทั่วไป ได้รับเฉพาะ AI ที่ได้รับสิทธิ์
    return queryBuilder
      .innerJoin('aiModel.permissions', 'permission')
      .where('permission.user_id = :userId', { userId })
      .andWhere('permission.approve = :approve', { approve: true })
      .getMany();
  }

 async getUniqueAITags(): Promise<string[]> {
  const aiModels = await this.aiModelRepository.find({ select: ["ai_tag"] });
  const allTags = aiModels.flatMap(model => model.ai_tag || []);
  return [...new Set(allTags)];
}
}