  import { useMutation, useQueryClient } from "@tanstack/react-query";
  import { useNavigate } from "react-router-dom";
  import { AiModelData } from "../../types/Ai";
  import axios from "axios";
  import toast from "react-hot-toast";

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
        const formData = new FormData();
        if (uploadedFile) formData.append("file", uploadedFile);
        formData.append("modelData", JSON.stringify(modelData));

        const response = await axios.patch(
          `${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-models/${ai_id}/update-ai`,
          formData,
          { withCredentials: true }
        );
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["ai-models"] });
        queryClient.invalidateQueries({ queryKey: ["ai-model"] });
        toast.success("AI Model updated successfully!");
        navigate("/admin/admin-ai");
      },
      onError: (error: any) => {
        console.error("Error updating AI model:", error);
        toast.error(`Failed to update AI model: ${error.message}`);
      },
    });


    const deleteAiModel = useMutation({
      mutationFn: async (ai_id: string) => {
        await axios.delete(
          `${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-models/${ai_id}/remove-ai`,
          { withCredentials: true }
        );
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
        if (!uploadedFile) throw new Error("ต้องแนบไฟล์รูปภาพ!");
        const formData = new FormData();
        formData.append("file", uploadedFile);
        formData.append("modelData", JSON.stringify(modelData));
    
        const response = await axios.post(
          `${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-models/add`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
    
        return response.data;
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