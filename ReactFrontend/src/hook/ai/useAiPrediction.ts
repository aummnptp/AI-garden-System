import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";

interface PredictResult {
    ai_type: string;
    prediction: any;
    regression_params?: any | null;
  }
  
export const useAiPrediction = () => {
    const {workspaceId, projectId}=useParams<{workspaceId:string,projectId:string}>();

    const convertUrlToFile = async (url: string,fileName:string): Promise<File>=>{
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], fileName,{type:blob.type});
    } 

    const predictFromUrl = useMutation<PredictResult, Error, string>({
        mutationFn: async (customedImageUrl)=>{
            if (!workspaceId || !projectId) throw new Error("Missing workspaceId or projectId");
            const file = await convertUrlToFile(customedImageUrl, "processedImage.jpg");
            const formData = new FormData();
            formData.append("file",file);

            const response = await axios.post(
                `${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/${workspaceId}/projects/predict/${projectId}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
              );
        
              return response.data;
            },
    })


    const predictFromFile = useMutation<PredictResult, Error, File>({
        mutationFn: async (file) => {
          if (!workspaceId || !projectId) throw new Error("Missing workspaceId or projectId");
    
          const formData = new FormData();
          formData.append("file", file);
    
          const response = await axios.post(
            `${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/${workspaceId}/projects/predict/${projectId}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
    
          return response.data;
        },
      });
      return { predictFromUrl, predictFromFile };
}