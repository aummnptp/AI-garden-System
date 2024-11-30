import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIModel } from './entities/ai-model.entity';
import axios from 'axios';

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
  return{};
    // const model = await this.aiModelRepository.findOne({ where: { id: modelId } });
    // if (!model) {
    //   throw new NotFoundException('Model not found!');
    // }

    // const response = await axios.post(model.api_uri, {
    //   headers: { 'Content-Type': file.mimetype },
    //   data: file.buffer,
    // });

    // const responseKeysWithMeaning = model.responseKeys
    //   .map((item) => {
    //     const [key, meaning] = item.split(':');
    //     return { key, meaning };
    //   });

    // const filteredResponse = this.filterResponse(response.data, responseKeysWithMeaning);
    // const regressionParams = response.data[model.regression_params];

    // return {
    //   prediction: filteredResponse,
    //   regression_params: regressionParams,
    //   ai_type: model.ai_type,
    //   response_keys: responseKeysWithMeaning,
    // };
  }

  private filterResponse(responseJson: any, responseKeysWithMeaning: any[]): any {
    const filteredResponse = {};
    responseKeysWithMeaning.forEach(({ key }) => {
      filteredResponse[key] = responseJson[key] || 'ไม่มีข้อมูล';
    });
    return filteredResponse;
  }
}
