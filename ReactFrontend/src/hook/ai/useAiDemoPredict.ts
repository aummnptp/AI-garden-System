import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { predictFromImageService, predictFromVideoService } from "../../api/services/AiService";
import { PredictResult } from "../../types/Ai";



export const useAiDemoPredict = () => {
  const { ai_id } = useParams<{ ai_id?: string }>();



  const predictFromImage = useMutation<PredictResult, Error, string>({
    mutationFn: async (imageUrl) => {
      if (!ai_id) throw new Error("Missing AI ID");
      return predictFromImageService(ai_id, imageUrl);
    },
  });

  const predictFromVideo = useMutation<PredictResult, Error, File>({
      mutationFn: async (file) => {
        if (!ai_id) throw new Error("Missing AI ID");
        return predictFromVideoService(ai_id, file);
      },
    });

  return {predictFromImage, predictFromVideo };
};
