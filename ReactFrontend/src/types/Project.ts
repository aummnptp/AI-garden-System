import { AIDataType } from "./Ai";

export type ProjectType ={
    aiId: string;
    name: string;
    description: string;
    ai_tag: string[];
    imagePath: string;
    ai_type: string;
  }



//   export type Project= {
//     project_id: string;
//     name: string;
//     description: string;
//     input_type: string;
//     image_path: string | null;
//     create_at: string;
//     update_at: string;
//     permission_only: boolean;
//     ai_model: AIDataType;
//   }
  