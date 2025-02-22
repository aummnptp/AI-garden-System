import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";

interface PredictResult {
  ai_type: string;
  prediction: any;
  regression_params?: any | null;
}

export const useAiDemoPredict = () => {
  const { ai_id } = useParams<{ ai_id?: string }>();


  const convertUrlToFile = async (url: string, fileName: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  };

  const predictFromUrl = useMutation<PredictResult, Error, string>({
    mutationFn: async (customedImageUrl) => {
      if (!ai_id) throw new Error("Missing AI ID");
  
      try {
        const file = await convertUrlToFile(customedImageUrl, "processedImage.jpg");
        const formData = new FormData();
        formData.append("file", file);
  
        const response = await axios.post(
          `${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-models/predict/${ai_id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
  
        return response.data;
      } catch (error: any) {
        // ดึงข้อความ error จาก response หรือใช้ fallback message
        const errorMessage = error.response?.data?.message || "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ";
        throw new Error(errorMessage);
      }
    },
  });

  return {predictFromUrl };
};
