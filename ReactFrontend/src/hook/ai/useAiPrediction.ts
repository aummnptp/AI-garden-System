import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

interface PredictResult {
  ai_type: string;
  prediction: any;
  regression_params?: any | null;
}

export const useAiPrediction = () => {
  const queryClient = useQueryClient();
  const { workspaceId, projectId, historyId } = useParams<{ workspaceId: string, projectId: string, historyId: string }>();

  const convertUrlToFile = async (url: string, fileName: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  }

  const predictFromImage = useMutation<PredictResult, Error, string>({
    mutationFn: async (customedImageUrl) => {
      if (!workspaceId || !projectId) throw new Error("Missing workspaceId or projectId");
      const file = await convertUrlToFile(customedImageUrl, "processedImage.jpg");
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/${workspaceId}/projects/predict/${projectId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["project-history", workspaceId, projectId] });
      await queryClient.invalidateQueries({
        queryKey: ["project-history-detail", workspaceId,
          projectId,
          historyId]
      });
      await queryClient.invalidateQueries({ queryKey: ["all-history-project", workspaceId] });
      await queryClient.invalidateQueries({ queryKey: ["project-statistic",  workspaceId, projectId] });
    },
    onError: () => {
      toast.error("Failed to predict!");
    },
  })


  const predictFromVideo = useMutation<PredictResult, Error, File>({
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["project-history", workspaceId, projectId] });
      await queryClient.invalidateQueries({
        queryKey: ["project-history-detail", workspaceId,
          projectId,
          historyId]
      });
      await queryClient.invalidateQueries({ queryKey: ["all-history-project", workspaceId] });
      await queryClient.invalidateQueries({ queryKey: ["project-statistic",  workspaceId, projectId] });
    },
    onError: () => {
      toast.error("Failed to predict!");
    },
  });
  return { predictFromImage, predictFromVideo };
}