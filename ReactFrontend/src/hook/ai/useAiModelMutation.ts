  import { useMutation, useQueryClient } from "@tanstack/react-query";
  import { useNavigate } from "react-router-dom";
  import { AiModelData } from "../../types/Ai";
  import axios from "axios";
  import toast from "react-hot-toast";
import { addAiModelService, deleteAiModelService, updateAiModelService } from "../../api/services/AiService";

  interface UpdateAiModelProps {
    ai_id: string;
    modelData: AiModelData;
    uploadedFile?: File | null;
  }

  interface AddAiModelProps {
    modelData: AiModelData;
    uploadedFile?: File | null;
  }
  export const useAiModelMutation = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Update AI Model
    const updateAiModel = useMutation({
      mutationFn: async ({ ai_id, modelData, uploadedFile }: UpdateAiModelProps) => {
        if (!uploadedFile) {
          throw new Error("ต้องแนบไฟล์รูปภาพ!");
        }
        return updateAiModelService(ai_id, modelData, uploadedFile);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["ai-models"] });
        queryClient.invalidateQueries({ queryKey: ["ai-model"] });
        toast.success("AI Model updated successfully!");
        navigate("/admin/admin-ai");
      },
      onError: (error: any) => {
        toast.error(`Failed to update AI model: ${error.message}`);
      },
    });


    const deleteAiModel = useMutation({
      mutationFn: async (ai_id: string) => {
        await deleteAiModelService(ai_id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["ai-models"] });
        toast.success("AI Model deleted successfully!");
        navigate("/admin/admin-ai");
      },
      onError: (error: any) => {
        toast.error(`Failed to delete AI model: ${error.message}`);
      },
    });



    const addAiModel = useMutation({
      mutationFn: async ({ modelData, uploadedFile }: AddAiModelProps) => {
        if (!uploadedFile) {
          throw new Error("ต้องแนบไฟล์รูปภาพ!");
        }
        return addAiModelService(modelData, uploadedFile);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["ai-models"] });
        toast.success("AI Model added successfully!");
        navigate("/admin/admin-ai");
      },
      onError: (error) => {
        toast.error(`Failed to add AI Model. ${error.message}`);
      },
    });
    return { updateAiModel, deleteAiModel ,addAiModel};
  };