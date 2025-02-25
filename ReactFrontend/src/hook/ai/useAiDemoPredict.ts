import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { predictFromUrlService } from "../../api/services/AiService";
import { PredictResult } from "../../types/Ai";


export const useAiDemoPredict = () => {
  const { ai_id } = useParams<{ ai_id?: string }>();



  const predictFromUrl = useMutation<PredictResult, Error, string>({
    mutationFn: async (imageUrl) => {
      if (!ai_id) throw new Error("Missing AI ID");
      return predictFromUrlService(ai_id, imageUrl);
    },
  });


  return {predictFromUrl };
};
