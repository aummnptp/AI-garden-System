import { AIDataType } from "./Ai";

export type ProjectDataType = {
  projectId: string;
  name: string;
  description: string;
  imagePath: string;
  ai_model:AIDataType
}

