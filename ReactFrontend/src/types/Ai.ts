export type AIDataType ={
    aiId: string;
    name: string;
    description: string;
    ai_tag: string[];
    imagePath: string;
    ai_type: string;
    enable:boolean;
    visible:boolean;
    input_desc: string;
    inputType: string
  }


  export type AiModelData ={
    name: string;
    description: string;
    api_uri: string;
    response_keys: ResponseKey[];
    input_desc: string;
    image_path?: string; 
    ai_type: string;
    ai_tag: any[];
    colorSet:string[];
    enable:boolean;
    visible:boolean;
    inputType: string
    

  }

  export type ResponseKey= {
    key: string;
    meaning: string
    displayFormat: string;
  }